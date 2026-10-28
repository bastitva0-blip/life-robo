-- Slides, PDFs and links shared after a session.
ALTER TABLE events ADD COLUMN resources TEXT NOT NULL DEFAULT '[]';
