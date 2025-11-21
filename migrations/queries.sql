-- Common Queries

-- 1. Get all events with their shifts
SELECT 
    e.id AS event_id,
    e.name AS event_name,
    e.date,
    e.location,
    e.category,
    s.id AS shift_id,
    s.role AS shift_role,
    s.start_time,
    s.end_time,
    s.required_count,
    s.filled_count
FROM events e
LEFT JOIN shifts s ON e.id = s.event_id
ORDER BY e.date ASC;

-- 2. Get a specific user by ID with their skills
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.avatar,
    u.total_hours,
    STRING_AGG(us.skill, ', ') as skills
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
WHERE u.id = 'u1' -- Replace with actual ID
GROUP BY u.id;

-- 3. Get the roster for a specific event (e.g., 'e1')
SELECT 
    re.id AS roster_id,
    u.name AS volunteer_name,
    u.email AS volunteer_email,
    s.role AS shift_role,
    re.status
FROM roster_entries re
JOIN users u ON re.user_id = u.id
JOIN shifts s ON re.shift_id = s.id
WHERE s.event_id = 'e1'; -- Replace with actual Event ID

-- 4. Dashboard Stats: Total Volunteer Hours
SELECT SUM(total_hours) AS total_hours FROM users;

-- 5. Dashboard Stats: Active Volunteers (Users with at least one Confirmed or Completed shift)
SELECT COUNT(DISTINCT user_id) AS active_volunteers 
FROM roster_entries 
WHERE status IN ('Confirmed', 'Completed');

-- 6. Dashboard Stats: Open Shifts (Shifts that are not full)
SELECT COUNT(*) AS open_shifts 
FROM shifts 
WHERE filled_count < required_count;

-- 7. Dashboard Stats: Upcoming Events
SELECT COUNT(*) AS upcoming_events 
FROM events 
WHERE date >= CURRENT_DATE;

-- 8. Get User's Schedule (Shifts a user is signed up for)
SELECT 
    e.name AS event_name,
    e.date,
    e.location,
    s.role AS shift_role,
    s.start_time,
    s.end_time,
    re.status
FROM roster_entries re
JOIN shifts s ON re.shift_id = s.id
JOIN events e ON s.event_id = e.id
WHERE re.user_id = 'u1' -- Replace with actual User ID
ORDER BY e.date ASC;
