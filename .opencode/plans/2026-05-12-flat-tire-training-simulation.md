# Flat Tire Training Simulation Feature Plan

## Status
Approved

## Context
This project is a personal website used as a portfolio. The goal is to use the existing three.js world in /pages/three-js-project as the platform for a feature that will serve as a POC: a "How to change a flat tire" interactive training model.

## Technical Decisions
- **Physics Engine**: Cannon-es (simple integration with Three.js)
- **Controls**: Pointer-lock FPS mode (mouse look + WASD movement)
- **Module Structure**: New dedicated module `utils/flatTireTraining.module.js`
- **Scene Handling**: Separate scene that replaces current scene when activated

## Steps
1. [ ] Analyze existing Three.js project structure and identify modification points
2. [ ] Install and configure Cannon-es physics engine
3. [ ] Implement basic shapes for all required objects (car jack, tires, car, tire iron, lugnuts) with physics bodies
4. [ ] Implement Pointer-lock FPS controls (mouse look, WASD movement)
5. [ ] Implement object picking up/dropping mechanics with physics constraints
6. [ ] Implement hit boxes for placement areas (visual guides + collision detection)
7. [ ] Implement training scenario step-by-step logic with state tracking
8. [ ] Add visual user feedback for out-of-order steps (UI indicators)
9. [ ] Implement training reset functionality (reload training scene)
10. [ ] Create new dedicated module `utils/flatTireTraining.module.js`
11. [ ] Integrate training module with existing techStack framework
12. [ ] Test and verify all functionality works correctly

## Verification
- All required objects are present in the scene as basic shapes with proper physics
- User can look around with pointer-locked mouse, walk with WASD, and interact with objects
- Physics engine (Cannon-es) enables objects to fall due to gravity and collide realistically
- Objects can be picked up, carried, and dropped with proper physics constraints
- Hit boxes detect proper placement of objects and trigger correct training steps
- Training scenario follows the correct sequence of steps with state validation
- Visual feedback indicates when steps are performed out of order (e.g., red outlines)
- Training can be reset to initial state, returning all objects to starting positions