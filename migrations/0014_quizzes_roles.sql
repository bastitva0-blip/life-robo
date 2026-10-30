-- Workshop quizzes with score badges, and admin roles that sign in with their own passwords (31 Oct 2026).

-- One quiz per event. `questions` is a JSON array of { q, options[], answer } where answer is the option index.
CREATE TABLE quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  intro TEXT NOT NULL DEFAULT '',
  questions TEXT NOT NULL DEFAULT '[]',
  pass_percent INTEGER NOT NULL DEFAULT 60,
  open INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- One attempt per email per quiz. `code` is the public badge ID.
CREATE TABLE quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers TEXT NOT NULL DEFAULT '[]',
  code TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (quiz_id, email)
);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id, created_at);
CREATE INDEX idx_quiz_attempts_ip ON quiz_attempts(ip_hash, created_at);

-- Admin roles. Developer signs in with the ADMIN_PASSWORD secret and always has full access;
-- the others get a password set by the developer in the admin. `permissions` is a JSON array of
-- admin section keys. Bumping `session_version` signs out everyone using that role.
CREATE TABLE admin_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',
  permissions TEXT NOT NULL DEFAULT '[]',
  session_version INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

INSERT INTO admin_roles (key, name, permissions, sort) VALUES
('developer', 'Developer', '["alerts","content","events","projects","team","gallery","blog","partners","attendance","quizzes","signups","media"]', 1),
('convenor', 'Convenor', '["alerts","content","events","projects","team","gallery","blog","partners","attendance","quizzes","signups","media"]', 2),
('co-convenor', 'Co-Convenor', '["alerts","content","events","projects","team","gallery","blog","partners","attendance","quizzes","signups","media"]', 3),
('team-lead', 'Team Lead', '["alerts","content","events","projects","team","gallery","blog","partners","attendance","quizzes","signups","media"]', 4),
('coordinator', 'Coordinator', '["alerts","content","events","projects","team","gallery","blog","partners","attendance","quizzes","signups","media"]', 5);
