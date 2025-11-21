import { supabase } from './supabaseClient';
import { Event, User, RosterEntry, DashboardStats, Shift } from '../types';

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
