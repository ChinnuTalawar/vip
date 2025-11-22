-- 009_update_swap_status.sql

ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_status_check;
ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_status_check CHECK (status IN ('Pending', 'Accepted', 'Declined', 'Cancelled'));
