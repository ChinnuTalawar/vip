-- 001_initial_schema.sql

-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'VOLUNTEER', 'GUEST')),
    avatar VARCHAR(255),
    total_hours DECIMAL(10, 2) DEFAULT 0
);

-- User Skills Table (Normalization)
CREATE TABLE user_skills (
    user_id VARCHAR(50),
    skill VARCHAR(50),
    PRIMARY KEY (user_id, skill),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events Table
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('Environment', 'Education', 'Community', 'Health'))
);

-- Shifts Table
CREATE TABLE shifts (
    id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL,
    role VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    required_count INT NOT NULL DEFAULT 0,
    filled_count INT NOT NULL DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Roster Entries Table (Shift Assignments)
CREATE TABLE roster_entries (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    shift_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Confirmed', 'Pending', 'CheckIn', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE
);
