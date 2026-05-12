# Session Memory — Flat Tire Training Simulation

## Date
2026-05-12

## Technical Decisions
- **Physics Engine**: Cannon-es (lightweight Three.js integration)
- **Controls**: Pointer-lock FPS mode (mouse look + WASD)
- **Module Structure**: New dedicated `utils/flatTireTraining.module.js`
- **Scene Handling**: Separate scene that replaces current scene when activated
- **File Access**: Agent cannot use write/edit tools in plan mode — implementation requires either switch to change mode or subagent delegation

## Key Codebase Findings
- `InputController` class is referenced at `utils/techStack.module.js:644` (`this.input_ = new InputController()`) but **not defined** anywhere in the codebase — needs to be implemented as part of the pointer-lock FPS controls
- `BasicCharacterControllerInput` in `characters.module.js` handles WASD keyboard input but is a separate system from the FPS camera
- `FirstPersonCamera` class already expects pointer-lock style controls with stubs partially commented out at `techStack.module.js:556-572`
- No physics engine currently exists in the project
- Entry point: `pages/three-js-project/three-js-project.js`
- Main Three.js logic: `utils/techStack.module.js` with `MyWorld`, `SceneControls`, `FirstPersonCamera` classes

## Plan Document
`/plans/2026-05-12-flat-tire-training-simulation.md`
