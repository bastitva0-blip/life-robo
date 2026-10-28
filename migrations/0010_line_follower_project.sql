-- Fuller write-up for the line follower project (feedback: "give more details").
UPDATE projects SET body = 'A line following robot built from scratch and demoed live during **Robotics Workshop-III: Line Following Robot, Live Building and Demo**, led by Jatin Pandey (Software Team Lead, 3rd year CSE-AI).

## How it works

A line follower is one of the simplest autonomous robots, and one of the best ways to learn the sense → think → act loop that every robot runs.

- **Sense:** IR sensors under the front of the chassis shine infrared light at the floor. A dark line reflects less light than the floor around it, so each sensor can tell whether it is over the line.
- **Think:** the Arduino reads the sensors many times a second and decides which way the robot has drifted.
- **Act:** a motor driver turns that decision into different speeds for the left and right wheels, steering the robot back onto the line.

## What went into the build

- **Chassis:** a two-wheel drive acrylic base driven by DC motors
- **Electronics:** Arduino board, motor driver shield, IR sensor array and a battery pack
- **Circuit design:** wiring the sensors, motor driver and power so each part gets the signal and current it needs
- **Code:** Arduino code that reads the sensors and makes real-time steering decisions
- **Tuning and debugging:** adjusting the logic live on the track until the robot followed the line smoothly

## What participants took away

Building it live, from wiring to the final demo, showed how theory and hardware meet: a small change in sensor position, motor speed or code changes how the robot behaves on the track. It is the first step towards faster line followers, maze solvers and competition robots.',
  summary = 'An Arduino line follower with IR sensors and a motor driver, built from scratch and demoed live during Robotics Workshop-III.',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE slug = 'line-following-robot';
