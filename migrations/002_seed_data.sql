-- 002_seed_data.sql

-- Seed Users
INSERT INTO users (id, name, email, role, avatar, total_hours) VALUES
('u1', 'Alex Volunteer', 'alex@example.com', 'VOLUNTEER', 'https://picsum.photos/100/100', 42.5),
('a1', 'Sarah Admin', 'sarah@org.com', 'ADMIN', 'https://picsum.photos/101/101', 0);

-- Seed User Skills
INSERT INTO user_skills (user_id, skill) VALUES
('u1', 'Teaching'),
('u1', 'First Aid'),
('u1', 'Logistics');

-- Seed Events
INSERT INTO events (id, name, date, location, description, image_url, category) VALUES
('e1', 'City Park Cleanup', '2024-06-15', 'Central Park, Downtown', 'Join us for a community-wide effort to clean up Central Park. We will be removing litter, planting flowers, and painting benches.', 'https://picsum.photos/800/400?random=1', 'Environment'),
('e2', 'Food Bank Sort-a-thon', '2024-06-20', 'Community Center Hall', 'Help us sort and pack food donations for local families in need. This is a high-energy event requiring lifting and organization skills.', 'https://picsum.photos/800/400?random=2', 'Community'),
('e3', 'Tech Literacy Workshop', '2024-07-05', 'Public Library', 'Teach seniors how to use smartphones and tablets. Patience and tech knowledge required.', 'https://picsum.photos/800/400?random=3', 'Education');

-- Seed Shifts
INSERT INTO shifts (id, event_id, role, start_time, end_time, required_count, filled_count) VALUES
('s1', 'e1', 'Team Leader', '08:00', '12:00', 5, 2),
('s2', 'e1', 'General Cleanup', '09:00', '13:00', 50, 34),
('s3', 'e2', 'Sorter', '10:00', '14:00', 20, 20),
('s4', 'e2', 'Driver', '13:00', '17:00', 5, 1),
('s5', 'e3', 'Instructor', '14:00', '16:00', 10, 4);

-- Additional Users for Roster (from mock roster data)
INSERT INTO users (id, name, email, role, avatar, total_hours) VALUES
('u_john', 'John Doe', 'john@example.com', 'VOLUNTEER', 'https://picsum.photos/50/50?random=1', 0),
('u_jane', 'Jane Smith', 'jane@example.com', 'VOLUNTEER', 'https://picsum.photos/50/50?random=2', 0),
('u_mike', 'Michael Brown', 'mike@example.com', 'VOLUNTEER', 'https://picsum.photos/50/50?random=3', 0),
('u_emily', 'Emily Davis', 'emily@example.com', 'VOLUNTEER', 'https://picsum.photos/50/50?random=4', 0),
('u_david', 'David Wilson', 'david@example.com', 'VOLUNTEER', 'https://picsum.photos/50/50?random=5', 0);

-- Seed Roster Entries
INSERT INTO roster_entries (id, user_id, shift_id, status) VALUES
('r1', 'u_john', 's1', 'Confirmed'),
('r2', 'u_jane', 's2', 'Confirmed'),
('r3', 'u_mike', 's2', 'Pending'),
('r4', 'u_emily', 's3', 'Completed'),
('r5', 'u_david', 's5', 'Confirmed');
