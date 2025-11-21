# Quick Reference: getUserAllEvents Query

## 📋 Function Call

```typescript
import { getUserAllEvents } from '../services/supabaseService';

// Fetch all events for a user
const events = await getUserAllEvents(userId);
```

## 🔍 SQL Query (Raw)

```sql
SELECT 
    re.id AS roster_entry_id,
    re.status,
    re.created_at,
    s.id AS shift_id,
    s.role,
    s.start_time,
    s.end_time,
    e.id AS event_id,
    e.name AS event_name,
    e.date AS event_date,
    e.location,
    e.description,
    e.image_url,
    e.category
FROM roster_entries re
INNER JOIN shifts s ON re.shift_id = s.id
INNER JOIN events e ON s.event_id = e.id
WHERE re.user_id = 'USER_ID_HERE'
ORDER BY re.created_at DESC;
```

## 📦 Supabase Client Query

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

## 📊 Return Data Structure

```typescript
[
    {
        id: "roster_123",
        eventId: "event_456",
        eventName: "Beach Cleanup Drive",
        eventDate: "2025-11-25",
        eventLocation: "Santa Monica Beach",
        eventDescription: "Join us for a beach cleanup...",
        eventImage: "https://...",
        eventCategory: "Environment",
        role: "Cleanup Coordinator",
        shiftId: "shift_789",
        startTime: "09:00:00",
        endTime: "13:00:00",
        hours: 4.0,
        status: "Confirmed",
        isUpcoming: true,
        isPast: false,
        isCompleted: false,
        joinedAt: "2025-11-20T10:30:00Z"
    },
    // ... more events
]
```

## 🎯 Quick Usage Examples

### Display All Events
```tsx
const MyEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getUserAllEvents(user.id).then(setEvents);
    }, [user]);

    return (
        <div>
            {events.map(event => (
                <div key={event.id}>
                    <h3>{event.eventName}</h3>
                    <p>{event.eventDate}</p>
                </div>
            ))}
        </div>
    );
};
```

### Filter Upcoming Events
```typescript
const upcomingEvents = events.filter(e => e.isUpcoming);
```

### Filter Completed Events
```typescript
const completedEvents = events.filter(e => e.isCompleted);
```

### Calculate Total Hours
```typescript
const totalHours = events.reduce((sum, e) => sum + e.hours, 0);
```

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **All Statuses** | Confirmed, Pending, CheckIn, Completed |
| **Auto-Calculated** | Hours, isUpcoming, isPast, isCompleted |
| **Sorted** | By join date (newest first) |
| **Complete Data** | All event and shift details |
| **Single Query** | Efficient with joins |

## ⚡ Performance

- **Single database query** (no N+1 problem)
- **Indexed on user_id** (fast filtering)
- **Server-side ordering** (efficient)
- **Client-side calculations** (minimal overhead)

## 🎨 Display Patterns

### Tabs Pattern
```tsx
<Tabs>
    <Tab label="All" count={events.length} />
    <Tab label="Upcoming" count={events.filter(e => e.isUpcoming).length} />
    <Tab label="Completed" count={events.filter(e => e.isCompleted).length} />
</Tabs>
```

### Cards Grid
```tsx
<div className="grid grid-cols-3 gap-4">
    {events.map(event => (
        <EventCard 
            key={event.id}
            title={event.eventName}
            date={event.eventDate}
            image={event.eventImage}
            status={event.status}
            hours={event.hours}
        />
    ))}
</div>
```

### Timeline View
```tsx
<Timeline>
    {events.map(event => (
        <TimelineItem
            key={event.id}
            date={event.eventDate}
            title={event.eventName}
            status={event.status}
            upcoming={event.isUpcoming}
        />
    ))}
</Timeline>
```

## 🚀 Ready to Use!

The function is already added to `services/supabaseService.ts` and ready to use in your components!

```typescript
import { getUserAllEvents } from '../services/supabaseService';
```
