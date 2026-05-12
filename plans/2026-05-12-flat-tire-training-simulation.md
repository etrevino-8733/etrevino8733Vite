# Flat Tire Training Simulation Feature Plan

## Status
Draft

## Context
This project is a personal website used as a portfolio. The goal is to use the existing Three.js world in `/pages/three-js-project` as the platform for a feature that will serve as a POC: a "How to change a flat tire" interactive training model. The training module will create a separate scene with basic geometric shapes representing the car, jack, tires, tire iron, and lugnuts, with full physics simulation and a guided step-by-step training workflow.

### Technical Decisions
- **Physics Engine**: Cannon-es (simple integration with Three.js)
- **Controls**: Pointer-lock FPS mode (mouse look + WASD movement)
- **Module Structure**: New dedicated module `utils/flatTireTraining.module.js`
- **Scene Handling**: Separate scene that replaces current scene when activated

### Key Findings from Codebase Analysis
- The existing Three.js scene is in `/utils/techStack.module.js` with a `MyWorld` class
- `InputController` is referenced but **not defined** anywhere in the codebase
- `BasicCharacterControllerInput` in `characters.module.js` handles WASD input but is separate from FPS controls
- The `FirstPersonCamera` class already expects pointer-lock style controls (partially commented out)
- No physics engine currently exists in the project
- Current scene loads a cyberpunk coffee shop GLTF model (needs separate handling for the training scene)
- The entry point is `/pages/three-js-project/three-js-project.js`

### Geometry Specs (per PROMPT.MD)
- **1 Car Jack**: BoxGeometry (2 x 2 x 6)
- **2 Tires**: TorusGeometry (radius 8, tube 4)
- **1 Car**: ExtrudeGeometry (shape to be defined)
- **1 Tire Iron**: TubeGeometry (path to be defined)
- **4 Lugnuts**: TorusGeometry (radius 1, tube 1)

## Steps

### Phase 1: Setup & Core Architecture
1. [ ] Install `cannon-es` npm package
2. [ ] Create `utils/flatTireTraining.module.js` with four main classes:
      - `TrainingScene` — sets up all objects, lighting, and ground plane
      - `PhysicsWorld` — wraps Cannon-es world, bodies, and stepping
      - `TrainingController` — state machine for the 7-step training scenario
      - `ObjectInteraction` — pick/drop/use mechanics via raycasting
3. [ ] Wire module activation through a trigger in `three-js-project.js` or `techStack.module.js` (e.g., key press or UI button)

### Phase 2: Scene & Objects
4. [ ] Implement basic shapes for all required objects per geometry specs above
5. [ ] Implement Cannon-es physics bodies (with gravity and collision) for all interactable objects
6. [ ] Implement hitbox system (invisible trigger zones) for placement detection of each object

### Phase 3: Controls & Interaction
7. [ ] Implement Pointer-lock FPS controls by completing the commented-out code in `SceneControls.centerCamera` — mouse look + WASD movement
8. [ ] Implement object picking up / dropping mechanics using physics constraints (Cannon-es)
9. [ ] Implement training scenario state machine with 7 steps, validating correct order

### Phase 4: Feedback & Polish
10. [ ] Add UI feedback layer (HTML overlay) for step validation — visual indicators for correct/incorrect actions
11. [ ] Add reset functionality that returns all objects to starting positions and resets the state machine

### Phase 5: Verification
12. [ ] Test with `npm run dev` and verify all functionality works correctly

## Verification
- All required objects are present in the scene as basic shapes with proper physics
- User can look around with pointer-locked mouse, walk with WASD, and interact with objects
- Physics engine (Cannon-es) enables objects to fall due to gravity and collide realistically
- Objects can be picked up, carried, and dropped with proper physics constraints
- Hitboxes detect proper placement of objects and trigger correct training steps
- Training scenario follows the correct sequence of steps with state validation
- Visual feedback indicates when steps are performed out of order (e.g., red outlines, UI messages)
- Training can be reset to initial state, returning all objects to starting positions
