# The School Chronicles — 3D Open-World School-Life Prototype

An original third-person 3D school-life exploration game built with React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Rapier physics, Zustand and Capacitor. The interface is a game HUD, not a conventional marketing website.

## Implemented phases

### Phase 1 — Foundation
- React + TypeScript + Vite project, responsive layout, settings and quality presets.
- Three.js / R3F rendering and Rapier physics foundation.
- Main menu, loading state and device-persisted settings.

### Phase 2 — Player and controls
- Procedural anime-inspired student placeholder model with walk/run limb animation.
- Third-person follow camera, mouse drag and mobile swipe camera orbit.
- WASD / arrow keys, Shift run, Space jump; mobile joystick, RUN and JUMP controls.
- Camera-relative movement and adjustable sensitivity.

### Phase 3 — Open campus
- Procedural academy, library, science/computer lab, cafeteria, clubs, residence, courtyard, fountain, sports area, parking, gardens, paths, trees, flower beds, lamps, fences and campus shop.
- Mobile-oriented quality settings and distance fog.

### Phase 4 — Interactions and interiors
- Proximity prompts and E/tap building interaction.
- Shared interior shell with distinct library shelves, science benches, cafeteria tables, club boards, residence beds and classroom desks.
- Doorway exit and Rapier floor/wall collision in interiors.

### Phase 5 — NPCs and dialogue
- Mika, Ren and Aoi with proximity talk prompts, dialogue choices and relationship values.
- Relationships are included in local saves.

### Phase 6 — School-life simulation
- In-game clock, weekdays and day progression; day/night lighting changes.
- Timetable with time-window attendance, school calendar and scheduled events.
- Clubs, class points, practice assessment record and attendance count.

### Phase 7 — Missions and progression
- Campus exploration, meet-a-classmate and club missions.
- Class points, reputation, relationship meter and one-time mission rewards.

### Phase 8 — Story and persistence
- Chapter-one objective HUD, local save/load, automatic save while playing and Continue menu when a save exists.
- Settings persisted locally. Escape opens save/pause panel.

### Phase 9 — Web and Android packaging
- Vite production build and Vercel-ready `dist` output.
- PWA manifest and service worker for app-shell/offline asset caching.
- Capacitor Android project generated and synced in `android/`.
- Android Studio / Gradle build still requires a local Java JDK and Android SDK.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
```

## Android

```bash
npm run build
npm run android:sync
npm run android:build
```

Open the `android/` folder in Android Studio to build on a machine with a supported JDK and Android SDK. The cloud sandbox used for this build did not have Java installed, so an APK has not been produced or device-tested here.

## Test coverage

`npm test` runs Node-based tests for clock rollover, duplicate attendance prevention, exam score retention, relationship/reputation caps, one-time mission rewards and local save validation/round-trip.

## Current prototype limitations

- Character and NPCs are original procedural placeholder geometry, not finished rigged anime models or motion-captured animation.
- Campus buildings and scenery are procedural meshes, not final hand-authored art assets. Several interior types have distinct furniture but still share a common room shell.
- NPC navigation/pathfinding, full branching story, advanced exam questions, audio/music, weather simulation, complete outdoor collision, accessibility settings and multiplayer are not implemented.
- The 3D runtime chunk remains large; the main app is code-split from the 3D renderer, but further asset and dependency optimization is needed for low-end Android devices.
- PWA offline caching is best-effort and requires one successful online load first. Local saves remain on the same browser/device and are not cloud-synced.
- Production deployment and physical Android QA must be completed after the Vercel deployment quota resets and a device/build environment is available.

## Project identity

App name: The School Chronicles  
Android application ID: `com.schoolchronicles.game`  
Web output: `dist/`
