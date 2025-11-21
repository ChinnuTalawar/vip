-- 003_auth_policies.sql
-- Row Level Security Policies for Supabase Authentication

-- Enable Row Level Security on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid()::text = id);

-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id);

-- Policy: Allow users to insert their own profile (for sign up)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid()::text = id);

-- Policy: Authenticated users can view all profiles (for rosters and admin dashboard)
CREATE POLICY "Authenticated users can view all profiles"
ON users FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on roster_entries table
ALTER TABLE roster_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Volunteers can view their own roster entries
CREATE POLICY "Volunteers can view own roster"
ON roster_entries FOR SELECT
USING (auth.uid()::text = user_id);

-- Policy: Authenticated users can view all roster entries (for admin dashboard)
CREATE POLICY "Authenticated users can view all roster entries"
ON roster_entries FOR SELECT
TO authenticated
USING (true);

-- Policy: Volunteers can join shifts (Insert roster entry)
CREATE POLICY "Volunteers can join shifts"
ON roster_entries FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Events are viewable by all authenticated users
CREATE POLICY "Events are public"
ON events FOR SELECT
USING (true);

-- Enable RLS on shifts table
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Policy: Shifts are viewable by all authenticated users
CREATE POLICY "Shifts are public"
ON shifts FOR SELECT
USING (true);
