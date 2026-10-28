-- Feedback round 2 (28 Oct 2026): faculty in-charge, team portraits, Vortex Workshop 3, richer event write-ups, photos from Instagram.

DELETE FROM team WHERE grp = 'Faculty';

INSERT INTO team (name, role, grp, bio, photo, sort) VALUES
('Dr. Manoj Kumar Jain', 'Convener', 'Faculty', 'Asst. Prof., ECE Department', '/photos/team/fac-manoj-jain.png', -20),
('Dr. Rajendra Bahadur', 'Co-Convener', 'Faculty', 'Asst. Prof., ME Department', '/photos/team/fac-rajendra-bahadur.png', -19),
('Dr. Himanshu Pandey', 'Joint Secretary', 'Faculty', 'Associate Prof., CSE Department', '/photos/team/fac-himanshu-pandey.png', -18),
('Er. Prashant Kumar Singh', 'Secretary', 'Faculty', 'Asst. Prof., ME Department', '/photos/team/fac-prashant-kumar-singh.png', -17),
('Dr. Gaurav Gupta', 'Treasurer', 'Faculty', 'Asst. Prof., EE Department', '/photos/team/fac-gaurav-gupta.png', -16),
('Er. Sandeep Gupta', 'Treasurer', 'Faculty', 'Asst. Prof., ME Department', '/photos/team/fac-sandeep-gupta.png', -15),
('Er. Ravi Krishna Pandey', 'Executive Committee Member', 'Faculty', 'Asst. Prof., CSE Department', '/photos/team/fac-ravi-krishna-pandey.png', -14),
('Er. Rohit', 'Executive Committee Member', 'Faculty', 'Asst. Prof., CSE Department', '/photos/team/fac-rohit.png', -13),
('Er. Siddharth Srivastava', 'Executive Committee Member', 'Faculty', 'Asst. Prof., ECE Department', '/photos/team/fac-siddharth-srivastava.png', -12);

UPDATE team SET photo = '/photos/team/kanishka-singh.png' WHERE name = 'Kanishka Singh' AND photo = '';

UPDATE team SET photo = '/photos/team/gaurav-chandra-rao.png' WHERE name = 'Gaurav Chandra Rao' AND photo = '';

UPDATE team SET photo = '/photos/team/ayushman-rai.png' WHERE name = 'Ayushman Rai' AND photo = '';

UPDATE team SET photo = '/photos/team/pratyush-paswan.png' WHERE name = 'Pratyush Paswan' AND photo = '';

UPDATE team SET photo = '/photos/team/kunal-anand.png' WHERE name = 'Kunal Anand' AND photo = '';

UPDATE team SET photo = '/photos/team/rajan-vishwakarma.png' WHERE name = 'Rajan Vishwakarma' AND photo = '';

UPDATE team SET photo = '/photos/team/krishan-kant-pathak.png' WHERE name = 'Krishan Kant Pathak' AND photo = '';

UPDATE team SET photo = '/photos/team/anubhav-tiwari.png' WHERE name = 'Anubhav Tiwari' AND photo = '';

UPDATE team SET photo = '/photos/team/aditya-swamy.png' WHERE name = 'Aditya Swamy' AND photo = '';

UPDATE team SET photo = '/photos/team/siddharth-verma.png' WHERE name = 'Siddharth Verma' AND photo = '';

UPDATE partners SET active = 0, on_certificate = 0 WHERE short_name = 'IEEE SB FoET LU';

INSERT INTO settings (key, value) VALUES ('collabIntro', '"Life Robo plans and leads its own sessions. We are glad to have IEEE RAS alongside us, and our workshops stay open to its members."') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

INSERT INTO settings (key, value) VALUES ('heroImage', '"/photos/social/ig-liferobo-2026-10-11-4.webp"') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

INSERT INTO settings (key, value) VALUES ('aboutImage', '"/photos/social/ig-vortex-2026-10-03-13.webp"') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

INSERT INTO settings (key, value) VALUES ('seriesBody', '"Vortex is the new identity of Life Robo''s workshop series at the Faculty of Engineering & Technology, University of Lucknow, launched under the patronage of Prof. Jai Prakash Saini, Vice-Chancellor, and Prof. Satendra Pal Singh, Dean, FoET, with Dr. Manoj Kumar Jain as mentor. It gives students exposure to emerging engineering domains through practical learning, experimentation and structured technical activities, so classroom concepts connect with real applications. A calendar of 11 workshops is planned, and every session is planned and led by the club itself.\n\nWorkshop 1, Robotics: Who am I?, was led by Dr. Manoj Kumar Jain, Convener of Life Robo. Workshop 2, The Mathematics of Motion, was led by Kunal Anand and covered vectors and matrices, coordinate systems, kinematics, dynamics and simulation. Workshop 3, AI Automation & AI Analysis, was led by Krishan Kant Pathak and went from sensor data to machine-learning models and live fault alerts. More sessions are on the way."') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

INSERT INTO settings (key, value) VALUES ('seriesImages', '["/photos/social/ig-liferobo-2026-10-11-4.webp","/photos/social/ig-liferobo-2026-10-11-2.webp","/photos/social/ig-liferobo-2026-10-11-3.webp","/photos/social/ig-liferobo-2026-10-25-1.webp","/photos/social/ig-liferobo-2026-10-06-2.webp","/photos/social/ig-liferobo-2026-10-06-3.webp","/photos/social/ig-liferobo-2026-10-06-4.webp","/photos/social/ig-liferobo-2026-10-06-5.webp","/photos/social/ig-liferobo-2026-10-06-6.webp","/photos/social/ig-liferobo-2026-10-06-7.webp","/photos/vortex/vortex-01.jpg","/photos/vortex/vortex-03.jpg","/photos/vortex/vortex-04.jpg","/photos/vortex/vortex-02.jpg"]') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

UPDATE events SET starts_at = '2026-10-03T08:15:00.000Z', venue = 'Room 225, New Block, FoET, University of Lucknow', cover = '/photos/vortex/vortex-launch-poster.png', cover_alt = 'Poster for the Vortex launch and Workshop 1, Robotics: Who am I?', summary = 'Vortex begins: the Life Robo induction, an introduction to the series, and Workshop 1 led by Dr. Manoj Kumar Jain, Convener of Life Robo.', body = 'Life Robo launched **Vortex** (*Hands on × Minds on × Future ready*) as a new identity for its workshop series, and opened it with Workshop 1, led by **Dr. Manoj Kumar Jain**, Convener of Life Robo.

**On the day**

- Life Robo induction programme
- About the Vortex workshop series and what is coming next
- Workshop 1: *Robotics: Who am I?*

Dr. Jain opened the series with a simple question: what makes a machine a robot? The session introduced robotics from the ground up (what a robot is, how it senses the world and responds to it, and where the field is heading) so that anyone in the room, from any branch, could follow the rest of the series.

- **Chief Patron:** Prof. Jai Prakash Saini, Vice-Chancellor, University of Lucknow
- **Patron:** Prof. Satendra Pal Singh, Dean, FoET', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'vortex-workshop-1-robotics-who-am-i';

UPDATE events SET cover = '/photos/vortex/vortex-workshop-2-poster.png', cover_alt = 'Poster for Vortex Workshop 2, The Mathematics of Motion', images = '["/photos/social/ig-liferobo-2026-10-11-4.webp","/photos/social/ig-liferobo-2026-10-11-2.webp","/photos/social/ig-liferobo-2026-10-11-3.webp","/photos/social/ig-liferobo-2026-10-11-1.webp","/photos/vortex/vortex-01.jpg","/photos/vortex/vortex-02.jpg","/photos/vortex/vortex-03.jpg","/photos/vortex/vortex-04.jpg"]', body = 'The second workshop of the Vortex series, led by **Kunal Anand** (Mechanical Engineering, 3rd year), Lead of the Life Robo Design & Hardware team.

Every robot that moves is solving maths in real time. This session showed how a robot describes where it is and how it gets somewhere else, and took participants from equations all the way to simulation.

**What we covered**

- Vectors and matrices: the maths behind robot motion
- Coordinate systems: representing a position in 3D
- Kinematics and dynamics: how robots actually move
- Simulation: connecting theory to real-world applications

Organised by Life Robo with the Association of Mechanical Engineers, University of Lucknow.

**Patrons:** Prof. Jai Prakash Saini, Vice-Chancellor, University of Lucknow, and Prof. Satendra Pal Singh, Dean, FoET.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'vortex-workshop-2-mathematics-of-motion';

INSERT OR IGNORE INTO events (slug, title, starts_at, venue, summary, body, cover, cover_alt, images, series, featured, published) VALUES (
'vortex-workshop-3-ai-automation-ai-analysis', 'Vortex Workshop 3: AI Automation & AI Analysis', '2026-10-24T12:30:00.000Z', 'Online (Google Meet)',
'From sensor data to machine-learning models and live fault alerts: AI analysis and predictive maintenance, led by Krishan Kant Pathak (ME, 3rd year).',
'The third workshop of the Vortex series, held online and led by **Krishan Kant Pathak** (Mechanical Engineering, 3rd year), Lead of the Life Robo AI Programming & Research team.

The session went from robotics architecture and embedded programming to practical AI, using predictive maintenance as the running example: take sensor data from a machine, train a model to spot when something is going wrong, and raise an alert before it fails.

**What we covered**

- Sensor telemetry: collecting the data a machine gives off
- Supervised machine-learning models for fault detection
- Evaluating a model and explaining it with permutation importance
- Deploying a live fault alert with Streamlit

**Patrons:** Prof. Jai Prakash Saini, Vice-Chancellor, University of Lucknow, and Prof. Satendra Pal Singh, Dean, FoET.',
'/photos/social/ig-liferobo-2026-10-25-1.webp', 'Title slide of Vortex Workshop 3, AI Analysis & Predictive Maintenance, on Google Meet',
'["/photos/social/ig-liferobo-2026-10-25-1.webp","/photos/social/ig-liferobo-2026-10-25-2.webp","/photos/social/ig-liferobo-2026-10-25-3.webp","/photos/social/ig-liferobo-2026-10-25-4.webp","/photos/social/ig-liferobo-2026-10-25-5.webp"]', 'vortex', 1, 1);

UPDATE events SET images = '["/photos/social/ig-vortex-2026-10-03-11.webp"]', summary = 'Robotics Workshop 1 opened the Robotics Workshops Series 2026, with Mr. Abhishek Singh of ISRO, Program Manager for Chandrayaan-3.', body = 'Life Robo opened the **Robotics Workshops Series 2026** on Saturday, 21 February 2026 at the Vishwakarma Auditorium, with weekend workshops to follow.

Robotics Workshop 1 drew a full house. It went from foundational robotics concepts to practical insights into AI-based systems and real-time applications, and set the tone for the series that followed.

We were honoured to have **Mr. Abhishek Singh**, Scientist at the U R Rao Satellite Centre (URSC), ISRO, and Program Manager for Chandrayaan-3, with us.

- **Chief Guest:** Mr. Abhishek Singh, Scientist at URSC & Program Manager, Chandrayaan-3, ISRO
- **Chief Patron:** Prof. J. P. Saini, Vice-Chancellor, University of Lucknow
- **Patron:** Prof. S. P. Singh, Dean, FoET', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'robotics-workshops-series-2026';

UPDATE events SET images = '["/photos/social/ig-vortex-2026-10-03-12.webp"]', summary = 'A talk on building a career in space by Mr. Abhishek Singh, Scientist at URSC, ISRO, and Program Manager for Chandrayaan-3.', body = 'As part of **Antariksh Manthan 2026**, Life Robo hosted a talk on careers in space by **Mr. Abhishek Singh**, Scientist at the U R Rao Satellite Centre (URSC), ISRO, and Program Manager for Chandrayaan-3.

Mr. Singh shared his own journey, insights into India''s space missions, and detailed guidance on building a career in the space sector.

**What the talk covered**

- His journey in the space sector
- Insights into India''s space missions
- Satellite communication systems
- Opportunities within ISRO and in the growing private space industry
- Guidance on building a career in space

The interaction gave aspiring engineers clarity and direction, and encouraged them to aim higher, innovate fearlessly and contribute to the nation''s scientific progress. We thank Mr. Singh for taking the time to mentor our students, and the Vice-Chancellor, the Dean, faculty members and all participants for making the session a success.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'antariksh-manthan-2026-career-in-space';

UPDATE events SET title = 'Robotics Workshop-II: Emerging Horizons with IoT & XR', images = '["/photos/social/ig-vortex-2026-10-03-1.webp","/photos/social/ig-vortex-2026-10-03-2.webp","/photos/social/ig-vortex-2026-10-03-3.webp","/photos/social/ig-vortex-2026-10-03-4.webp"]', summary = 'Emerging Horizons: the scope and implementation of IoT and XR systems, led by Mr. Abhishek Dixit.', body = 'The second workshop of the Robotics Workshops Series 2026, **Emerging Horizons: The Scope and Implementation of IoT and XR Systems**, was led by **Mr. Abhishek Dixit**.

Through an interactive approach, the session introduced students to real-world applications of the Internet of Things, extended and virtual reality (XR/VR) and other modern technologies, and how they connect to robotics.

**What we covered**

- What IoT systems are and where they are used
- XR and VR systems, and how they are implemented
- Real-world applications of these technologies

Students left with practical insights into emerging technologies, and a push to keep building and strengthen their technical skills.

- **Organised under the guidance of:** Dr. Manoj Kumar Jain (Convener) and Dr. Rajendra Bahadur (Co-Convener)
- **Graced by:** Prof. S. P. Singh, Dean, FoET, and Prof. Rafik Ahmad, Guest Faculty', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'robotics-workshop-ii-iot-xr';

UPDATE events SET summary = 'A full live build of a line following robot, from Arduino code and circuit design to a working demo, led by Jatin Pandey.', body = 'The third workshop of the Robotics Workshops Series 2026, **Line Following Robot: Live Building and Demo**, gave students hands-on experience in autonomous robotics and hardware integration.

It was led by **Jatin Pandey** (Software Team Lead, 3rd year CSE-AI), who ran an intensive live session and guided participants through building a line following robot from scratch.

**What we covered**

- How a line follower works: IR sensors read the line and the motors steer to stay on it
- Circuit design: wiring the sensors, the motor driver and the Arduino
- Arduino coding for the robot
- Real-time decision-making algorithms that keep the robot on track
- Live demonstration and debugging on the track

The live demo and debugging session bridged the gap between theoretical logic and physical implementation, and participants left better equipped to start their journey into robotics, IoT and AI.

- **Organised under the guidance of:** Dr. Manoj Kumar Jain (Convener) and Er. Prashant Kumar Singh (Secretary)
- With thanks to all Life Robo faculty members for their support', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'robotics-workshop-iii-line-following-robot';

INSERT OR IGNORE INTO events (slug, title, starts_at, venue, summary, body, cover, cover_alt, images, featured, published) VALUES
('solidworks-crash-course-2026', 'SOLIDWORKS Crash Course', '2026-04-04T07:00:00.000Z', 'Seminar Hall, FoET, University of Lucknow',
'A hands-on CAD session, from 3D part modelling to assembly design, led by Sweksha Chaudhary.',
'Life Robo hosted an intensive, hands-on **SOLIDWORKS Crash Course**, led by **Sweksha Chaudhary** (then Lead, Hardware Team).

Members brought their laptops and turned ideas into digital models in real time.

**What we covered**

- 3D part modelling
- Assembly design: putting parts together into a mechanism

With thanks to Dr. Manoj Kumar Jain (Convener) and Er. Prashant Kumar Singh (Secretary) for their presence and encouragement.',
'/photos/social/ig-vortex-2026-10-03-5.webp', 'Students at the SOLIDWORKS crash course',
'["/photos/social/ig-vortex-2026-10-03-5.webp","/photos/social/ig-vortex-2026-10-03-6.webp","/photos/social/ig-vortex-2026-10-03-7.webp","/photos/social/ig-vortex-2026-10-03-8.webp","/photos/social/ig-vortex-2026-10-03-9.webp","/photos/social/ig-vortex-2026-10-03-10.webp"]', 0, 1),
('orientation-ceremony-2025-26', 'Orientation Ceremony 2025–26', '2025-10-17T07:00:00.000Z', 'FoET, University of Lucknow',
'The start of the 2025–26 year at Life Robo, with Chief Guest Ms. Vandana Sharma of Innovation Hub Uttar Pradesh.',
'Life Robo opened the 2025–26 year with its **Orientation Ceremony**, an inspiring start to another year of robotics and artificial intelligence on campus.

Our Chief Guest, **Ms. Vandana Sharma** (Manager, Innovation Hub Uttar Pradesh), delivered a motivational address that encouraged students to think creatively and innovate fearlessly. Members also showed robots they had built, from line followers and robotic arms to a self-balancing robot.',
'/photos/social/ig-vortex-2026-10-03-13.webp', 'Life Robo members and guests with their robots at the Orientation Ceremony 2025–26',
'["/photos/social/ig-vortex-2026-10-03-13.webp","/photos/social/ig-vortex-2026-10-03-14.webp","/photos/social/ig-vortex-2026-10-03-15.webp","/photos/social/ig-vortex-2026-10-03-16.webp"]', 0, 1);

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-11-4.webp', 'Vortex Workshop 2: The Mathematics of Motion', 'Participants of Vortex Workshop 2 in Room 229', (SELECT id FROM events WHERE slug = 'vortex-workshop-2-mathematics-of-motion'), 1, -100 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-11-4.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-11-2.webp', 'Kunal Anand speaking at Vortex Workshop 2', 'Kunal Anand at the podium during Vortex Workshop 2', (SELECT id FROM events WHERE slug = 'vortex-workshop-2-mathematics-of-motion'), 1, -99 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-11-2.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-11-3.webp', 'Vortex Workshop 2', 'A moment from Vortex Workshop 2', (SELECT id FROM events WHERE slug = 'vortex-workshop-2-mathematics-of-motion'), 1, -98 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-11-3.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-25-1.webp', 'Vortex Workshop 3: AI Automation & AI Analysis', 'Vortex Workshop 3 title slide on Google Meet', (SELECT id FROM events WHERE slug = 'vortex-workshop-3-ai-automation-ai-analysis'), 1, -97 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-25-1.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-25-2.webp', 'Vortex Workshop 3, online', 'Participants of Vortex Workshop 3 on Google Meet', (SELECT id FROM events WHERE slug = 'vortex-workshop-3-ai-automation-ai-analysis'), 1, -96 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-25-2.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-06-2.webp', 'The launch of Vortex', 'From the Vortex launch', (SELECT id FROM events WHERE slug = 'vortex-workshop-1-robotics-who-am-i'), 1, -95 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-06-2.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-06-3.webp', 'The launch of Vortex', 'From the Vortex launch', (SELECT id FROM events WHERE slug = 'vortex-workshop-1-robotics-who-am-i'), 1, -94 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-06-3.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-06-4.webp', 'The launch of Vortex', 'From the Vortex launch', (SELECT id FROM events WHERE slug = 'vortex-workshop-1-robotics-who-am-i'), 1, -93 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-06-4.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-liferobo-2026-10-06-5.webp', 'The launch of Vortex', 'From the Vortex launch', (SELECT id FROM events WHERE slug = 'vortex-workshop-1-robotics-who-am-i'), 1, -92 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-liferobo-2026-10-06-5.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-vortex-2026-10-03-13.webp', 'Orientation Ceremony 2025–26', 'Members and guests with their robots', (SELECT id FROM events WHERE slug = 'orientation-ceremony-2025-26'), 1, -91 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-vortex-2026-10-03-13.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-vortex-2026-10-03-5.webp', 'SOLIDWORKS Crash Course', 'Students modelling in SOLIDWORKS', (SELECT id FROM events WHERE slug = 'solidworks-crash-course-2026'), 1, -90 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-vortex-2026-10-03-5.webp');

INSERT INTO gallery (url, caption, alt, event_id, featured, sort) SELECT '/photos/social/ig-vortex-2026-10-03-1.webp', 'Robotics Workshop-II: IoT & XR', 'From the IoT and XR workshop', (SELECT id FROM events WHERE slug = 'robotics-workshop-ii-iot-xr'), 1, -89 WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = '/photos/social/ig-vortex-2026-10-03-1.webp');
