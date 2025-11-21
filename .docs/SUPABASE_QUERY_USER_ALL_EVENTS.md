# Supabase Query: Get User All Events (My Events Section)

## Overview
This document explains the `getUserAllEvents` function - a comprehensive Supabase query designed to fetch all events (both upcoming and completed) for a user's "My Events" section.

## Function Signature

```typescript
export const getUserAllEvents = async (userId: string): Promise<any[]>
```

## SQL Query Breakdown

### Main Query
```sql
SELECT 
    roster_entries.id,
    roster_entries.status,
    roster_entries.created_at,
    shifts.id,
    shifts.role,
    shifts.start_time,
    shifts.end_time,
    events.id,
    events.name,
    events.date,
    events.location,
    events.description,
    events.image_url,
    events.category
FROM roster_entries
INNER JOIN shifts ON roster_entries.shift_id = shifts.id
INNER JOIN events ON shifts.event_id = events.id
WHERE roster_entries.user_id = ?
ORDER BY roster_entries.created_at DESC
```

### Supabase JavaScript Client Version
```typescript
const { data, error } = await supabase
    .from('roster_entries')
    .select(`
        id,
        status,
        created_at,
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
                description,
                image_url,
                category
            )
        )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
```

## What It Returns

### Data Structure
Each event object contains:

```typescript
{
    id: string;                    // Roster entry ID
    eventId: string;               // Event ID
    eventName: string;             // Event name
    eventDate: string;             // Event date (ISO format)
    eventLocation: string;         // Event location
    eventDescription: string;      // Event description
    eventImage: string;            // Event image URL
    eventCategory: string;         // Event category (Environment, Education, etc.)
    role: string;                  // Volunteer's role/position
    shiftId: string;               // Shift ID
    startTime: string;             // Shift start time (HH:MM:SS)
    endTime: string;               // Shift end time (HH:MM:SS)
    hours: number;                 // Calculated hours (decimal)
    status: string;                // Status: Confirmed, Pending, CheckIn, Completed
    isUpcoming: boolean;           // True if event date >= today
    isPast: boolean;               // True if event date < today
    isCompleted: boolean;          // True if status === 'Completed'
    joinedAt: string;              // When user joined the event (ISO timestamp)
}
```

## Features

### 1. **Comprehensive Data**
- Fetches ALL events (not just upcoming or completed)
- Includes all event statuses: `Confirmed`, `Pending`, `CheckIn`, `Completed`
- Returns complete event details including description, category, and image

### 2. **Automatic Calculations**
- **Hours**: Automatically calculated from shift start/end times
- **isUpcoming**: Boolean flag for upcoming events
- **isPast**: Boolean flag for past events
- **isCompleted**: Boolean flag for completed events

### 3. **Sorted by Join Date**
- Events ordered by when the user joined (most recent first)
- Uses `created_at` timestamp from roster_entries

### 4. **Rich Event Information**
- Event metadata (name, date, location, description)
- Event image for display
- Event category for filtering/grouping
- Shift details (role, times)

## Usage Examples

### Basic Usage
```typescript
import { getUserAllEvents } from '../services/supabaseService';

const MyEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (user) {
                const data = await getUserAllEvents(user.id);
                setEvents(data);
            }
        };
        fetchEvents();
    }, [user]);

    return (
        <div>
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};
```

### Filter by Upcoming/Past
```typescript
const upcomingEvents = events.filter(e => e.isUpcoming);
const pastEvents = events.filter(e => e.isPast);
```

### Filter by Status
```typescript
const confirmedEvents = events.filter(e => e.status === 'Confirmed');
const completedEvents = events.filter(e => e.isCompleted);
const pendingEvents = events.filter(e => e.status === 'Pending');
```

### Filter by Category
```typescript
const environmentEvents = events.filter(e => e.eventCategory === 'Environment');
const educationEvents = events.filter(e => e.eventCategory === 'Education');
```

### Group by Status
```typescript
const groupedEvents = {
    upcoming: events.filter(e => e.isUpcoming && !e.isCompleted),
    completed: events.filter(e => e.isCompleted),
    past: events.filter(e => e.isPast && !e.isCompleted)
};
```

### Calculate Total Hours
```typescript
const totalHours = events.reduce((sum, event) => sum + event.hours, 0);
```

## Display Examples

### Upcoming Events Section
```tsx
<div className="upcoming-events">
    <h2>Upcoming Events</h2>
    {events
        .filter(e => e.isUpcoming)
        .map(event => (
            <div key={event.id} className="event-card">
                <img src={event.eventImage} alt={event.eventName} />
                <h3>{event.eventName}</h3>
                <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                <p>Role: {event.role}</p>
                <p>Status: {event.status}</p>
                <span className="badge">{event.eventCategory}</span>
            </div>
        ))
    }
</div>
```

### Completed Events Section
```tsx
<div className="completed-events">
    <h2>Completed Events</h2>
    {events
        .filter(e => e.isCompleted)
        .map(event => (
            <div key={event.id} className="event-card">
                <img src={event.eventImage} alt={event.eventName} />
                <h3>{event.eventName}</h3>
                <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                <p>Hours: {event.hours}</p>
                <button onClick={() => downloadCertificate(event)}>
                    Download Certificate
                </button>
            </div>
        ))
    }
</div>
```

### All Events with Tabs
```tsx
const [activeTab, setActiveTab] = useState('all');

const filteredEvents = {
    all: events,
    upcoming: events.filter(e => e.isUpcoming),
    completed: events.filter(e => e.isCompleted),
    past: events.filter(e => e.isPast && !e.isCompleted)
};

return (
    <div>
        <div className="tabs">
            <button onClick={() => setActiveTab('all')}>All</button>
            <button onClick={() => setActiveTab('upcoming')}>Upcoming</button>
            <button onClick={() => setActiveTab('completed')}>Completed</button>
            <button onClick={() => setActiveTab('past')}>Past</button>
        </div>
        
        <div className="events-grid">
            {filteredEvents[activeTab].map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    </div>
);
```

## Performance Considerations

### Optimizations
1. **Single Query**: Fetches all data in one query using Supabase joins
2. **Indexed Columns**: Query uses indexed `user_id` for fast filtering
3. **Ordered Results**: Server-side ordering by `created_at`
4. **Calculated Fields**: Hours and flags calculated client-side (minimal overhead)

### Caching Strategy
```typescript
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [lastFetch, setLastFetch] = useState(null);

const fetchEvents = async (forceRefresh = false) => {
    // Cache for 5 minutes
    if (!forceRefresh && lastFetch && Date.now() - lastFetch < 300000) {
        return;
    }

    setLoading(true);
    const data = await getUserAllEvents(user.id);
    setEvents(data);
    setLastFetch(Date.now());
    setLoading(false);
};
```

## Error Handling

```typescript
const fetchEvents = async () => {
    try {
        setLoading(true);
        setError(null);
        
        const data = await getUserAllEvents(user.id);
        
        if (data.length === 0) {
            setError('No events found');
        } else {
            setEvents(data);
        }
    } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
    } finally {
        setLoading(false);
    }
};
```

## Comparison with Other Queries

### vs getUserSchedule
- **getUserSchedule**: Only upcoming events (Confirmed, Pending, CheckIn)
- **getUserAllEvents**: ALL events including completed ones

### vs getUserCompletedEvents
- **getUserCompletedEvents**: Only completed events, minimal data
- **getUserAllEvents**: All events with comprehensive details

### When to Use Each

| Use Case | Function |
|----------|----------|
| My Schedule page (upcoming only) | `getUserSchedule` |
| My Certificates page | `getUserCompletedEvents` |
| **My Events page (all events)** | **`getUserAllEvents`** |
| Event history dashboard | `getUserAllEvents` |
| Statistics calculation | `getUserAllEvents` |

## Database Schema Requirements

### Required Tables
1. **roster_entries**
   - id (VARCHAR)
   - user_id (VARCHAR) - indexed
   - shift_id (VARCHAR)
   - status (VARCHAR)
   - created_at (TIMESTAMP)

2. **shifts**
   - id (VARCHAR)
   - event_id (VARCHAR)
   - role (VARCHAR)
   - start_time (TIME)
   - end_time (TIME)

3. **events**
   - id (VARCHAR)
   - name (VARCHAR)
   - date (DATE)
   - location (VARCHAR)
   - description (TEXT)
   - image_url (VARCHAR)
   - category (VARCHAR)

### Foreign Keys
- roster_entries.shift_id → shifts.id
- shifts.event_id → events.id

## Testing

### Test Cases
```typescript
describe('getUserAllEvents', () => {
    it('should return all events for a user', async () => {
        const events = await getUserAllEvents('user123');
        expect(events).toBeInstanceOf(Array);
    });

    it('should calculate hours correctly', async () => {
        const events = await getUserAllEvents('user123');
        events.forEach(event => {
            expect(event.hours).toBeGreaterThanOrEqual(0);
        });
    });

    it('should set isUpcoming flag correctly', async () => {
        const events = await getUserAllEvents('user123');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        events.forEach(event => {
            const eventDate = new Date(event.eventDate);
            expect(event.isUpcoming).toBe(eventDate >= today);
        });
    });

    it('should return empty array for user with no events', async () => {
        const events = await getUserAllEvents('newuser');
        expect(events).toEqual([]);
    });
});
```

## Summary

The `getUserAllEvents` function is a **comprehensive solution** for fetching all user events with:

✅ **Complete event data** (name, date, location, description, image, category)  
✅ **Shift details** (role, times, calculated hours)  
✅ **Status information** (Confirmed, Pending, CheckIn, Completed)  
✅ **Automatic flags** (isUpcoming, isPast, isCompleted)  
✅ **Sorted by join date** (most recent first)  
✅ **Single efficient query** (no multiple round trips)  

Perfect for building a comprehensive "My Events" section that shows both upcoming and past events with all necessary details!
