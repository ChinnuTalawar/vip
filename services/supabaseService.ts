import { supabase } from './supabaseClient';
import { Event, User, RosterEntry, DashboardStats, Shift, CollegeInfo } from '../types';

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
    }));
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

export const createEvent = async (eventData: any) => {
    // 1. Insert Event
    const { data: event, error } = await supabase
        .from('events')
        .insert({
            id: `e_${Date.now()}`,
            name: eventData.name,
            date: eventData.date,
            location: eventData.location,
            description: eventData.description,
            image_url: eventData.imageUrl,
            category: 'Community', // Default or passed
            status: eventData.status || 'Published'
        })
        .select()
        .single();

    if (error) throw error;

    // 2. Create Shifts (simplified)
    const shiftsCount = eventData.shifts || 1;
    const slotsPerShift = Math.ceil((eventData.totalSlots || 10) / shiftsCount);

    const shiftsToInsert = Array.from({ length: shiftsCount }).map((_, i) => ({
        id: `s_${event.id}_${i}`,
        event_id: event.id,
        role: 'General Volunteer',
        start_time: '09:00',
        end_time: '17:00',
        required_count: slotsPerShift,
        filled_count: 0
    }));

    const { error: shiftsError } = await supabase
        .from('shifts')
        .insert(shiftsToInsert);

    if (shiftsError) console.error('Error creating shifts:', shiftsError);

    return event;
};

export const updateEvent = async (id: string, eventData: any) => {
    const { data, error } = await supabase
        .from('events')
        .update({
            name: eventData.name,
            date: eventData.date,
            location: eventData.location,
            description: eventData.description,
            image_url: eventData.imageUrl,
            status: eventData.status
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteEvent = async (id: string) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
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



export const joinEvent = async (userId: string, eventId: string): Promise<{ success: boolean, message?: string, qrCode?: string }> => {
    try {
        // 1. Get shifts for the event
        const { data: shifts, error: shiftsError } = await supabase
            .from('shifts')
            .select('id')
            .eq('event_id', eventId)
            .limit(1);

        if (shiftsError || !shifts || shifts.length === 0) {
            return { success: false, message: 'No shifts available for this event.' };
        }

        const shiftId = shifts[0].id;

        // 2. Check if already joined
        const { data: existing } = await supabase
            .from('roster_entries')
            .select('id')
            .eq('user_id', userId)
            .eq('shift_id', shiftId)
            .single();

        if (existing) {
            return { success: false, message: 'You have already joined this event.' };
        }

        // 3. Join (Insert roster entry)
        // We use the ID as the unique QR code identifier.
        const newRosterId = `r_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const { data, error } = await supabase
            .from('roster_entries')
            .insert({
                id: newRosterId,
                user_id: userId,
                shift_id: shiftId,
                status: 'Confirmed' // Auto-confirm for now
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, qrCode: data.id };
    } catch (error) {
        console.error('Error joining event:', error);
        return { success: false, message: 'Failed to join event.' };
    }
};

export const getUserSchedule = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('roster_entries')
        .select(`
            id,
            status,
            shifts (
                id,
                role,
                start_time,
                end_time,
                events (
                    id,
                    name,
                    date,
                    location,
                    image_url
                )
            )
        `)
        .eq('user_id', userId)
        .in('status', ['Confirmed', 'Pending', 'CheckIn', 'Completed']);

    if (error) {
        console.error('Error fetching user schedule:', error);
        return [];
    }

    return data.map((entry: any) => ({
        id: entry.id,
        eventId: entry.shifts.events.id,
        eventName: entry.shifts.events.name,
        eventDate: entry.shifts.events.date,
        eventLocation: entry.shifts.events.location,
        eventImage: entry.shifts.events.image_url,
        role: entry.shifts.role,
        shiftId: entry.shifts.id,
        startTime: entry.shifts.start_time,
        endTime: entry.shifts.end_time,
        status: entry.status
    }));
};

export const getUserCompletedEvents = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('roster_entries')
        .select(`
            id,
            status,
            shifts (
                id,
                role,
                start_time,
                end_time,
                events (
                    id,
                    name,
                    date,
                    location,
                    image_url
                )
            )
        `)
        .eq('user_id', userId)
        .eq('status', 'Completed');

    if (error) {
        console.error('Error fetching completed events:', error);
        return [];
    }

    return data.map((entry: any) => {
        const start = new Date(`1970-01-01T${entry.shifts.start_time}`);
        const end = new Date(`1970-01-01T${entry.shifts.end_time}`);
        const hours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));

        return {
            id: entry.id,
            eventId: entry.shifts.events.id,
            eventName: entry.shifts.events.name,
            eventDate: entry.shifts.events.date,
            eventLocation: entry.shifts.events.location,
            eventImage: entry.shifts.events.image_url,
            role: entry.shifts.role,
            shiftId: entry.shifts.id,
            startTime: entry.shifts.start_time,
            endTime: entry.shifts.end_time,
            hours: parseFloat(hours.toFixed(1)),
            status: entry.status
        };
    });
};


export const getEventShifts = async (eventId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('event_id', eventId);

    if (error) {
        console.error('Error fetching event shifts:', error);
        return [];
    }
    return data;
};

export const updateRosterShift = async (rosterId: string, newShiftId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('roster_entries')
        .update({ shift_id: newShiftId })
        .eq('id', rosterId);

    if (error) {
        console.error('Error updating roster shift:', error);
        return false;
    }
    return true;
};

export const cancelRosterEntry = async (rosterId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('roster_entries')
        .delete()
        .eq('id', rosterId);

    if (error) {
        console.error('Error canceling roster entry:', error);
        return false;
    }
    return true;
};

export const getAllVolunteers = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from('users')
        .select(`
            *,
            roster_entries(count)
        `)
        .eq('role', 'VOLUNTEER');

    if (error) {
        console.error('Error fetching volunteers:', error);
        return [];
    }

    // Map to include event count
    return data.map((user: any) => ({
        ...user,
        eventsCount: user.roster_entries?.[0]?.count || 0
    }));
};

// Swap Requests
export const createSwapRequest = async (senderId: string, receiverId: string, rosterEntryId: string): Promise<boolean> => {
    // Assuming a 'swap_requests' table exists
    const { error } = await supabase
        .from('swap_requests')
        .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            roster_entry_id: rosterEntryId,
            status: 'Pending'
        });

    if (error) {
        console.error('Error creating swap request:', error);
        return false;
    }
    return true;
};

export const getPendingSwapRequests = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('swap_requests')
        .select(`
            id,
            sender:sender_id (name, avatar),
            roster_entry:roster_entry_id (
                shifts (
                    role,
                    events (name, date)
                )
            )
        `)
        .eq('receiver_id', userId)
        .eq('status', 'Pending');

    if (error) {
        console.error('Error fetching swap requests:', error);
        return [];
    }
    return data;
};

export const getOutgoingSwapRequests = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('swap_requests')
        .select(`
            id,
            status,
            receiver:receiver_id (name, avatar),
            roster_entry:roster_entry_id (
                shifts (
                    role,
                    events (name, date)
                )
            )
        `)
        .eq('sender_id', userId);

    if (error) {
        console.error('Error fetching outgoing swap requests:', error);
        return [];
    }
    return data;
};

export const respondToSwapRequest = async (requestId: string, status: 'Accepted' | 'Declined'): Promise<boolean> => {
    const { data: request, error: fetchError } = await supabase
        .from('swap_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (fetchError || !request) return false;

    if (status === 'Accepted') {
        // Perform the transfer
        const { error: updateError } = await supabase
            .from('roster_entries')
            .update({ user_id: request.receiver_id })
            .eq('id', request.roster_entry_id);

        if (updateError) {
            console.error('Error transferring roster entry:', updateError);
            return false;
        }
    }

    const { error: statusError } = await supabase
        .from('swap_requests')
        .update({ status })
        .eq('id', requestId);

    return !statusError;
};

export const subscribeToEvents = (onUpdate: () => void) => {
    const subscription = supabase
        .channel('events_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
            onUpdate();
        })
        .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
};

// College Info Functions
export const createCollegeInfo = async (collegeData: Omit<CollegeInfo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
        .from('college_info')
        .insert({
            id: `college_${Date.now()}`,
            college_name: collegeData.collegeName,
            college_address: collegeData.collegeAddress,
            college_city: collegeData.collegeCity,
            college_state: collegeData.collegeState,
            college_pincode: collegeData.collegePincode,
            college_phone: collegeData.collegePhone,
            college_email: collegeData.collegeEmail,
            college_website: collegeData.collegeWebsite,
            contact_person_name: collegeData.contactPersonName,
            contact_person_designation: collegeData.contactPersonDesignation,
            contact_person_phone: collegeData.contactPersonPhone,
            contact_person_email: collegeData.contactPersonEmail
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getAllColleges = async (): Promise<CollegeInfo[]> => {
    const { data, error } = await supabase
        .from('college_info')
        .select('*')
        .order('college_name', { ascending: true });

    if (error) {
        console.error('Error fetching colleges:', error);
        return [];
    }

    return data.map((college: any) => ({
        id: college.id,
        collegeName: college.college_name,
        collegeAddress: college.college_address,
        collegeCity: college.college_city,
        collegeState: college.college_state,
        collegePincode: college.college_pincode,
        collegePhone: college.college_phone,
        collegeEmail: college.college_email,
        collegeWebsite: college.college_website,
        contactPersonName: college.contact_person_name,
        contactPersonDesignation: college.contact_person_designation,
        contactPersonPhone: college.contact_person_phone,
        contactPersonEmail: college.contact_person_email,
        createdAt: college.created_at,
        updatedAt: college.updated_at
    }));
};

export const getCollegeById = async (id: string): Promise<CollegeInfo | null> => {
    const { data, error } = await supabase
        .from('college_info')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;

    return {
        id: data.id,
        collegeName: data.college_name,
        collegeAddress: data.college_address,
        collegeCity: data.college_city,
        collegeState: data.college_state,
        collegePincode: data.college_pincode,
        collegePhone: data.college_phone,
        collegeEmail: data.college_email,
        collegeWebsite: data.college_website,
        contactPersonName: data.contact_person_name,
        contactPersonDesignation: data.contact_person_designation,
        contactPersonPhone: data.contact_person_phone,
        contactPersonEmail: data.contact_person_email,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
};

export const getCollegeEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('events')
        .select(`
            *,
            shifts (*),
            college_info (*)
        `)
        .not('college_id', 'is', null);

    if (error) {
        console.error('Error fetching college events:', error);
        return [];
    }

    return data.map((event: any) => ({
        ...event,
        imageUrl: event.image_url,
        totalSlots: event.shifts?.reduce((acc: number, s: any) => acc + s.required_count, 0) || 0,
        volunteers: event.shifts?.reduce((acc: number, s: any) => acc + s.filled_count, 0) || 0,
        shifts: event.shifts?.length || 0,
        collegeInfo: event.college_info ? {
            id: event.college_info.id,
            collegeName: event.college_info.college_name,
            collegeCity: event.college_info.college_city,
            collegeState: event.college_info.college_state
        } : null
    }));
};

