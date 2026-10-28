-- Feedback round, 28 Oct 2026: Life Robo leads its own sessions; IEEE kept to the Collaborations partner cards only.
-- Settings use UPSERT so admin edits elsewhere are untouched.
INSERT INTO settings (key, value) VALUES ('socials', '{"instagram":"https://www.instagram.com/liferobo.foet.lu/","x":"https://x.com/liferobo_foet/","linkedin":"https://www.linkedin.com/company/vortex-life-robo/"}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;
INSERT INTO settings (key, value) VALUES ('collabIntro', '"Life Robo plans and leads its own sessions. We also work alongside the IEEE Student Branch, FoET and IEEE RAS, and keep our workshops open to their members."') ON CONFLICT(key) DO UPDATE SET value = excluded.value;
INSERT INTO settings (key, value) VALUES ('collabGoals', '[{"title":"Open to every branch","description":"Our sessions are open to students from any branch or year. You do not need prior experience to walk in and start."},{"title":"We lead our own sessions","description":"Club members plan and teach every workshop, so what you learn comes from people who build."},{"title":"Hands on, every time","description":"Each workshop leaves you with something to try yourself: a circuit, a piece of code or a working part."},{"title":"One room, more learners","description":"Keeping sessions open to partner members means more students learning, building and asking questions together."}]') ON CONFLICT(key) DO UPDATE SET value = excluded.value;
INSERT INTO settings (key, value) VALUES ('seriesBody', '"Vortex is the robotics workshop series run by Life Robo at the Faculty of Engineering & Technology, University of Lucknow, under the patronage of Prof. Jai Prakash Saini, Vice-Chancellor, and Prof. Satendra Pal Singh, Dean, FoET. Each workshop takes one idea in robotics and works through it from the basics, and every session is planned and led by the club itself.\n\nWorkshop 1, Robotics: Who am I?, was led by Dr. Manoj Kumar Jain, Faculty Convenor of Life Robo. Workshop 2, The Mathematics of Motion, was led by Kunal Anand (Mechanical Engineering, 3rd year) and covered vectors and matrices, coordinate systems, kinematics, dynamics and simulation. More sessions are on the way."') ON CONFLICT(key) DO UPDATE SET value = excluded.value;
UPDATE events SET venue = 'FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'introductory-workshop-robotics-automation-2023';
UPDATE events SET venue = 'FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'lecture-series-robotics-automation-2023';
UPDATE events SET venue = 'Vishwakarma Auditorium, New Building, FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'roboeminence-2023';
UPDATE events SET venue = 'Vishwakarma Auditorium, FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'robotics-workshops-series-2026';
UPDATE events SET venue = 'Vishwakarma Auditorium, FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'antariksh-manthan-2026-career-in-space';
UPDATE events SET venue = 'FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'robotics-workshop-ii-iot-xr';
UPDATE events SET venue = 'FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'robotics-workshop-iii-line-following-robot';
UPDATE events SET venue = 'FoET, University of Lucknow', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'drone-making-workshop-test';
UPDATE events SET venue = 'FoET, University of Lucknow', summary = 'The first Vortex workshop, led by Dr. Manoj Kumar Jain, Faculty Convenor of Life Robo.', body = 'The first workshop of the Vortex series, led by **Dr. Manoj Kumar Jain**, Faculty Convenor of Life Robo.

Dr. Jain opened the series with a simple question: what makes a machine a robot? The session introduced robotics from the ground up, so that anyone in the room, from any branch, could follow the rest of the series.

**What we covered**

- What a robot is
- How a robot senses the world and responds to it
- Where the field is heading

**Patrons:** Prof. Jai Prakash Saini, Vice-Chancellor, University of Lucknow, and Prof. Satendra Pal Singh, Dean, FoET.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'vortex-workshop-1-robotics-who-am-i';
UPDATE events SET venue = 'Room 229, Old Block, FoET, University of Lucknow', body = 'The second workshop of the Vortex series, led by **Kunal Anand** (Mechanical Engineering, 3rd year), Lead of the Life Robo Design & Hardware team.

Every robot that moves is solving maths in real time. This session showed how a robot describes where it is and how it gets somewhere else.

**What we covered**

- Vectors and matrices for robot motion
- Coordinate systems and 3D position
- Kinematics and dynamics of robotic motion
- Simulation, and how it maps to real robots

**Patrons:** Prof. Jai Prakash Saini, Vice-Chancellor, University of Lucknow, and Prof. Satendra Pal Singh, Dean, FoET.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug = 'vortex-workshop-2-mathematics-of-motion';

-- Blog: only finalised posts are public. The two placeholder posts are unpublished; author names are never shown.
UPDATE posts SET published = 0 WHERE slug IN ('career-in-space-key-takeaways', 'workshop-iii-line-follower');
INSERT OR IGNORE INTO posts (slug, title, published_at, cover, cover_alt, excerpt, body, author, published) VALUES ('embodied-ai-when-intelligence-gets-a-body', 'Embodied AI: When Intelligence Gets a Body', '2026-10-28T04:30:00.000Z', '/photos/blog/embodied-ai-humanoid-welding.jpg', 'A humanoid robot welding on a factory floor', 'Robots that watch, learn and act: what embodied AI is, how Vision-Language-Action models work, who is building them and how students can get started.', '## Something that should not be possible

In November 2025, a Figure AI robot watched a BMW assembly worker load car parts for four hours, then did the same job unassisted for a full ten-hour shift. No programmer wrote instructions. No engineer scripted the motion. The robot watched, learned, and acted. Over 11 months at the Spartanburg plant, it helped load parts into 30,000 BMW X3 vehicles.

That is not automation the way factories have known it for decades. That is AI inside a body.

## Intelligence needs a body to matter

![Perception, cognition, action: a robot gripper identifies and grasps an object](/photos/blog/embodied-ai-perception-action.jpg)

Embodied AI refers to AI systems that exist in and interact with the physical world through a body. They perceive the environment through sensors, process what they perceive, decide what to do, and then act through motors and actuators. Not recommendation engines. Not text generators. They pick things up. They drive cars. They assist in surgeries.

The term traces back to a 1991 paper by MIT roboticist Rodney Brooks, "Intelligence without Representation," which made a simple but radical claim: a computer trying to model the world before acting will always be too slow, too fragile, and too wrong. Real intelligence, Brooks argued, uses the world itself as its model. A cockroach navigates complex terrain without a map. It just reacts. That insight launched decades of research into systems that think with their bodies, not just their processors.

Moravec''s Paradox, proposed in the 1980s, points out something counterintuitive: computers can defeat grandmasters at chess but still struggle to pick up a grape without crushing it. High-level reasoning turned out to be easier to automate than low-level physical skill. Embodied AI attacks exactly that problem.

Formally, embodied AI combines three things: **perception** (sensing the world), **cognition** (reasoning about it), and **action** (physically changing it). The intelligence is not separate from the physical form. It depends on it.

## Why the physical world forced the issue

The problem is straightforward: the physical world did not come with an API.

Traditional software AI solved problems inside computers. A spam filter, a chess engine, a language model: all of them manipulate symbols. But manufacturing lines still need humans to handle parts that shift slightly from day to day. Hospitals still need nurses to reposition patients. Warehouses still need workers to pick irregular objects from bins. None of those problems yielded to pure software.

Existing robotic systems were brittle in a specific way. A classical industrial robot can weld the same spot on a car frame 10,000 times without deviation. Change the car model, move the part two centimeters, or introduce a new connector type, and the robot stops. A person retrains in 20 minutes. The robot required weeks of reprogramming. Embodied AI tries to close that gap.

By 2020, three separate pressures had made the gap too costly to live with. Labor shortages in manufacturing and logistics left positions unfilled for months. Aging demographics meant more people needing physical care with fewer workers to provide it. And the success of large language models proved something genuinely new: a single neural network trained on massive data could generalize across wildly different tasks without being explicitly programmed for each one. If that worked for language, the argument went, it might work for motion too.

## From pixels to motor commands

![VLA architecture: vision goes in on the left, motor action comes out on the right](/photos/blog/embodied-ai-vla.jpg)

### The four core components

Every embodied AI system has the same four-part structure, whether it is a humanoid robot or a self-driving car. That is not a coincidence. The split reflects a real division in the problem: sensing the world is a different engineering challenge from reasoning about it, and both are different from physically changing it. Systems that blur those boundaries, trying to go straight from raw pixels to motor commands without a dedicated reasoning layer, tend to be fast but brittle. The four-part architecture is the field''s answer to that tradeoff.

- **Sensors** feed the system raw data: cameras capture visual scenes, LiDAR measures distances with laser pulses, IMUs track acceleration and orientation, microphones capture audio, and tactile sensors detect contact force. A modern humanoid uses dozens of these simultaneously.
- **Perception** converts raw sensor data into something the system can reason about. Computer vision identifies objects and their positions. Depth estimation reconstructs 3D geometry from 2D images. Sensor fusion combines camera and LiDAR data to fill each other''s gaps.
- **Cognition** decides what to do. This is where the AI model lives: a transformer-based brain that reads the scene, understands the task, and plans a sequence of actions. In recent systems, this is a Vision-Language-Action model, or VLA.
- **Actuation** executes the decision. Motors drive joints. Grippers open and close. Wheels turn. The actuator translates a digital command into physical motion.

For most of robotics history, these four layers were built and maintained separately, by different teams, in different codebases. The VLA architecture changed that.

### The Vision-Language-Action (VLA) architecture

The most important architectural development in embodied AI since 2023 is the VLA model. The core idea: treat robot actions the way a language model treats words. Convert every motion into a token. Then train a single transformer to predict action tokens from visual inputs and natural language instructions.

Google DeepMind''s RT-2 (2023) demonstrated this first at scale. They fine-tuned a 55-billion parameter vision-language model, pre-trained on internet data, on robot trajectory data. The result generalized to tasks and objects it had never seen during robot training, because it borrowed physical commonsense from its internet pretraining. If the robot has seen a picture of a banana, it already knows something about how one looks before ever touching it.

Cameras capture the scene while a language instruction names the task. The visual encoder (SigLIP or DINOv2) converts that image to feature vectors; the language model processes vision and language tokens together and passes the result to an action decoder, which outputs motor commands as either discrete tokens or a continuous trajectory via diffusion. Those commands execute on the robot, sensors capture the new state, and the loop runs again at 10–30 Hz. It is a closed loop, not a checklist.

### From simulation to the real world

No team trains robots exclusively in the real world; physical experiments are slow, expensive, and dangerous. Instead, teams build digital twins in simulators like NVIDIA Isaac Sim, which runs physics-accurate virtual worlds on GPU clusters.

The hard part is the **sim-to-real gap**: a robot trained in perfect simulation often fails on real hardware because friction behaves differently, lighting changes, and objects are never exactly where the model expects. Three techniques now reduce this gap. *Domain randomization* deliberately makes the simulation imperfect. *Differentiable physics* lets gradients flow through the physics engine. *Large real-world datasets*, like Open X-Embodiment''s one million episodes from 33 labs across 21 institutions, anchor simulated policies in physical reality.

## Latest innovation: Gemini Robotics 2 (July 2026)

![Gemini Robotics 2: whole-body intelligence with point-cloud spatial reasoning](/photos/blog/embodied-ai-gemini-robotics-2.jpg)

In July 2026, Google DeepMind released Gemini Robotics 2, and it changed one specific thing worth understanding.

Previous robot AI systems handled locomotion (moving through space) or manipulation (using hands) reasonably well, but not both at once. Gemini Robotics 2 introduced **whole-body intelligence**: a single model that coordinates legs, arms, torso, and hands simultaneously, letting the robot walk to a task and execute it without switching between separate control systems.

The model handles objects and environments it has never seen. In testing, it completed tasks described in natural language with no prior demonstration of that specific task. Say "move the stapler to the left side of the desk and open the window," and the robot figures out the sequence, the grasps, and the coordination required.

Physical Intelligence''s π0.7, released the same year, pushed in a different direction. Rather than emphasizing generalization, it focused on physical fluency. π0.7 folds laundry, loads a dishwasher, and handles deformable objects like fabrics with a smoothness earlier robots could not achieve. It uses a diffusion-based action head that produces continuous, fluid trajectories rather than choppy discrete token sequences.

## The companies and labs building what ships next

| Company | Country | Focus | Key deployment |
| --- | --- | --- | --- |
| Google DeepMind | USA/UK | Gemini Robotics, VLA research | Atlas partnership |
| Physical Intelligence | USA | π0 series, generalist policies | Commercial partners |
| Tesla | USA | Optimus humanoid | 50,000+ units in own factories |
| Figure AI | USA | Figure 02/03, Helix VLA | BMW Spartanburg, logistics |
| Boston Dynamics | USA | Atlas (electric) | Hyundai plants, Google DeepMind |
| NVIDIA | USA | GR00T, Isaac, Cosmos | Ecosystem platform |
| Agility Robotics | USA | Digit | Amazon (40 centers), GXO |
| 1X Technologies | Norway | NEO home robot | Consumer beta, 2026 |
| AgiBot | China | G2 humanoid | 5,100 units shipped in 2025 |
| Unitree Robotics | China | H1, G1 | Research and demo |
| Waymo | USA | Autonomous vehicles | 500,000 rides/week (2026) |

**Universities and research labs.** Stanford Human-Centered AI, MIT CSAIL, Carnegie Mellon Robotics Institute, and UC Berkeley''s RAIL Lab are the main US academic centers. ETH Zurich leads in legged locomotion research. Oxford''s Robot Learning Lab contributes significantly to manipulation. In China, Tsinghua, Zhejiang University, and Shanghai AI Lab have grown quickly, now holding a large share of publications at ICRA, IROS, and CoRL.

**Research organizations.** The Open X-Embodiment Collaboration (Google + 33 labs across 21 institutions, 1M+ robot episodes collected), the annual Embodied AI Workshop at CVPR, and ISO''s new working group on humanoid robot safety standards (announced May 2025) are the major cross-institutional efforts shaping field norms.

## Four constraints that define the field

A humanoid robot in a factory is four problems at once: a mechanical structure that needs to hold up under load, an electrical system that needs to run for hours, a control problem that needs to react in milliseconds, and a machine learning challenge that needs to generalize across tasks it was never explicitly trained for. These constraints do not stack neatly. They collide.

### Mechanical engineering

Humanoid robots need strength without weight. Boston Dynamics Atlas uses carbon fiber and aluminum with 28 electric actuators. Tesla Optimus uses linear actuators designed in-house, borrowing from automotive supply chains to cut costs. The structural target for consumer-grade humanoids is under 70 kg body weight with enough load capacity to lift 20+ kg, at a production cost under $30,000.

Dexterity is the hardest mechanical problem. The human hand has 27 degrees of freedom. Most robot hands manage 12–16 before cost and fragility become unworkable. The Shadow Dexterous Hand (20 DoF) costs over $100,000 alone. This dexterity gap explains why humanoid robots can do structured assembly but cannot reliably handle everyday household objects.

### Electronics and power

Edge inference for VLA models at 10 Hz requires chips like NVIDIA Jetson Thor, designed specifically for robotic inference. The power problem is severe: current humanoids carry batteries lasting 90 to 120 minutes. An industrial shift runs 8–12 hours. Solid-state batteries at meaningful scale are 2–3 years out, so current deployments either work in short bursts or stay tethered.

### Control systems

Two control levels run in parallel. Low-level joint control uses PID controllers at 1 kHz, adjusting motor current to hit precise position and torque targets. High-level behavior uses Model Predictive Control (MPC) or learned policies at 10–30 Hz, coordinating whole-body motion. Reinforcement learning now handles locomotion training almost entirely; teams at ETH Zurich trained legged robots to climb stairs and recover from falls through 10,000 simulated hours in Isaac Lab.

### AI and computer vision

The core AI stack has three stages. Vision encoders (DINOv2, SigLIP) convert raw images to feature representations. A transformer backbone (7B to 70B parameters) processes those features alongside language instructions. An action head decodes the output into motor commands, either as discrete tokens (RT-2 style) or via a diffusion process (π0 style). Diffusion-based action heads produce smoother motion and handle contact-rich tasks better.

### Sensors and actuators

RGB-D cameras (Intel RealSense, ZED2) give both color and depth. LiDAR gives precise distance maps for large-scale navigation. The frontier sensor right now is tactile: GelSight sensors use a camera behind a soft gel surface to reconstruct the geometry of whatever the robot touches. CapTac (ICRA 2026) adds capacitive force mapping across a gripper surface. Tactile sensing is to manipulation what depth sensors were to navigation: the missing input channel that unlocks a whole class of tasks.

### Programming languages and tools

ROS2 handles inter-process communication between sensors and actuators. PyTorch and JAX train the neural networks. CUDA runs GPU-accelerated inference on edge hardware. Python is the default language for research and policy training; C++ handles real-time motor control where latency matters.

## Applications

![KUKA arms and human workers sharing the same assembly line at BMW Spartanburg](/photos/blog/embodied-ai-bmw-line.jpg)

**Manufacturing.** Tesla''s Fremont factory has 1,000+ Optimus Gen 3 units sorting battery cells and doing light assembly. Figure AI''s Helix-powered robots ran 10-hour shifts at BMW Spartanburg, and error rates stayed low enough that the plant extended the deployment rather than rotating back to manual labor. The common pattern across both: structured environments, repetitive tasks, high labor turnover.

**Healthcare.** Robotic-assisted surgery reached 60% adoption in large hospitals by 2026. A 2025 systematic review of 25 studies found AI-driven surgical robots cut operative time by 25% and complication rates by 30% compared to manual technique. Elder care companions are entering hospitals and assisted living facilities, though full domestic deployment is 3–5 years out.

**Logistics.** Amazon crossed one million warehouse robots in active operation in 2025. Its Sparrow arm picks individual items with 99.2% accuracy. Agility Robotics'' Digit operates inside 40 Amazon fulfillment centers as of June 2026. The global AMR market hit $8.5 billion in 2026 with 4 million+ units deployed worldwide.

**Autonomous vehicles.** Waymo delivers 500,000 rides per week across Phoenix, San Francisco, and Los Angeles with fully driverless vehicles, reporting a 91% reduction in serious crashes versus human drivers. Tesla''s FSD v14.3.2 has accumulated tens of billions of supervised miles. Both are embodied AI at scale: AI making physical decisions at 60 mph with real consequences.

**Agriculture and construction.** Precision agriculture drones spray crops, monitor plant health, and map fields. In India, over 38,000 drones are registered for agricultural use. Construction inspection robots from DroneDeploy are entering beta for autonomous daily site documentation. Rebar assembly robots passed controlled trials in 2025 (published in *Automation in Construction*).

**Domestic and space.** Home robots from 1X Technologies (NEO) and Figure 03 are in beta home trials as of 2026. Tasks currently achievable include moving objects, tray carrying, and basic tidying. Laundry folding remains unreliable in real homes where clothing varies constantly. In space, JPL rovers continue to push autonomous navigation where a one-way communication delay of 20 minutes makes remote control impractical.

## Current limitations

**Reliability is the gap that matters most.** A robot policy achieving 95% task success in a controlled lab drops to roughly 60% in real deployment because lighting, object textures, and surface friction differ from training conditions. In a 10-step manipulation sequence at 95% per-step accuracy, the full chain succeeds only 60% of the time. A warehouse robot failing 50 times a day needs constant human intervention, which defeats the purpose of automation.

**Battery life** caps operational time at 90–120 minutes for current humanoids. Industrial deployments need 8–12 continuous hours. Until solid-state batteries scale (projected 2028–2030), humanoids need tethering or frequent swap-outs.

**Data scarcity** slows training. Open X-Embodiment has one million robot episodes, but GPT-4 trained on trillions of text tokens. Collecting physical interaction data requires real robots doing real work, slowly and expensively.

**Long-horizon tasks** remain unsolved. No robot system reliably executes 10 or more distinct subtasks in an unstructured environment without human intervention, as of late 2026. Current frontier: 30 minutes of coherent autonomous operation.

**Governance and liability** are unresolved. The EU Machinery Regulation and ISO 10218:2025 cover physical safety but were written before AI-driven learning robots existed at scale. When a learning-enabled robot damages property or injures someone, who is liable: the manufacturer, the operator, or the software developer? No jurisdiction has answered this clearly yet.

## How to get in from the ground up

![A robot arm tracks and responds to real objects in real time](/photos/blog/embodied-ai-arm-tracking.jpg)

**Core subjects.** Linear algebra, probability theory, and control theory are non-negotiable. Kinematics and dynamics cover the mechanical side. Algorithms and data structures are foundational for implementation.

**Programming.** Python for AI/ML work and prototyping. C++ for real-time robot control code (ROS2 nodes, hardware drivers). Shell scripting for running experiments and managing training pipelines.

**Tools and frameworks.** ROS2 is the operating system of modern robotics. NVIDIA Isaac Sim and Isaac Lab for physics simulation and RL training. MuJoCo for research-grade physics. PyTorch for model training. OpenCV and YOLO for computer vision. Hugging Face''s LeRobot for VLA-style robot learning on consumer hardware.

**Hardware skills.** Start with Arduino or Raspberry Pi. Learn servo control, sensor interfacing, and basic circuit design. Move to ROS2 on a real 6-DOF arm. CAD skills in Fusion 360 help with designing mounts and end effectors.

### Suggested learning path

| Timeline | Focus | Milestone |
| --- | --- | --- |
| Months 1–3 | Python + ROS2 + basic robot arm kit | Control a servo from code |
| Months 4–6 | Computer vision, YOLO, depth cameras | Build a simple grasping demo |
| Months 7–9 | Reinforcement learning in MuJoCo / Isaac Sim | Train a locomotion policy |
| Months 10–12 | Read the RT-2 and π0 papers; fine-tune SmolVLA via LeRobot | Custom pick-and-place policy |
| Year 2 | Contribute to open-source repos; write about what you built | GitHub portfolio, first paper draft |

That progression, done consistently, puts a student at the edge of what most research teams are actually working on.

## Five open problems worth watching

The near-term benchmark the field has converged on is **100-step autonomous task completion**: get a robot to cook a meal from start to finish, in an unfamiliar kitchen, with utensils it has never seen, recovering from spills without human intervention. Nobody has done it yet. If someone does, the architecture that gets there will probably transfer directly to manufacturing, logistics, and care.

**Catastrophic forgetting** remains unsolved. Neural networks lose old skills when trained on new tasks. A robot learning to fold laundry should not forget how to pick up boxes. CMU''s Lifelong Robot Learning group and Google DeepMind''s continual learning team are both active here. Elastic Weight Consolidation (EWC) and PackNet show results in simulation, but neither has survived contact with a real multi-task deployment at scale.

**Multi-modal sensor fusion** is underdeveloped. Current systems are vision-dominant by default, not because vision is sufficient, but because image data is cheap to collect. Integrating tactile, proprioceptive, and audio signals at training time matters enormously for contact-rich tasks. GelSight (MIT) reconstructs contact geometry from a camera behind a soft gel pad; CapTac, presented at ICRA 2026, adds capacitive force mapping across a gripper surface. Neither has been integrated into a production VLA yet, which means most deployed robots are still flying blind on contact.

**Multi-agent coordination** is in early research. A single robot is useful; a coordinated team working the same space multiplies throughput in ways one unit cannot. Amazon''s warehouse operations already coordinate thousands of AMRs, but those are fixed-route systems, not general-purpose learners. NVIDIA''s Omniverse simulates multi-agent humanoid scenarios at scale; getting sim results to transfer to real hardware is the unsolved part.

**Neuromorphic computing** (Intel Loihi 2) processes sensor signals at roughly 1000x lower power than GPU-based inference. Intel has not committed to a public robotics-grade Loihi roadmap, but the research trajectory points toward edge deployment inside this decade. If the power numbers hold at scale, neuromorphic processors could extend operational hours without waiting for solid-state batteries.

The longer-term question is whether this field converges toward something like **physical AGI**: a generalist agent that picks up any task as fast as a person, in any environment, from a handful of demonstrations. Researchers at CMU and Stanford think the hardware and software could get there within a decade. The honest answer is that the timeline is almost entirely a function of the data problem. Solve robot data collection at scale and the rest follows. Don''t, and 15 years is probably optimistic.

## References

1. Brooks, R.A. (1991). Intelligence without Representation. *Artificial Intelligence*, 47(1–3), 139–159.
2. Brohan, A. et al. (2023). RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control. Google DeepMind.
3. Physical Intelligence. (2024). π0: A Vision-Language-Action Flow Model for General Robot Control. arXiv:2410.24164.
4. Physical Intelligence. (2026). π0.7: A Steerable Generalist Robotic Foundation Model with Emergent Capabilities. arXiv:2604.15483.
5. Google DeepMind. (July 2026). Gemini Robotics 2 Brings Whole-Body Intelligence to Robots.
6. NVIDIA. (March 2026). NVIDIA and Global Robotics Leaders Take Physical AI to the Real World. GTC press release.
7. Li, J-M. et al. (May 2026). Embodied AI in Action: Insights from SAE World Congress 2026. arXiv:2605.10653.
8. Perlo, J. et al. (October 2025). Embodied AI: Emerging Risks and Opportunities for Policy Action. NeurIPS 2025. arXiv:2509.00117.
9. MarketsandMarkets. (2025). Embodied AI Market: Global Forecast to 2030.
10. Voxos AI. (February 2026). The State of Embodied Intelligence: Robotics in 2026.
11. Da, L. et al. (2025). A Survey of Sim-to-Real Methods in RL. arXiv:2502.13187.
12. Open X-Embodiment Collaboration. (2023). Open X-Embodiment: Robotic Learning Datasets and RT-X Models.
13. NVIDIA Research. (June 2026). NVIDIA Research Advances Robotics From Simulation to the Real World.
14. Nature. (July 2026). How "embodied intelligence" makes robots seem more human.
15. TechAhead. (May 2026). Physical AI in 2026: How Embodied Intelligence Is Redefining Industrial Operations, Healthcare, and Smart Cities.
16. Crunchbase. (May 2026). Embodied AI Fuels Record Robotics Funding in China.
17. APCO Worldwide. (August 2026). Embodied AI: China''s Bid to Shape an AI-Powered Future.
18. Embodied AI Workshop, CVPR 2026. World Models for Embodied AI.
19. AI Magicx. (March 2026). Humanoid Robots in the Workplace: The 2026 Business Leader''s Reality Check.
20. ACM Computing Surveys. (March 2025). Embodied Intelligence: A Synergy of Morphology, Action, Perception and Learning.', 'Life Robo', 1);
INSERT OR IGNORE INTO posts (slug, title, published_at, cover, cover_alt, excerpt, body, author, published) VALUES ('robot-foundation-models', 'Robot Foundation Models: One Brain, Many Bodies', '2026-10-28T04:20:00.000Z', '/photos/blog/foundation-model-vla.jpg', 'Diagram of a Vision-Language-Action model turning camera input and an instruction into joint commands', 'How large, general-purpose AI models are learning to control many kinds of robots, the engineering behind them, and why cybersecurity matters once AI has a body.', '## What is a robot foundation model?

A robot foundation model is a large, general-purpose AI system designed to control robots across a wide variety of tasks, environments, and hardware types.

## How is it different from traditional robots?

The core concept is similar to how Large Language Models (LLMs) work, but applied to physical movement and real-world interaction.

Instead of being programmed for one specific, repetitive job (like traditional factory robots), these models are trained on massive datasets of robot teleoperation, internet videos, simulations, and sensor logs.

Key features include:

- **Generalization:** A single model can perform multiple unscripted tasks, like picking up a cup, opening a drawer, or wiping a table, without needing task-specific retraining.
- **Vision-Language-Action (VLA):** They process visual input (camera feeds) and natural language commands (e.g., "put the red apple in the basket"), translating them directly into low-level physical motor actions.
- **Cross-Embodiment:** Advanced models (such as Google DeepMind''s RT-X or open-source models like Octo) can operate different types of robot bodies. The same underlying "brain" can control a simple mechanical arm in a lab and a bipedal humanoid.

## Why do we need them?

We need robot foundation models primarily to move robots out of highly controlled environments (like factory assembly lines) and into messy, unpredictable human spaces (like homes, hospitals, and busy warehouses).

Here is why they are a necessary leap forward:

- **Eliminating task-specific coding:** Traditionally, programming a robot to fold a shirt and then programming it to chop an onion required two entirely different, expensive, and time-consuming software setups. Foundation models allow one system to learn general physical skills and apply them to thousands of different unscripted tasks.
- **Handling unpredictability:** Old-school robots fail if a cup is moved two inches to the left. Foundation models use vision and language to understand context, allowing them to adapt on the fly to clutter, changing lighting, or moving obstacles.
- **Natural human interaction:** Because they process natural language, you do not need to be an engineer to operate them. You can give them a casual command like "Pick up the blue shirt and put it in the drawer," and the model translates that into the low-level physical movements required.
- **Cross-hardware scaling:** Instead of building a new "brain" for every new robot body, a single foundation model can control multiple types of hardware, from simple mechanical arms to bipedal humanoids. This drastically speeds up development and deployment.

## The engineering behind it, and how it adapts to its environment

Before a robot can switch between making a cup of tea, folding clothes, or clearing a table, it first needs a basic understanding of how the physical world actually works. We often call this **"intuitive physics."**

Instead of engineers writing complex mathematical equations for gravity, friction, or the exact force needed to grip a fragile egg versus a heavy brick, the foundation model learns these rules through massive amounts of data: watching millions of internet videos, running simulations, and real-world trial and error.

It is very similar to how a toddler learns. A toddler doesn''t know the math behind gravity, but through interacting with the world, they learn that a glass will break if dropped, a rubber ball will bounce, and a full jug of water needs two hands to lift.

Once the foundation model builds this deep, intuitive understanding of real-world physics, that "brain" can be put into a single robot, allowing it to tackle completely different, unscripted tasks without crashing or breaking things.

> The body might change, but the brain stays the same.

## What is happening right now?

Robot foundation models (often called Vision-Language-Action models) in active use and research:

- **RT-1 and RT-2 (Robotic Transformer):** Developed by Google DeepMind, these are pioneer models. RT-2 coined the term "Vision-Language-Action," proving that an AI could take in vast amounts of internet data, process visual feeds and natural language commands, and translate them directly into physical robotic movements.
- **Octo:** A popular open-source model created by university researchers. It is designed for cross-embodiment, so its underlying brain can be adapted to control many different types of robot arms and hardware setups.
- **OpenVLA:** A 7-billion parameter open-source model trained on the Open X-Embodiment dataset (a huge, shared pool of robot data from dozens of institutions) to make high-level robotics research more accessible to developers worldwide.
- **π0 (Pi-Zero):** A general-purpose foundation model developed by the AI robotics company Physical Intelligence, aimed at bringing seamless, cross-body control to everyday tasks.
- **Project GR00T:** NVIDIA''s foundation model built specifically to act as the brain for humanoid robots, helping them learn natural coordination, dexterity, and movement.
- **RoboCat:** Another DeepMind project, built as a "self-improving" robotic agent that learns to perform multiple tasks across completely different types of mechanical arms by generating its own training data.

## Engineering and technologies involved

The technology stack behind robot foundation models shifts away from traditional modular robotics, where perception, planning, and control were built as completely separate systems, to unified AI architectures that process the physical world much like large language models process text.

![Vision-Language-Action architecture mapping vision and language inputs to joint commands through multimodal tokenization and a transformer policy](/photos/blog/foundation-model-vla.jpg)

- **Vision-Language-Action (VLA) transformers:** Instead of fragmented software pipelines, a single large transformer model acts as the central brain. It ingests RGB camera feeds and natural language instructions simultaneously and directly outputs low-level physical motor commands (like joint angles or gripper torques) in a single forward pass.
- **Multimodal tokenization:** The system converts all inputs into a common mathematical currency called "tokens." Visual inputs from cameras (processed by vision encoders like SigLIP or DINOv2) become visual tokens, spoken commands become semantic tokens, and proprioceptive sensor data (the robot''s current joint positions) become state tokens. The transformer processes all these tokens together to understand the context.
- **Dual-system architecture:** Advanced models mimic human cognition by splitting the workload. A high-level "System 2" handles semantic reasoning, spatial understanding, and multi-step task planning (deciding the strategy to approach a fragile object). A low-level "System 1" continuously executes high-frequency motor commands (e.g., 200 Hz) and handles real-time physical adjustments based on visual and force feedback.
- **Diffusion policies for action generation:** When reaching for an object, there are dozens of valid ways to grab it. Instead of deterministic math that averages these options into clunky, inaccurate movements, models use diffusion algorithms (similar to how AI image generators work) to "denoise" candidate motions and generate crisp, confident, and accurate trajectories.
- **Omni-body (cross-embodiment) engineering:** Historically, software trained for a 6-axis arm would immediately fail on a 7-axis arm. Modern foundation models are engineered to receive sensor data from, and output actions for, multiple robot body types (morphologies) and leg geometries without ground-up retraining for every new machine.
- **Edge computing and inference:** Physical robotics needs tight, real-time control loops (reacting in milliseconds to avoid dropping items or hitting obstacles), so sending massive amounts of sensor data to the cloud is rarely viable. The stack relies heavily on edge computing, compressing these models so they can run on the robot''s onboard hardware.
- **Automated reward models:** To scale training without constant human supervision, engineers use AI "reward models." The robot attempts a physical task, the reward model scores the behavior based on human preferences, and a policy optimizer adjusts the robot''s neural network. This loop runs thousands of times autonomously to refine the robot''s real-world skills.

![Pipeline from task setup and teleoperation or simulation data preparation to policy co-training and deployment](/photos/blog/foundation-model-pipeline.jpg)

## The future, and current limitations

Over the next 3 to 5 years, physical AI will shift from getting robots to simply work in labs to making them commercially scalable, highly secure, and "assurance-ready" for public spaces. A few major technical leaps are shaping that future:

- **World models (internal imagination):** Future foundation models won''t just react to their camera feeds; they will develop an internal simulation of reality. Before a robot reaches for a fragile chai glass, its world model will simulate the physics in milliseconds, predicting what happens if it grips too hard or bumps the table, and adjust its strategy before it even moves.
- **True omni-body scaling:** We are moving toward a "plug-and-play" era for AI brains. A single, massively trained foundation model will be able to operate a robotic dog inspecting a factory floor in Pune, a static 6-axis arm on an assembly line, and a bipedal humanoid, without rewriting the core software for each hardware type.
- **The cloud-edge split:** To handle the physical world without dangerous internet lag, future architectures will split the workload. High-level semantic reasoning (understanding a complex spoken instruction) will run in the cloud, while fast physical reflexes and safety guardrails run on edge chips inside the robot.
- **Humanoid integration and cybersecurity:** As models solve the immense balancing and coordination challenges of humanoids (which have 30 to 50 moving joints), they will enter the logistics and healthcare workforce. With that physical presence, cybersecurity for robots becomes critical.
- **Autonomous error recovery:** Right now, if a robot drops an item, it often freezes or fails the task. Future models will be trained heavily on safety resilience: knowing how to reject unsafe commands, recover from mistakes, and try a different physical approach without human intervention.

![A video world model generating synthetic futures, extracting pseudo-actions and enabling data augmentation and generalization](/photos/blog/foundation-model-world-model.jpg)

## What about cybersecurity?

Cybersecurity in robot foundation models (often referred to as Physical AI or Vision-Language-Action models) is unique because a digital breach can have direct, real-world physical consequences. Securing these systems goes far beyond traditional IT security; it means protecting the bridge between an AI''s "brain" and the robot''s physical movements.

- **Securing the AI and software stack:** Identifying vulnerabilities across the entire robotics architecture, from the high-level foundation models and AI Bill of Materials (BOMs) to the underlying firmware, APIs, and low-level motor control systems.
- **Validating physical impact before deployment:** Security teams must test the AI in simulated environments before release, to see whether a cyber exploit, like a compromised interface or sensor, changes the robot''s perception, decisions, or physical motion in a dangerous way.
- **Runtime monitoring and threat detection:** Once deployed, continuous monitoring is needed to catch active threats, including sensor spoofing (feeding the robot fake visual data so it misreads a boundary) or hijacked motion commands that could push a robot outside its approved safety limits.
- **Protecting the data flywheel:** Foundation models keep learning from new real-world data (capture → curate → train). Security must ensure data integrity and prevent "data poisoning," where corrupted data slowly degrades the robot''s intuitive physics or safety reflexes.
- **Edge vs. cloud security:** Because high-level reasoning often happens in the cloud while low-level reflexes run on local edge chips, the high-speed link between the two layers must be secured against interception and latency-induced failures.
- **Regulatory readiness:** Keeping traceable cyber-safety evidence to comply with emerging frameworks (like the EU AI Act or Machinery Regulations), which increasingly require operators to prove their systems are safe from cyber risks that could alter physical behavior.

In short, cybersecurity for robot foundation models is about making sure a compromised perception model doesn''t lead to an unsafe path, a dropped load, or a collision on a busy warehouse floor.

## Current realities vs. future horizons: the clerk and the maid

The roles of a clerk and a maid sit at two ends of the spectrum for robot foundation models, especially when you look at everyday life in India.

**The clerk (near future).** This is realistic within the next few years. A clerk''s physical environment is usually structured: sitting behind a desk, organizing files, scanning barcodes, or handing over receipts. AI models already excel at the cognitive part of the job (data processing, answering queries), so pairing that with a foundation model that controls a pair of robotic arms for document handling or retail packing is a very feasible engineering step.

**The maid or domestic helper (distant future).** A general-purpose robotic *kaamwali bai* is one of the hardest engineering challenges in the world. Indian homes are dynamic, cluttered, and unpredictable. The tactile, intuitive physics needed to scrub a sticky steel *kadhai*, carefully fold a saree, or mop around floor seating without bumping into things is incredibly complex. Models are learning these skills, but a fully autonomous, affordable humanoid moving seamlessly around an Indian home is still a long way off.

We will likely see commercial adoption first, like a robotic clerk managing inventory at a local D-Mart or a bank branch, long before a single robot replaces human domestic help.

## References

- Robot Foundation Models explained, Humanoid.guide
- Foundation Model: Large Pre-Trained Models for Robotics, RCSV
- Argo-Robot/foundation_models on GitHub: an overview of state-of-the-art imitation learning techniques for robotic manipulation
- arXiv:2604.15395, Foundation Models in Robotics: A Comprehensive Review of Methods, Models, Datasets, Challenges and Future Research Directions', 'Life Robo', 1);
INSERT OR IGNORE INTO posts (slug, title, published_at, cover, cover_alt, excerpt, body, author, published) VALUES ('humanoid-robots-why-walking-is-only-half-the-problem', 'Humanoid Robots: Why Walking Is Only Half the Problem', '2026-10-28T04:10:00.000Z', '/photos/blog/embodied-ai-home.jpg', 'A humanoid robot handing a toy block to a child at home', 'Balance, links and joints, actuators, sensing and control: the engineering that has to come together before a humanoid robot is useful.', '*A student perspective on the engineering behind humanoid robotics.*

## Introduction

A humanoid robot is a robot designed to look and move like a human. It has a head, a torso, two arms and two legs. It senses the world, thinks, moves and interacts much like a person does.

People build humanoid robots to work in places designed for humans, to take on tasks that are dangerous, difficult or repetitive, and to assist in areas like healthcare and research. They also help us learn about balance, mobility and intelligent machines, because they bring mechanics, electronics and software together in one body.

Walking is a major challenge for humanoid robots. To walk, a robot must move its joints smoothly, sense its position and stay balanced. It needs strong mechanical design, accurate sensing of position and force, fast control to keep balance, enough energy for long use, and safe interaction with people and objects.

> Walking is visible, but it is not the whole problem.

This article looks at the engineering challenges that make humanoid robots difficult to build. Each part matters, but only when all of them work together does the robot become truly useful.

## What is a humanoid robot?

A humanoid robot is a machine with a human-like arrangement of major body sections and joints: a head, torso, two arms and two legs. This similar layout helps the robot interact with environments built for people. However, the internal mechanisms (sensors, actuators, gearboxes, electronics and control systems) can be very different from a human body.

**Links, joints and degrees of freedom**

- **Links** are the rigid segments of the robot (upper arm, thigh, lower leg) that form the structure.
- **Joints** connect links and allow relative motion: rotational (like a hinge or ball joint) or sometimes linear (sliding).
- **Degrees of freedom (DOF)** are the number of independent motions a joint, or the whole robot, can perform.

## Sensors, actuators and control

A robot uses sensors to understand its own state and its surroundings. The controller processes that information and sends commands to actuators, which produce movement. This closed loop (sensors → controller → actuators → movement) enables precise, adaptable behaviour.

- **IMU:** measures body motion and orientation.
- **Joint encoders:** measure joint position.
- **Force/torque sensors:** help detect contact and load.
- **Cameras:** provide visual information.
- **Motors and gear trains:** create motion.
- **Controller:** combines the measurements and commands action.

## Why are we building humanoid robots?

Humanoid robots are built to move and work in spaces that were designed for people. Our homes, factories and public spaces all have human-sized doors, stairs, tools, shelves and workstations. A robot with a human-like body can reach the same controls, use the same tools and navigate the same environments without everything around it being redesigned.

**The trade-off.** Matching the human form improves access to existing environments, but it also creates hard problems. Balancing on two legs is difficult. Control is complex. And working safely around people requires careful design and testing.

Where they are headed: **manufacturing, warehouses, healthcare, disaster response and household assistance.**

## Walking is only the beginning

Humanoid robots face a hard problem: staying upright while moving. Walking on two legs is difficult because the robot''s balance is always changing.

The robot has a small area of support on the ground. Its centre of mass moves continuously. The feet must be placed in the right locations, and balance must be maintained when the robot switches support between its legs or experiences disturbances.

**Definition: support polygon.** The support polygon is the area on the ground enclosed by the outermost points of contact of the robot''s feet. As long as the vertical projection of the centre of mass stays inside this area, the robot can remain balanced. The key ideas are centre of mass, support area, stability, foot placement and dynamic balance.

## The mechanical side

The mechanical system gives a humanoid robot its shape, its strength and its ability to move. It is built from links connected by joints, driven by actuators and gears, and supported by lightweight structures and materials.

- **Links** are rigid parts that connect joints to form kinematic chains. They transmit loads and define the robot''s geometry.
- **Joints** connect two links and allow controlled relative movement. Common types include revolute (hinge) and spherical joints.
- **Degrees of freedom** are the independent motions a joint or mechanism can produce. More DOF gives greater flexibility and dexterity.
- **Torque** is the turning effect that causes rotation at a joint. It depends on the load and the distance from the axis.
- **Gear mechanisms** change speed and torque between the actuator and the joint. They also improve control and hold position against external loads.
- **Actuators** convert energy into motion. Electric motors are the most common choice in humanoid robots because of their control and efficiency.
- **Lightweight structures and materials** reduce weight while keeping strength and stiffness, which improves agility and efficiency.

**Design balance matters.** Good mechanical design is about balance. It must provide enough strength without extra weight, allow the right range of motion, keep enough stiffness for accurate control, minimise backlash for precision, be easy to maintain, and always ensure safety.

## Engineering systems beyond walking

A humanoid works only when its mechanical hardware, sensing, control and software operate as one system.

1. **Control systems.** Control converts a desired movement into safe joint commands. Feedback from encoders, the IMU and other sensors helps the controller detect errors and correct the motion. More advanced systems combine model-based control, trajectory planning and learning-based methods.
2. **Sensors.** Common sensing includes joint encoders for position, IMUs for orientation and body motion, cameras for vision, and force/torque sensors for contact and load. Sensor fusion is important because no single sensor gives the complete state of a humanoid.
3. **Artificial intelligence.** AI is increasingly used for perception, motion planning and learning skills from demonstrations or simulation. The important idea is embodied intelligence: the software must connect what the robot senses with what its physical body can actually do.
4. **Computer vision.** Cameras and depth sensors help identify objects, people and obstacles. Vision is useful for tasks like locating a box, finding a handhold or estimating where a target is.
5. **Programming.** Robotics software commonly uses C++ and Python. ROS 2 is widely used to connect sensors, controllers and robot applications. Simulation lets developers test algorithms before running them on physical hardware.
6. **Materials and manufacturing.** The structure needs to be light, stiff and strong. Aluminium alloys, steels, titanium and composites are chosen according to the load and the manufacturing method. Precision machining, additive manufacturing and careful assembly all matter during development.

**Why this matters.** A humanoid is not "just a robot that walks." A small change in weight, joint torque or sensor accuracy can affect balance and control. That is why mechanical engineering and software engineering have to be considered together.

## Latest developments and research

Humanoid robotics has moved from mainly laboratory demonstrations toward industrial trials, data collection and early commercial deployment.

1. **Atlas, Boston Dynamics.** In 2026 Boston Dynamics described Atlas as a production-ready electric humanoid for industrial work. The company is training Atlas in real manufacturing environments, including Hyundai Motor Group''s Metaplant Application Center.
2. **Digit 5, Agility Robotics.** Agility unveiled Digit 5 in September 2026, focused on cooperatively safe work around people. The company says the platform has logged more than 65,000 hours of operation and commercial deployments.
3. **Figure 03, Figure AI.** Figure has been scaling production and combining its humanoid hardware with its Helix AI system. In 2026 the company reported that its BotQ facility had delivered hundreds of third-generation robots and was increasing production.
4. **Apollo 2, Apptronik.** Apollo 2 combines humanoid mobility, manipulation and embodied AI. In 2026 the company announced Robot Park facilities where Apollo robots collect real-world data to train future robot intelligence.
5. **Unitree G1.** A relatively compact humanoid platform used for research and development. Unitree lists 23 to 43 joint motors depending on configuration, and highlights imitation and reinforcement learning and force-controlled manipulation.
6. **Tesla Optimus.** Tesla describes Optimus as a general-purpose bipedal humanoid for unsafe, repetitive or boring tasks. Its robotics work combines vision, planning, balance, controls, mechanical engineering and software.

**Universities and research.** Humanoid research is active at universities and labs, including MIT''s Robot Locomotion Group and CSAIL, Stanford''s robotics and movement research, and KAIST''s Humanoid Robot Research Center. Their work covers locomotion, control, perception, manipulation, hardware and learning.

## Limitations, student skills and the future

The difficult part is moving from a controlled demonstration to reliable everyday operation.

**Current limitations**

- Battery life and energy use limit operating time.
- Bipedal balance is sensitive to disturbances.
- Dexterous hands are difficult to control reliably.
- Sensors can be noisy in real environments.
- Cost, maintenance and safety remain major issues.

**The real-world challenge.** A robot that works well in a laboratory may struggle in a crowded factory or home. Lighting, floor conditions, unexpected objects, human movement and small mechanical errors can all affect performance. Reliable deployment needs extensive testing and safety measures.

**Skills for students**

- Engineering mechanics, kinematics and dynamics
- Machine design, CAD and manufacturing basics
- Motors, gearboxes, sensors and basic electronics
- Control systems and feedback concepts
- Python/C++ and basic programming
- ROS 2 and robotics simulation
- Computer vision and introductory AI/ML
- Practical prototyping, testing and documentation

**What could come next?** Future humanoids are likely to combine better actuators, lighter structures, richer sensing and AI systems that can learn more general skills. Research is also moving toward whole-body control, dexterous manipulation and safer human–robot collaboration. The biggest step will be making these abilities reliable, affordable and efficient outside controlled demonstrations.

## The main takeaway

Walking is only the beginning. A useful humanoid has to sense its environment, keep its balance, plan movement, manipulate objects, manage energy and work safely around people. That is why humanoid robotics is a combined problem of mechanics, electronics, control and artificial intelligence.

## References

1. Boston Dynamics, "Atlas'' Evolution From Research Robot to Industrial Humanoid." Accessed 11 October 2026. [bostondynamics.com](https://bostondynamics.com/blog/atlas-evolution-from-research-robot-to-industrial-humanoid/)
2. Boston Dynamics, "Robotics Metaplant Application Center." [bostondynamics.com](https://bostondynamics.com/news/boston-dynamics-opens-robotics-metaplant-application-center-to-train-humanoid-robots-for-manufacturing-tasks/)
3. Agility Robotics, "Digit 5 Humanoid Robot." [agilityrobotics.com](https://www.agilityrobotics.com/content/agility-unveils-digit-5-humanoid-robot-built-for-cooperatively-safe-work-at-scale)
4. Figure AI, news and research updates on Figure 03 and Helix. [figure.ai/news](https://www.figure.ai/news)
5. Apptronik, Apollo 2 and Robot Park. [apptronik.com](https://apptronik.com/apollo/apollo-2)
6. Tesla, AI & Robotics: Optimus. [tesla.com/AI](https://www.tesla.com/AI)
7. Unitree Robotics, G1 humanoid robot. [unitree.com/g1](https://www.unitree.com/g1/)
8. IEEE Xplore, "Humanoid Locomotion and Manipulation: Current Progress and Challenges in Control, Planning, and Learning." [ieeexplore.ieee.org](https://ieeexplore.ieee.org/abstract/document/11456437/)
9. MIT Robotics: research groups and the Robot Locomotion Group. [robotics.mit.edu](https://robotics.mit.edu/)
10. Stanford Robotics / Movement Lab: humanoid robotics and movement research. [tml.stanford.edu](https://tml.stanford.edu/)
11. KAIST Humanoid Robot Research Center. [research.kaist.ac.kr](https://research.kaist.ac.kr/page/ko/selectPage.do?menuSeq=3648&pageSeq=3726)
12. IEEE, "A Model Predictive Capture Point Control Framework for Robust Humanoid Balancing." [ieeexplore.ieee.org](https://ieeexplore.ieee.org/document/10989514/)

*Company pages are used for current product and deployment information; research papers are used for technical background.*', 'Life Robo', 1);

-- Partner cards: no claim that IEEE provides speakers or runs our sessions.
UPDATE partners SET body = 'The branch connects FoET students to IEEE and runs its own events, along with groups like WIE and RAS. Our workshops stay open to its members, so students from both groups learn in the same room.' WHERE short_name = 'IEEE SB FoET LU';
UPDATE partners SET body = 'RAS student members at FoET are welcome at our sessions. For anyone who wants to go further, the society is a route to robotics resources and competitions.' WHERE short_name = 'IEEE RAS';
