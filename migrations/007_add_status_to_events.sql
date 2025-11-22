-- 007_add_status_to_events.sql

ALTER TABLE events ADD COLUMN status VARCHAR(20) DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Completed', 'Ongoing'));
