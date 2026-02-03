---
name: Refactor Plan Performance Structure Issues
overview: "A refactoring plan in four sections: (1) performance improvements, (2) project file organization and structure, (3) fixes for current implementation issues, and (4) documentation and cleanup. Each section is broken into concrete, ordered steps."
todos: []
isProject: false
---

# Refactor Plan: Performance, Structure, and Issues

This plan is based on a review of [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [README.md](README.md), and the codebase. It is organized by the type of issue each change addresses.

---

## 1. Performance

**Goals:** Reduce bundle size per page, avoid loading unused code, and trim dead code.


| Step | Action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1  | **Use direct imports per page instead of barrel for heavy modules.** [main.js](main.js) and [pages/about-me/about-me.js](pages/about-me/about-me.js) import from `"./utils"` or `"/utils"`, which re-exports everything from [utils/index.js](utils/index.js) (techStack, welcomeMessage, characters, TopNav, oilProjectGraphics). [pages/oil-project/oil-project.js](pages/oil-project/oil-project.js) only needs `oilProjectGraphics` and TopNav. Change oil-project to import directly from `../utils/oilProjectGraphics.module.js` and `../utils/TopNav/topNav.module.js` (and topNavStyle) so the oil-project entry bundle does not pull in techStack/characters. Similarly, main and about-me should not depend on oilProjectGraphics; the barrel currently re-exports all—either keep barrel but rely on tree-shaking, or remove oilProjectGraphics from barrel and have each page import only what it needs from specific module paths. Prefer explicit per-page imports for clarity and predictable chunks. |
| 1.2  | **Remove dead code in techStack bloom helpers.** In [utils/techStack.module.js](utils/techStack.module.js), `nonBloomed()` and `restoreMaterial()` (lines 103–114) reference global `materials` and `darkMaterial`, which do not exist at module scope (they would be `undefined`). These methods are never called; the animate loop uses inline logic with `this.params.materials` and `this.params.darkMaterial`. Remove `nonBloomed` and `restoreMaterial` to avoid confusion and reduce code surface.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.3  | **Optional: Cap `devicePixelRatio` for high-DPI.** In techStack and oilProjectGraphics, `setPixelRatio(window.devicePixelRatio)` can be expensive on very high-DPI devices. Consider capping (e.g. `Math.min(window.devicePixelRatio, 2)`) if frame rate is a concern; otherwise leave as-is.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |


---

## 2. Project organization and structure

**Goals:** Consistent paths, clear layout, no duplicate or unused assets.


| Step | Action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1  | **Unify import path style.** [main.js](main.js) uses relative paths (`"./utils"`, `"./utils/TopNav/..."`). [pages/about-me/about-me.js](pages/about-me/about-me.js) and [pages/oil-project/oil-project.js](pages/oil-project/oil-project.js) use absolute paths (`"/utils"`, `"/utils/TopNav/..."`). Prefer relative paths from each file (e.g. from `pages/about-me/about-me.js` use `"../utils"` and `"../utils/TopNav/topNav.module.js"`) so the project works regardless of Vite `base` and is consistent. |
| 2.2  | **Unify stylesheet references.** [index.html](index.html) uses `href="style.css"` (relative). [pages/about-me/about-me.html](pages/about-me/about-me.html) uses `href="/style.css"`. [pages/oil-project/oil-project.html](pages/oil-project/oil-project.html) uses `href="/style.css"` and `href="./oil-project.css"`. Use relative paths from each HTML file (e.g. `../style.css` from pages) so deployment with a non-root `base` does not break.                                                            |
| 2.3  | **Extract duplicate shader markup.** The same vertex and fragment shader `<script>` blocks appear in [main.js](main.js) (inline HTML string) and [pages/about-me/about-me.js](pages/about-me/about-me.js). Extract them to a small shared module (e.g. `utils/shaders.js` or `utils/techStackShaders.js`) that exports template literal strings, and have both main.js and about-me.js inject that string into the DOM. This removes duplication and keeps shaders in one place.                               |
| 2.4  | **Remove unused asset.** [javascript.svg](javascript.svg) at project root is not referenced anywhere (all HTML uses `href="/vite.svg"`). Delete it or move to a docs/assets folder if kept for reference.                                                                                                                                                                                                                                                                                                      |
| 2.5  | **Optional: Consistent casing for TopNav.** The folder is `TopNav` (PascalCase) and files are `topNav.module.js` / `topNavStyle.module.js` (camelCase). Either rename folder to `top-nav` or `topnav` for consistency with other utils, or document the convention. Low priority; only change if you want strict consistency.                                                                                                                                                                                  |


---

## 3. Implementation issues

**Goals:** Fix bugs, typos, and API misuse documented in ARCHITECTURE and found in code.


| Step | Action                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1  | **Fix techStack bloom: remove dead helpers (see 1.2).** Already covered in Performance.                                                                                                                                                                                                                                                                                                                                             |
| 3.2  | **Rename `paramaters` to `parameters` (or `TechStackParams`).** In [utils/techStack.module.js](utils/techStack.module.js), the class `paramaters` (line 20) is a typo. Rename to `parameters` (or `TechStackParams`) and update all references in the same file (`this.params = new parameters()`, etc.). Update [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and README if they reference the class name.                          |
| 3.3  | **Fix other typos in techStack.module.js.** `DEFALUT_CAM_POS` → `DEFAULT_CAM_POS` (line 28). In `MyWorld`, rename parameter and property `prams` → `params` (lines 248–253 and all usages: `this.prams`, `prams.scene`, etc.).                                                                                                                                                                                                      |
| 3.4  | **Fix Three.js API in techStack.** `THREE.CineionToneMapping` (line 84) is incorrect; the constant is `THREE.CineonToneMapping` (one “i”). Replace so tone mapping is applied. If using a newer Three.js where `outputEncoding` / `sRGBEncoding` are deprecated, switch to `renderer.outputColorSpace = THREE.SRGBColorSpace` (or equivalent for your version).                                                                     |
| 3.5  | **about-me.js: fix transition duration and remove debug.** In [pages/about-me/about-me.js](pages/about-me/about-me.js), `moveItems()` uses `Math.floor(Math.random() * (1 - 1.5) + 1.5)`, which evaluates to `1` (so no randomness). Fix to the intended range (e.g. 1–1.5 seconds): `1 + Math.random() * 0.5`. Remove or guard `console.log('hover')` on the danger button and any other debug logs you do not want in production. |
| 3.6  | **Optional: Fix copy typos in about-me.js.** In the inline HTML strings: “devoloper” → “developer”, “detaild” → “detailed”, “scaned” → “scanned”, “software software” → “software”. Only if you want copy edits as part of this refactor.                                                                                                                                                                                           |


---

## 4. Documentation and post-refactor

**Goals:** Keep ARCHITECTURE and README accurate and mention only one way to do things.


| Step | Action                                                                                                                                                                                                                                                                                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1  | **Update ARCHITECTURE.md.** After renames and removal of bloom helpers: replace all mentions of `paramaters` with the new name; remove or update the “Known Code Issues” bullet about `nonBloomed`/`restoreMaterial` and globals; update “Recommended Follow-ups” so they no longer list completed items. |
| 4.2  | **Update README project structure (if you change layout).** If you add a shaders module or remove javascript.svg, update the Project Structure section and Key Files table so new developers see the current layout.                                                                                      |


---

## Suggested order of execution

- **Phase A (bugs and cleanup):** 3.2 → 3.3 → 3.4 → 1.2 (then 3.1 done) → 3.5  
- **Phase B (structure):** 2.1 → 2.2 → 2.3 → 2.4  
- **Phase C (performance):** 1.1 (direct imports / barrel trim) → 1.3 if needed  
- **Phase D (docs):** 4.1 → 4.2

Doing Phase A first reduces risk of carrying typos and dead code into structural changes. Phase B can be done in parallel with C if you prefer. Keep the plan in a single doc and tick off steps as you go.