-- 006_certificate_seed_data.sql

-- Assign existing past events (from 002_seed_data.sql) to the main volunteer 'u1' as Completed.
-- We use the existing shifts s1, s2, s3, s5 which correspond to:
-- s1: City Park Cleanup (Team Leader)
-- s2: City Park Cleanup (General Cleanup)
-- s3: Food Bank Sort-a-thon (Sorter)
-- s5: Tech Literacy Workshop (Instructor)

-- Note: We are NOT creating new events. We are using the existing events managed by the admin.

INSERT INTO roster_entries (id, user_id, shift_id, status) VALUES
('r_cert_1', 'u1', 's2', 'Completed'), -- City Park Cleanup (General Cleanup)
('r_cert_2', 'u1', 's3', 'Completed'), -- Food Bank Sort-a-thon (Sorter)
('r_cert_3', 'u1', 's5', 'Completed'); -- Tech Literacy Workshop (Instructor)

-- If you are logged in as a different user than 'u1' (alex@example.com), 
-- you will need to update the 'user_id' in these rows to match your actual User ID.
