-- Join and event registration ask for roll number, department, year of study and a WhatsApp number (31 Oct 2026).
-- The WhatsApp number is stored in the existing `phone` column. `course` stays for older rows and walk-ins.

ALTER TABLE signups ADD COLUMN roll_no TEXT NOT NULL DEFAULT '';
ALTER TABLE signups ADD COLUMN department TEXT NOT NULL DEFAULT '';
ALTER TABLE signups ADD COLUMN year INTEGER NOT NULL DEFAULT 0;
ALTER TABLE signups ADD COLUMN team TEXT NOT NULL DEFAULT '';

ALTER TABLE registrations ADD COLUMN roll_no TEXT NOT NULL DEFAULT '';
ALTER TABLE registrations ADD COLUMN department TEXT NOT NULL DEFAULT '';
ALTER TABLE registrations ADD COLUMN year INTEGER NOT NULL DEFAULT 0;
ALTER TABLE registrations ADD COLUMN expectations TEXT NOT NULL DEFAULT '';
