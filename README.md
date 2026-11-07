# The School Chronicles — 3D Foundation

A mobile-aware third-person school-life simulation foundation built with React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Rapier and Zustand-ready architecture.

## Phase 1
- Procedural 3D academy courtyard preview (original placeholder geometry)
- Cinematic main menu and loading transition
- Settings panel with local-device persistence
- Responsive desktop/mobile layout and quality preset
- Physics engine mounted for future collision work

## Run
`npm install && npm run dev`

## Build
`npm run build`

## Roadmap
Phase 2 adds the original anime-style player model, third-person movement, camera input and mobile controls. The current Phase 1 scene is a world preview and intentionally has no player movement yet.

## Phase 2 — Player controller
- Procedural original anime-inspired student model and academy uniform
- Third-person follow camera with mouse/touch drag orbit and sensitivity setting
- WASD / arrow-key movement, Shift to run, Space to jump
- Mobile virtual joystick, run and jump touch buttons
- Rapier rigid-body capsule and academy/ground collision foundations
- Walk/run limb animation

Note: this is an early playable controller prototype. Character art is procedural placeholder geometry; production character modeling, facial animation, detailed animation clips, camera collision and complete environment collision are later polish tasks.


## Phase 4 — Interactive World Prototype
- Proximity-based building interaction prompts.
- Press E or tap the on-screen interaction prompt to enter the Main Academy.
- Interior room scene with walls, floor, furniture placeholders and an exit prompt.
- Press E or tap the prompt near the exit to return to campus.
- Touch joystick and camera controls remain available on mobile.

Current limitations: the current phase uses a shared interior layout as a placeholder for multiple building types. Full building-specific interiors, door animations, complete campus collision coverage, object interaction logic and device-level QA remain future work.

## Phase 5 — NPC & Dialogue Prototype
- Three named campus NPCs: Mika (class representative), Ren (science club member), and Aoi (library assistant).
- Stylised student NPC models with subtle idle motion and name/role labels.
- Proximity-based talk prompt and E/tap interaction.
- Dialogue panel with three response choices and prototype relationship points (0–100).
- Relationship values currently live in app state and reset on reload; persistent relationship saves, branching story flags, NPC navigation/pathfinding, advanced animation rigs and AI dialogue are not implemented yet.
