-- Projects (28 Oct 2026): Warehouse Autonomy Lab and Robot Intelligence Lab added; every project gets a full write-up. Stock photos are from Unsplash.

INSERT OR IGNORE INTO projects (slug, title, category, summary, body, cover, cover_alt, tags, links, featured, published, sort) VALUES
('warehouse-autonomy-lab', 'Warehouse Autonomy Lab', 'Autonomous',
'A 3D digital twin of an automated warehouse: six autonomous mobile robots plan routes with A*, avoid each other with a space-time reservation table and replan around obstacles in real time.',
'**Warehouse Autonomy Lab** is an interactive 3D digital twin of an automated warehouse that runs entirely in the browser. Six autonomous mobile robots (AMRs) pick up pallets, carry them across the floor and drop them at delivery docks, all while planning their own routes, avoiding each other and reacting to obstacles you place in their way.

It was built by Krishan Kant Pathak, Lead of the Life Robo AI Programming & Research team, for robotics students and anyone curious about how a fleet of warehouse robots actually decides where to go.

[Open the live demo](https://warehouse-autonomy-lab.vercel.app) · [Source code on GitHub](https://github.com/krishankpathak/Warehouse-Autonomy-3D-warehouse-autonomous-mobile-robots-path-planning-obstacle-avoidance)

## Why warehouses?

Modern fulfilment centres run on fleets of mobile robots. Each one has to answer three questions many times a second: *where am I going, how do I get there, and what if someone else wants the same space?* One robot is a path-planning problem. Six robots in narrow aisles is a coordination problem, and that is where things get interesting.

![Rows of shelves and bins inside a warehouse](/photos/projects/warehouse-2.jpg)

## What you see

- **A full 3D warehouse:** an epoxy floor with a coordinate grid and safety striping, pallet racks loaded with cartons, four inbound conveyor bays, four outbound delivery chutes and four inductive charging pads.
- **Six AMRs, Alpha to Foxtrot:** each with differential-drive wheels, a spinning 360° LiDAR turret, headlights and a scissor lift that raises the pallet during pickup and lowers it at delivery.
- **Status at a glance:** an LED ring around every robot shows what it is doing:
  - green when idle
  - blue while navigating
  - purple while lifting or unloading
  - amber while yielding at a junction
  - cyan while charging
  - red when halted or blocked

## How the robots think

### 1. Finding a route with A*

The floor is a 26 × 18 grid. Each robot plans its route with **A\* search** on a 4-connected grid, guided by the Manhattan-distance heuristic *h(n) = |x₁ − x₂| + |y₁ − y₂|*. Because that heuristic never overestimates, A\* is guaranteed to return the shortest path.

### 2. Not crashing into each other: the space-time reservation table

A shortest path is useless if two robots try to use it at the same moment. The lab keeps a **reservation table indexed by (x, y, t)**: before a robot commits to a route, it reserves every cell it will occupy at every time step.

- **Vertex conflicts** are eliminated: no two robots can be in the same cell at the same time step.
- **Edge-swap conflicts** are eliminated: two robots can never swap places head-on in a single-cell aisle, the classic deadlock.

When two robots want the same space, priority is decided deterministically:

1. A robot with critical battery (below 25%) goes first, so it can reach a charger.
2. Then a robot carrying a payload, so deliveries keep moving.
3. Then robot ID order, so ties always resolve the same way.

### 3. Reacting to the unexpected

Click any floor cell and a hazard crate appears. Robots already on the move detect that their remaining route is blocked, throw it away and compute a fresh A\* detour on the spot.

### 4. Moving like a real vehicle

Motion is continuous, not cell-hopping. The drive wheels turn by exactly the angle the robot travels (Δθ = Δd / r), and the whole simulation runs on a 10 Hz core loop, the same kind of control rate real fleet managers use.

## Try it yourself: five guided scenarios

The lab ships with five demos designed for classrooms and workshops:

1. **Basic autonomous delivery:** one robot through a full pick, carry and drop cycle.
2. **Multi-robot coordination:** crossing routes, and robots yielding to avoid conflicts.
3. **Dynamic obstacle replanning:** block a robot mid-route and watch it detour.
4. **Low battery and recharging:** a draining battery forces a robot to the charging pad.
5. **Fleet stress test:** all six robots dispatched at once into dense aisles.

A floating dashboard tracks throughput (orders per hour), completed orders, robots in transit and total fleet distance, and you can dispatch, charge, halt or click-to-move any robot.

## Predictive maintenance built in

The lab also pulls real actuator telemetry from the Kaggle robot predictive maintenance dataset (motor temperature, drive voltage, torque and fault states across six joint drives), connecting fleet navigation with the question of *when a robot is about to fail*. That question is explored in depth in the club''s [Robot Intelligence Lab](/projects/robot-intelligence-lab).

## Under the hood

| Part | What it does |
| --- | --- |
| SimulationEngine | The 10 Hz core loop that ticks the whole world |
| TaskManager | Cost-based allocation of pickup and delivery orders |
| PathPlanner | Deterministic A* search on the warehouse grid |
| ReservationManager | The (x, y, t) space-time reservation table |
| RobotController | Each robot''s state machine and kinematics |
| WarehouseScene, RobotRenderer | The Three.js 3D world and procedural robots |
| PredictiveMaintenanceInspector | Actuator telemetry and fault states |

**Built with:** TypeScript, Three.js (WebGL), Vite and Vitest (31 unit tests passing), deployed on Vercel.

## What you can learn from it

- How graph search becomes real robot navigation
- Why multi-robot systems need coordination, not just good individual paths
- How priority rules prevent deadlocks
- How a digital twin lets you test a fleet before it touches a real floor

## Run it locally

You need Node.js 18 or newer and a browser with WebGL 2. Clone the repository, run the setup script (`setup.ps1` on Windows, `setup.sh` on Linux or macOS), then the run script to start the simulation server.', '/photos/projects/warehouse-shelves.jpg', 'Rows of racks and yellow bins inside a fulfilment warehouse',
'["A* path planning","Multi-robot coordination","Digital twin","Three.js","TypeScript"]',
'[{"label":"Live demo","url":"https://warehouse-autonomy-lab.vercel.app"},{"label":"GitHub","url":"https://github.com/krishankpathak/Warehouse-Autonomy-3D-warehouse-autonomous-mobile-robots-path-planning-obstacle-avoidance"}]', 1, 1, -2),
('robot-intelligence-lab', 'Robot Intelligence Lab', 'Research',
'Local, AI-powered predictive maintenance for a six-motor robot arm: honest model evaluation on rare faults, leakage-safe splits, fault simulation and explainable predictions.',
'**Robot Intelligence Lab** is a local, AI-powered predictive maintenance and fault analytics application for robots. It learns from real multi-motor sensor data, evaluates its models honestly, and serves live predictions and fault simulations, with no cloud services or external AI APIs involved.

It was built by Krishan Kant Pathak, Lead of the Life Robo AI Programming & Research team, and formed the basis of [Vortex Workshop 3: AI Automation & AI Analysis](/events/vortex-workshop-3-ai-automation-ai-analysis).

[Source code on GitHub](https://github.com/krishankpathak/robot-intelligence-lab)

## The problem: catching a failure before it happens

A robot arm on a production line runs for hours. When a motor overheats, a voltage sags or a joint starts to jam, the earlier you notice, the cheaper the fix. **Predictive maintenance** uses the sensor data a robot already produces to spot the warning signs.

![An engineer working on a robotics test rig](/photos/projects/robot-arm-lab.jpg)

## The data

The lab analyses the Kaggle robot predictive maintenance dataset from a **six-motor robot arm**: 235,854 time-stamped readings recorded at 10 Hz across 23 training sequences, covering motions like pick-and-place, turning one motor, and standing still. Each reading includes motor position, temperature and voltage, and a label for whether the robot was in a fault state.

Only **7.2%** of the readings are faults. That single number shapes everything that follows.

## Lesson one: accuracy can lie

If 92.8% of the data is "normal", a model that always answers "normal" is right 92.8% of the time, and catches zero faults. The lab makes this concrete: on held-out runs, a dummy baseline scores the **highest accuracy of every model (85.2%) while missing 100% of faults.**

So the lab judges models on metrics that respect the rare class:

- **Recall:** of the real faults, how many did we catch?
- **Precision:** of the alarms we raised, how many were real?
- **F1-score, PR-AUC and ROC-AUC:** single numbers that balance both.

## Lesson two: don''t let the test leak into training

Sensor readings at 10 Hz are almost identical from one moment to the next. If you split the data randomly, near-copies of your test readings end up in training, and the model looks far better than it is. The lab uses **grouped run splitting**: whole recording sessions go to either training or testing, never both.

## The models

The lab trains and compares a dummy baseline, logistic regression, a decision tree, random forest and gradient boosting, all on the full dataset with grouped splits.

| Model | Accuracy | Recall | F1 | PR-AUC |
| --- | --- | --- | --- | --- |
| Decision tree | 0.728 | **0.064** | **0.065** | **0.140** |
| Gradient boosting | 0.796 | 0.024 | 0.034 | 0.122 |
| Logistic regression | 0.695 | 0.025 | 0.023 | 0.098 |
| Random forest | 0.804 | 0.014 | 0.021 | 0.125 |
| Dummy baseline | **0.852** | 0.000 | 0.000 | 0.148 |

The scores are deliberately reported as they are. The honest takeaway: on a small number of recording sessions with very rare faults, fault detection is genuinely hard, and the models that *do* catch faults do it by isolating voltage dropouts and thermal surges.

To make the maths visible, the lab also includes **from-scratch NumPy versions** of logistic regression (sigmoid plus gradient descent) and a decision stump (Gini impurity), checked against scikit-learn.

![Charts on an analytics dashboard](/photos/projects/data-dashboard.jpg)

## The interactive lab

The Streamlit dashboard has two modes:

- **Real telemetry replay:** step through genuine recordings, motor by motor.
- **Synthetic fault scenarios:** inject thermal build-up, voltage sag, a mechanical jam or serial glitches, and watch the model react.

Every prediction comes with an explanation of which sensor reading drove it (permutation and tree importance), and the service flags inputs that fall outside anything seen in training (out-of-distribution detection). Saved models carry SHA-256 checksums so you always know exactly which model made a prediction.

## What it can''t do (and says so)

- It predicts *whether* a reading looks abnormal, not *which* part is failing: the data only has fault / no-fault labels.
- It does not estimate remaining useful life.
- A prediction is a statistical warning, not a diagnosis; a technician still has to inspect the robot.
- New motions or payloads that weren''t in the training data can trigger false alarms.

## Under the hood

**Built with:** Python, pandas, NumPy, scikit-learn and Streamlit, with 34 automated tests. Everything runs locally on a laptop.

## What you can learn from it

- Why accuracy is the wrong metric for rare events
- How data leakage quietly inflates results, and how to prevent it
- How to read precision, recall and PR curves
- How to explain a model''s decision instead of just trusting it

## Run it locally

You need Python 3.10 or newer. Create a virtual environment, install `requirements.txt`, run the tests with `pytest`, train the models with `python scripts/train_verified_models.py`, then start the dashboard with `streamlit run app.py`.', '/photos/projects/data-dashboard.jpg', 'Charts and metrics on an analytics dashboard',
'["Predictive maintenance","Machine learning","Python","Streamlit","scikit-learn"]',
'[{"label":"GitHub","url":"https://github.com/krishankpathak/robot-intelligence-lab"},{"label":"Vortex Workshop 3","url":"/events/vortex-workshop-3-ai-automation-ai-analysis"}]', 1, 1, -1);

UPDATE projects SET body = 'A multi-axis desktop robotic arm built by Life Robo members with hobby servo motors and a microcontroller. It is small enough to sit on a desk, and it teaches the same ideas that run industrial robot arms on factory floors.

![A small robotic arm built by club members](/photos/team-arduino-arm.jpg)

## Why build a robotic arm?

Robotic arms are everywhere in industry: welding car bodies, packing boxes, assembling electronics. A desktop version is the most hands-on way to learn how they work, because every concept, from joints to coordinates, is something you can see and touch.

## How it works

### Joints and degrees of freedom

The arm is a chain of rigid links connected by joints. Each joint that can move independently adds a **degree of freedom (DOF)**. A typical desktop arm has a rotating base, a shoulder, an elbow and a wrist, which give it enough freedom to reach points around it and approach them from different angles.

### Servo motors

Each joint is driven by a **hobby servo**: a small motor with a gearbox and a position sensor inside. The microcontroller sends it a pulse about every 20 ms, and the pulse width (roughly 1 to 2 ms) tells the servo which angle to hold. Change the pulse, and the joint moves to the new angle and stays there.

### The microcontroller

The microcontroller is the arm''s brain. It generates the control pulses for every servo, and moves the joints smoothly from one position to the next instead of jumping, which keeps the arm steady and protects the gears.

### Kinematics: from angles to a position

- **Forward kinematics:** if you know every joint angle, you can work out exactly where the gripper is, using the link lengths and a little trigonometry.
- **Inverse kinematics:** the harder question. To put the gripper at a chosen point, which joint angles do you need? Solving it is what lets an arm reach for an object instead of being moved joint by joint.

This is the same maths covered in [Vortex Workshop 2: The Mathematics of Motion](/events/vortex-workshop-2-mathematics-of-motion).

## What goes into the build

- Hobby servo motors, one per joint
- A microcontroller board to drive them
- A rigid frame of links and brackets
- A stable power supply, since servos draw bursts of current when they move

## What members learn

- Mechanical design: link lengths, joint placement and how weight affects the motors
- Electronics: powering and wiring several servos safely
- Programming: generating PWM signals and smooth motion
- Robotics maths: forward and inverse kinematics

## Where it goes next

A desktop arm is a platform to keep building on: adding a camera so it can find objects on its own, a gripper with force sensing, or a simulation of the same arm to test motions before running them on hardware.', summary = 'A multi-axis desktop robotic arm driven by hobby servos and a microcontroller: a hands-on way to learn joints, PWM control and kinematics.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'desktop-robotic-arm';
