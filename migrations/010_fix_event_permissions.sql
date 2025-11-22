-- 010_fix_event_permissions.sql

-- Allow authenticated users to insert events
CREATE POLICY "Authenticated users can insert events"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update events
CREATE POLICY "Authenticated users can update events"
ON events FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete events
CREATE POLICY "Authenticated users can delete events"
ON events FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to insert shifts
CREATE POLICY "Authenticated users can insert shifts"
ON shifts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update shifts
CREATE POLICY "Authenticated users can update shifts"
ON shifts FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete shifts
CREATE POLICY "Authenticated users can delete shifts"
ON shifts FOR DELETE
TO authenticated
USING (true);
