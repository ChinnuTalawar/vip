import { supabase } from './supabaseClient';
import { Event, User, RosterEntry, DashboardStats, Shift } from '../types';

// Helper function to get Supabase storage public URL
export const getStorageUrl = (fileName: string): string => {
    const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);
    return data.publicUrl;
};


export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('events')
        .select(`
      *,
      shifts (*)
    `);

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }

    // Map database fields to TypeScript interface if needed (e.g. snake_case to camelCase)
    // Assuming DB columns match TS interface or using a mapper
    return data.map((event: any) => ({
        ...event,
        imageUrl: event.image_url,
        shifts: event.shifts.map((shift: any) => ({
            ...shift,
            startTime: shift.start_time,
            endTime: shift.end_time,
            requiredCount: shift.required_count,
            filledCount: shift.filled_count
        }))
    })) as Event[];
};

export const getEventById = async (id: string): Promise<Event | null> => {
    const { data, error } = await supabase
        .from('events')
        .select(`
      *,
      shifts (*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching event ${id}:`, error);
        return null;
    }

    return {
        ...data,
        imageUrl: data.image_url,
        shifts: data.shifts.map((shift: any) => ({
            ...shift,
            startTime: shift.start_time,
            endTime: shift.end_time,
            requiredCount: shift.required_count,
            filledCount: shift.filled_count
        }))
    } as Event;
};

export const getUserById = async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select(`
      *,
      user_skills (skill)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }

    return {
        ...data,
        totalHours: data.total_hours,
        skills: data.user_skills.map((us: any) => us.skill)
    } as User;
};

export const getRosterForEvent = async (eventId: string): Promise<RosterEntry[]> => {
    const { data, error } = await supabase
        .from('roster_entries')
        .select(`
      id,
      status,
      users (name, email, avatar),
      shifts (role, event_id)
    `)
        .eq('shifts.event_id', eventId); // Note: This filtering might need a join or separate query depending on Supabase support for deep filtering

    // Alternative: Select roster entries where shift_id is in (select id from shifts where event_id = ...)
    // For simplicity, let's fetch all roster entries for shifts of this event

    // Better query:
    const { data: shifts } = await supabase.from('shifts').select('id').eq('event_id', eventId);
    const shiftIds = shifts?.map(s => s.id) || [];

    if (shiftIds.length === 0) return [];

    const { data: roster, error: rosterError } = await supabase
        .from('roster_entries')
        .select(`
      id,
      status,
      users (name, email, avatar),
      shifts (role, event_id, events(name, date))
    `)
        .in('shift_id', shiftIds);

    if (rosterError) {
        console.error('Error fetching roster:', rosterError);
        return [];
    }

    return roster.map((entry: any) => ({
        id: entry.id,
        volunteerName: entry.users.name,
        volunteerEmail: entry.users.email,
        eventName: entry.shifts.events.name,
        shiftRole: entry.shifts.role,
        date: entry.shifts.events.date,
        status: entry.status,
        avatar: entry.users.avatar
    })) as RosterEntry[];
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    // This would ideally be a set of RPC calls or separate queries
    const { data: users } = await supabase.from('users').select('total_hours');
    const totalHours = users?.reduce((sum, user) => sum + (user.total_hours || 0), 0) || 0;

    const { count: activeVolunteers } = await supabase
        .from('roster_entries')
        .select('user_id', { count: 'exact', head: true })
        .in('status', ['Confirmed', 'Completed']); // This counts entries, not distinct users. For distinct, we need a different approach or RPC.

    // For distinct active volunteers (client side approx for now)
    const { data: roster } = await supabase.from('roster_entries').select('user_id').in('status', ['Confirmed', 'Completed']);
    const uniqueVolunteers = new Set(roster?.map(r => r.user_id)).size;

    const { count: openShifts } = await supabase
        .from('shifts')
        .select('*', { count: 'exact', head: true })
        .lt('filled_count', 1000); // Hacky, better to compare with required_count. 
    // Supabase filter doesn't support col comparison easily in JS client without RPC.
    // We'll fetch all shifts and filter in JS for this stat or use RPC.

    const { data: shifts } = await supabase.from('shifts').select('filled_count, required_count');
    const openShiftsCount = shifts?.filter(s => s.filled_count < s.required_count).length || 0;

    const { count: upcomingEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString());

    return {
        totalHours,
        activeVolunteers: uniqueVolunteers,
        openShifts: openShiftsCount,
        upcomingEvents: upcomingEvents || 0
    };
};

export const uploadEventImage = async (file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('event-images')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('event-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

export const exportRosterToCSV = async (): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // 1. Get events organized by user
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('id')
            .eq('organizer_id', user.id);

        if (eventsError) throw eventsError;
        if (!events || events.length === 0) {
            console.log('No events found for this manager.');
            return false;
        }

        const eventIds = events.map(e => e.id);

        // 2. Get shifts for these events
        const { data: shifts, error: shiftsError } = await supabase
            .from('shifts')
            .select('id')
            .in('event_id', eventIds);

        if (shiftsError) throw shiftsError;
        if (!shifts || shifts.length === 0) {
            console.log('No shifts found for these events.');
            return false;
        }

        const shiftIds = shifts.map(s => s.id);

        // 3. Get roster entries with full details
        const { data: rosterData, error: rosterError } = await supabase
            .from('roster_entries')
            .select(`
                status,
                users (name, email),
                shifts (
                    role,
                    start_time,
                    end_time,
                    events (name, date)
                )
            `)
            .in('shift_id', shiftIds);

        if (rosterError) throw rosterError;
        if (!rosterData || rosterData.length === 0) {
            console.log('No roster entries found.');
            return false;
        }

        // 4. Format Data for CSV
        const csvRows = [
            ['Event Name', 'Job/Role', 'Shift Date', 'Shift Start Time', 'Shift End Time', 'Volunteer Name', 'Volunteer Email', 'Manager Name', 'Manager Email']
        ];

        rosterData.forEach((entry: any) => {
            csvRows.push([
                entry.shifts.events.name,
                entry.shifts.role,
                new Date(entry.shifts.events.date).toLocaleDateString(),
                entry.shifts.start_time,
                entry.shifts.end_time,
                entry.users.name,
                entry.users.email,
                user.email || 'Unknown', // Manager Name/Email (using current user)
                user.email || 'Unknown'
            ]);
        });

        const csvContent = csvRows.map(e => e.join(",")).join("\n");

        // 5. Trigger Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `MyVolunteerRoster_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
    } catch (error) {
        console.error('Error exporting roster:', error);
        return false;
    }
};
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('Error deleting user account:', error);
        return false;
    }
    return true;
};
