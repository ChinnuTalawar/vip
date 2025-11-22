-- 008_college_events.sql

-- Create college_info table to store college details
CREATE TABLE college_info (
    id VARCHAR(50) PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    college_address TEXT NOT NULL,
    college_city VARCHAR(100) NOT NULL,
    college_state VARCHAR(100) NOT NULL,
    college_pincode VARCHAR(10) NOT NULL,
    college_phone VARCHAR(20),
    college_email VARCHAR(100),
    college_website VARCHAR(255),
    contact_person_name VARCHAR(100) NOT NULL,
    contact_person_designation VARCHAR(100),
    contact_person_phone VARCHAR(20) NOT NULL,
    contact_person_email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add college_id to events table to link events with colleges
ALTER TABLE events ADD COLUMN college_id VARCHAR(50);
ALTER TABLE events ADD CONSTRAINT fk_college FOREIGN KEY (college_id) REFERENCES college_info(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_events_college_id ON events(college_id);
CREATE INDEX idx_college_name ON college_info(college_name);
