-- 006_certificate_seed_data.sql

-- Add a past event
INSERT INTO events (id, name, date, location, description, image_url, category) VALUES
('e_past_1', 'Annual Charity Gala', '2024-12-10', 'Grand Hotel Ballroom', 'Our biggest fundraising event of the year. Volunteers needed for setup, guest assistance, and cleanup.', 'https://picsum.photos/800/400?random=10', 'Fundraising'),
('e_past_2', 'Winter Coat Drive', '2025-01-15', 'Community Center', 'Collecting and distributing warm coats to those in need.', 'https://picsum.photos/800/400?random=11', 'Community');

-- Add shifts for past events
INSERT INTO shifts (id, event_id, role, start_time, end_time, required_count, filled_count) VALUES
('s_past_1', 'e_past_1', 'Event Assistant', '17:00', '23:00', 10, 10),
('s_past_2', 'e_past_2', 'Distributor', '09:00', '15:00', 5, 5);

-- Add completed roster entries for the main demo user (assuming user ID is the one currently logged in, but we'll use 'u1' and 'u_john' as examples)
-- Note: In a real scenario, you'd replace 'u1' with your actual user ID from the auth.users table if testing with a specific login.
-- Here we insert for 'u1' (Alex Volunteer) defined in 002_seed_data.sql
INSERT INTO roster_entries (id, user_id, shift_id, status) VALUES
('r_cert_1', 'u1', 's_past_1', 'Completed'),
('r_cert_2', 'u1', 's_past_2', 'Completed'),
('r_cert_3', 'u1', 's1', 'Completed'); -- Also completed the City Park Cleanup

-- Add some for other users to populate the system
INSERT INTO roster_entries (id, user_id, shift_id, status) VALUES
('r_cert_4', 'u_john', 's_past_1', 'Completed'),
('r_cert_5', 'u_jane', 's_past_1', 'Completed');
