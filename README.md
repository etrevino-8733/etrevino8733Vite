# ET DEV

Personal developer portfolio with 3D and data visualization.

---

## Technologies Used

- **Build / runtime**: Vite 5, npm, ES modules
- **3D / graphics**: Three.js (WebGL, OrbitControls, GLTF/FBX loaders, FontLoader, TextGeometry, EffectComposer, UnrealBloomPass, ShaderPass)
- **Animation / UX**: GSAP
- **Charts**: Chart.js (oil project)
- **Front-end**: Vanilla JavaScript, CSS (custom properties, responsive layout), Web Components (Custom Elements, Shadow DOM)
- **Assets**: GLB, GLTF, FBX, TTF/JSON fonts; static JSON data for the oil project

---

## Architecture

- **Multi-page static site** (no SPA router)
- Each route has its own entry HTML and page JS; shared logic lives in `utils/` with a barrel export from `utils/index.js`
- Main 3D experience on **Home** and **About Me** is powered by the techStack module; the **Oil Project** page uses a separate Three.js + Chart.js scene

For a full breakdown of entry points, modules, data flow, and design patterns, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Design Patterns

- **ES modules and barrel exports** – Shared code is imported via `utils/index.js`
- **Class-based 3D and character logic** – techStack, MyWorld, SceneControls, BasicCharacterController, oilProjectGraphics
- **Finite State Machine (FSM)** – Character animations (Idle, Walk, Run, Dance) in `utils/characters.module.js`
- **Custom element for top nav** – `<et-top-nav>` with Shadow DOM and `nav-items` attribute
- **Loading manager** – Progress UI and post-load sequencing (e.g. centerCamera, flickerStack)

---

## Project Structure

```
index.html, main.js, style.css     # Global entry and styles
pages/
  about-me/                        # About Me page (HTML, JS)
  oil-project/                     # Oil project page (HTML, JS, CSS)
utils/
  index.js                         # Barrel export
  techStack.module.js              # Main 3D scene (home / about-me)
  characters.module.js             # Character controller and FSM
  welcomeMessage.module.js         # Loading welcome messages
  oilProjectGraphics.module.js     # Oil project 3D + Chart.js
  TopNav/                          # Top nav custom element
  scenes/                          # 3D and image assets
public/                            # Fonts (JSON), static data, static assets
docs/
  ARCHITECTURE.md                  # Detailed architecture documentation
```

---

## Scripts and Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

Chrome is recommended for the best experience (welcome message and 3D behavior are tuned for it).

---

## Live / Deployment

- **Live**: [etrevino8733vite.pages.dev](https://etrevino8733vite.pages.dev/)

---

## Key Files

| Purpose | File |
|--------|------|
| Home entry | `main.js` |
| Main 3D scene (home / about-me) | `utils/techStack.module.js` |
| Character and FSM | `utils/characters.module.js` |
| Top navigation component | `utils/TopNav/topNav.module.js` |
| Oil project 3D + chart | `utils/oilProjectGraphics.module.js` |
