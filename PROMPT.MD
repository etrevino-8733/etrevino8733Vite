# Change A Flat Tire Training Simulation Feature

### Purpose
This project is a personal website used as a portfolio.  I want to use the three.js world in /pages/three-js-project as the platform for a feature that will serve as a POC. The POC is a "How to change a flat tire" interactive training model.

### Functional Requirements
- Use basic shapes for now
- User Controlls
  - Look arround (Mouse)
  - Grab Object (left click)
  - Use Object (E)
  - Release Object (right Click)
  - Walk around (wasd)
- Mechanics
  - User must line up the interactive object to the center of the screen inorder to interact with the object (right click, left click, E)
  - User can walk with objects
- Physics engine
  - Gravity is enabled
  - Hit boxes are created
### Feature Requirments
- User can walk around the world within boundaries
- Scene must have the following items as basic shapes
  - 1 car jack (box Geometry - width: 2; height: 2; depth: 6; all segments will be 1)
  - 2 Tires (Torus Geometry - Radius: 8; tube: 4; radialSegments: 13; tubularSegments: 33; arc: 6.28)
  - 1 Car (Extrude Geometry - steps: 10; depth: 20; bevelThickness: 5; bevelSize: 3; bevelOffset: -4; bevelSegments: 1;)
  - 1 Tire Iron (Tube Geometry - segments: 20; radius: 2; radialSegments: 8;)
  - 4 Lugnuts (Torus Geometry - Radius: 1; tube: 1; radialSegments: 7; arc 6.28)
- User can pick up and drop the following objects
  - Car jack
  - Lug nuts
  - Spare Tire
  - Flat Tire
  - Tire Iron
- These objects must have physics implemented
  - Car jack
  - Lug nuts
  - Spare Tire
  - Flat Tire 
  - Tire Iron
- Hit boxes for the following, Note that for each item with multiple hitboxes there will be a hit box for the actual item and one for where the item should be placed
  - 2 for the car jack
  - 1 for the car
  - 1 for the tire iron
  - 8 for the lugnuts
  - 2 for the flat tire
  - 1 for the spare tire
- User can reset training
- Visual user feedback when a step is out of order

### Training Senario
As the users, I will need to replace a flat tire with the spare tire.  

- The scene will contain a Car directly infront of the users starting position so that it looks like the user is standing outside the driver side of the car. The car should have the a flat tire attached to front driver side. 4 lugnuts will be at the center of the flat tire forming a sqare and evenly spaced. The car jack will be to the right of the user. The a tire iron will be directly infront of the users inbetween the car and the user. The spare tire will be to the left of the users. 
- We will need to include hit boxes for the following areas so that the user can know where to place objects and so that the system knows when an object is placed there to perform an action.
  - 1 the size of our car jack placed at the center of the driver side of the car
  - 1 for each lugnut that is the size of the lugnut and positioned at starting point of the lugnut
  - 1 the size of the flat tire that is positioned at the starting point of the flat tire
- The user will need to follow these steps in the specified oreder to complete the task.
  - Grab car jack, drop it on the car jack hit box, while focused on the jack, press intract 5 times
  - Grab tire iron, line up the tire iron to a lugnut hit box, interact 5 times while focused on the lugnut (this must be done for each lugnut). Lug nut will fall to the ground after 5 interactions
  - Drop tire iron
  - Grab Spare Tire
  - Line up the spare tire to the empty tire hitbox and release, this tire should stay in place.
  - for each lugnut, grab the lugnet and release it on an empty lugnut hitbox, the lugnut should stay in place.
  - grab the tire iron
  - for each lugnut hitbox, line up the tire iron, intract 5 times.
  

