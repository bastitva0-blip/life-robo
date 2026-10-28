-- Remove em dashes from site content (feedback: they look bad). Wording is adjusted so each sentence still reads naturally.
UPDATE settings SET value = REPLACE(value, 'Life Robo — Robotics Club', 'Life Robo | Robotics Club') WHERE key IN ('siteName', 'seoTitle');
UPDATE settings SET value = REPLACE(value, 'University of Lucknow — learning electronics', 'University of Lucknow, learning electronics') WHERE key = 'heroSubhead';
UPDATE settings SET value = REPLACE(value, 'coding and teamwork — and turn ideas', 'coding and teamwork, and turn ideas') WHERE key = 'aboutBody';
UPDATE settings SET value = REPLACE(value, 'University of Lucknow — a space where', 'University of Lucknow: a space where') WHERE key = 'vision';
UPDATE settings SET value = REPLACE(value, 'Hands-on builds — from line followers to sensor-driven bots — with live demos.', 'Hands-on builds, from line followers to sensor-driven bots, with live demos.') WHERE key = 'tracks';
UPDATE settings SET value = REPLACE(value, 'Tune, debug, demo — and take it to competitions.', 'Tune, debug, demo, and take it to competitions.') WHERE key = 'process';
UPDATE settings SET value = REPLACE(value, 'derivative terms — the same idea', 'derivative terms: the same idea') WHERE key = 'roboFacts';
UPDATE settings SET value = REPLACE(value, 'University of Lucknow — workshops, lecture series', 'University of Lucknow: workshops, lecture series') WHERE key = 'seoDescription';

UPDATE events SET title = 'Robotics Workshop-III: Line Following Robot, Live Building and Demo' WHERE slug = 'robotics-workshop-iii-line-following-robot';
UPDATE events SET title = 'Robotics Workshops Series 2026: Inauguration' WHERE slug = 'robotics-workshops-series-2026';
UPDATE events SET title = 'Antariksh Manthan 2026: Talk on Career in Space', cover_alt = 'Antariksh Manthan 2026: Talk on Career in Space poster' WHERE slug = 'antariksh-manthan-2026-career-in-space';
UPDATE events SET body = REPLACE(body, 'Mr. Pratham, Head — Life Robo', 'Mr. Pratham, Head, Life Robo') WHERE slug = 'roboeminence-2023';
UPDATE events SET body = REPLACE(body, 'Introduction to Robotics — What is a robot?', 'Introduction to Robotics: What is a robot?') WHERE slug = 'lecture-series-robotics-automation-2023';
UPDATE events SET summary = REPLACE(summary, 'building a quadcopter — frame, motors', 'building a quadcopter: frame, motors'),
  body = REPLACE(body, 'how a quadcopter flies — thrust, yaw', 'how a quadcopter flies: thrust, yaw') WHERE slug = 'drone-making-workshop-test';
UPDATE posts SET body = REPLACE(body, '**Antariksh Manthan 2026** — a talk on careers', '**Antariksh Manthan 2026**, a talk on careers') WHERE slug = 'career-in-space-key-takeaways';
UPDATE alerts SET message = REPLACE(message, 'Drone Making Workshop — 15 Nov at FoET.', 'Drone Making Workshop on 15 Nov at FoET.');
