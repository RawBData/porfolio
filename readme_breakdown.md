# Brick Island

A small 3D toy-brick island to host my portfolio. Visitors run around, knock things over, and find my projects, experience and contact details along the way.

[Brick Island Live](https://rawbdata.github.io/porfolio/ "Brick Island")

<!-- ![Splash](./readme_files/main.gif) -->

---

## Background and Overview

---

Brick Island is a single page site built with vanilla JavaScript and three.js. There is no framework and no build step: the browser loads a set of small, single-purpose files with plain `<script>` tags, plus one library from a CDN.

- Playful: Everything made of loose bricks can be knocked down, picked up and thrown, including my name and the trees.

- Useful: Eleven places on the map each open a card with a project, a job, my skills, my education or my contact details.

- Accessible: A résumé view shows the same content as plain text, and it becomes the whole site when WebGL is not available.

- Editable: All of the résumé content lives in one data file, separate from the game code.

Brick Island is a single page app to showcase a working understanding of JavaScript, 3D rendering, simple physics, modular code organisation, and responsive HTML and CSS.

---

## Functionality

---

- Résumé content is data, and the map is generated from it

  Projects and jobs are plain objects in `content.js`. `js/ui/templates.js` maps them into zones, so adding a project to the data file adds a place to the island.

  `js/ui/templates.js`

  ```javascript
  const ZONES = [
    { id: 'about', kind: 'About', title: "Hi, I'm Ben", sub: 'Start here', color: 'yellow', html: cardHTML.about() },
    ...CONTENT.projects.map((p) => ({
      id: p.id, kind: 'Project', title: p.name, sub: p.sub, color: p.color, html: cardHTML.project(p),
    })),
    ...CONTENT.jobs.map((j) => ({
      id: j.id, kind: `Experience · ${j.when}`, title: j.name, sub: j.sub, color: j.color, html: cardHTML.job(j), years: j.years,
    })),
  ```

  Each job's landmark is a stack with one brick per year in the role, read straight from the data:

  `js/world/scenery.js`

  ```javascript
  job(zone, group) {
    const palette = ['red', 'yellow', 'blue', 'paper', 'green', 'yellow'];
    stackBricks(group, [2, 1, 2], Array.from({ length: zone.years }, (_, l) => palette[(l + zone.years) % palette.length]));
    addSolid(...zone.at, 2, 2, zone.years);
    return zone.years + 0.3;
  },
  ```

- My name is built from bricks using a pixel font

  Each letter is five rows of ones and zeros. Every `1` becomes a brick, and each letter is its own group so it collapses as a unit.

  `js/config.js`

  ```javascript
  const PIXEL_FONT = {
    B: ['110', '101', '110', '101', '110'],
    E: ['111', '100', '110', '100', '111'],
    N: ['1001', '1101', '1011', '1001', '1001'],
  ```

  `js/world/bricks.js`

  ```javascript
  glyph.forEach((row, r) => {
    [...row].forEach((px, c) => { if (px === '1') addUnitBrick(group, colorName, [x + c, 4.5 - r, z]); });
  });
  ```

- The baseplate draws 3,600 studs in a single draw call

  A separate mesh per stud would be thousands of draw calls. An `InstancedMesh` sends one geometry to the GPU with a position and colour per copy.

  `js/world/island.js`

  ```javascript
  const studs = new T.InstancedMesh(studGeometry, new T.MeshStandardMaterial({ roughness: ROUGHNESS }), size * size);
  const matrix = new T.Matrix4();
  for (let i = 0, idx = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const [x, z] = [cellCenter(i), cellCenter(j)];
      matrix.makeTranslation(x, WORLD.studHeight / 2, z);
      studs.setMatrixAt(idx, matrix);
      studs.setColorAt(idx++, linear(onPath(x, z) ? COLORS.path : COLORS.grassB));
    }
  }
  ```

- Bricks can be knocked over, with physics that only runs when needed

  Every brick has a state. Only `AWAKE` bricks are simulated, so an island where nothing is moving costs almost nothing per frame.

  `js/config.js`

  ```javascript
  const STATE = Object.freeze({ HOME: 0, AWAKE: 1, SETTLED: 2, LOST: 3, HELD: 4 });
  ```

  The first touch wakes the brick's whole group, which is what makes a letter or a tree fall apart together:

  `js/sim/actions.js`

  ```javascript
  brickGroups[body.group].forEach((member) => {
    if (member.state !== STATE.HOME) return;
    member.state = STATE.AWAKE; member.restTime = 0;
    member.velocity.set(jitter(1.6), Math.random() * 1.5, jitter(1.6));
    member.spin.set(jitter(3), jitter(3), jitter(3));
  ```

- A tumbling brick comes to rest flat on whichever face is down

  The resting height is worked out from the brick's current rotation, so a 3x1 brick can land on its long side or stand on its end.

  `js/sim/physics.js`

  ```javascript
  const halfHeight = (body) => {
    const e = scratch.matrix.makeRotationFromQuaternion(body.mesh.quaternion).elements;
    const [sx, sy, sz] = body.size;
    return (Math.abs(e[1]) * sx + Math.abs(e[5]) * sy + Math.abs(e[9]) * sz) / 2;
  };
  ```

- The character can pick up the nearest brick and throw it at a clicked spot

  For a throw at a target, the code picks a flight time from the distance and then solves the projectile equation for the launch velocity that lands there.

  `js/sim/actions.js`

  ```javascript
  const [dx, dz] = [target.x - from.x, target.z - from.z];
  const distance = Math.hypot(dx, dz) || 0.001;
  const flight = clamp(distance / HERO.throwSpeed, 0.45, 1.4);
  const rise = (target.y - from.y + 0.5 * PHYSICS.gravity * flight * flight) / flight;
  body.velocity.set(dx / flight, rise, dz / flight);
  ```

- Clicking works out what was clicked with a raycast

  A ray is cast from the camera through the pointer. If it hits a brick, that brick is the target. Otherwise the ray is intersected with the ground plane by hand.

  `js/input/pointer.js`

  ```javascript
  const [hit] = raycaster.intersectObjects(candidates, true);
  if (hit) return { body: bodyOf(hit.object), point: hit.point.clone() };

  const { origin, direction } = raycaster.ray;
  if (direction.y > -1e-4) return null;
  const distance = -origin.y / direction.y;
  ```

- Keyboard, touch joystick and click-to-walk all feed one movement system

  Keys are declared in two lookup tables instead of a chain of `if` statements, so adding a control is a one-line change.

  `js/input/controls.js`

  ```javascript
  const KEY_ACTIONS = {
    ' ': () => { hero.wantsJump = true; },
    Enter: toggleCard, e: toggleCard, r: rebuild, f: grabOrThrow,
  };
  ```

  ```javascript
  const readMoveInput = () => {
    let [x, z] = [joystick.x, joystick.y];
    Object.entries(KEY_DIRECTIONS).forEach(([key, [dx, dz]]) => { if (keys[key]) { x += dx; z += dz; } });
    const length = Math.hypot(x, z);
    return length > 1 ? [x / length, z / length] : [x, z];
  };
  ```

### Bonus Features

- The site still works with no WebGL: the résumé view takes over

  `js/ui/hud.js` checks once and opens the résumé view:

  ```javascript
  if (!hasWebGL) {
    ['who', 'tools', 'score', 'resumeClose'].forEach((id) => { $(id).hidden = true; });
    setResume(true);
  }
  ```

  Every 3D file then stops at its first line:

  ```javascript
  const BI = window.BI;
  if (!BI.hasWebGL) return;
  ```

- The tree layout is random but never changes, because it uses a seeded generator

  `js/world/scenery.js`

  ```javascript
  let seed = 11;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  ```

- A "Found 3 of 11" counter and a "Bricks knocked" counter give visitors a reason to keep exploring
- Falling off the edge drops the character into the sea and back to the start

---

## Technologies & Challenges

---

### Architecture

Brick Island is built with HTML, CSS, JavaScript (ES6+) and three.js r128.

Each JavaScript file is wrapped in its own function so nothing leaks into the global scope. The files share work through one namespace object, `window.BI` (short for Brick Island). Each file adds what it builds and later files take out what they need, which gives the benefits of modules with no build step.

`js/config.js` creates the namespace:

```javascript
const BI = (window.BI = window.BI || {});
BI.CONTENT = window.PORTFOLIO;
BI.T = window.THREE;
```

`js/sim/collisions.js` takes what it needs from earlier files and adds its own result:

```javascript
const { HERO, STATE, bricks, hero, wake, scratch, integrateBrick } = BI;
```

```javascript
Object.assign(BI, { stepBricks });
```

| Folder or file | What it holds |
| --- | --- |
| `index.html` | Page structure: the canvas, the heads-up display, the detail card, the résumé view, and the script load order |
| `content.js` | Résumé content only: summary, projects, jobs, skills, education, links |
| `js/config.js` | Every tunable setting, the colour palette, the map layout, and small shared helpers |
| `js/ui/` | HTML templates for the cards and résumé view, and the on-screen interface |
| `js/three/` | The renderer, scene, camera and lights, and the reusable 3D building blocks |
| `js/world/` | The island, the knockable bricks, the landmarks and signs, the trees, and the character |
| `js/input/` | Keyboard, touch joystick and click-to-walk |
| `js/sim/` | Hero movement, brick physics, collisions, and the grab and throw actions |
| `script.js` | The entry point: builds the world, moves the camera, and runs the frame loop |
| `styles.css` | Imports `css/base.css`, `css/hud.css` and `css/views.css` |

#### Keeping the code DRY

- Every tunable number sits in a named config object in `js/config.js`, so nothing is a magic number further down.

  ```javascript
  const HERO = {
    speed: 9.5, jump: 10, radius: 0.55, stepUp: 0.4,
    grabReach: 2.3, clickReach: 1.9, carryHeight: 3.35,
    throwSpeed: 15, throwLift: 7.5,
  };
  ```

- Geometry and materials are cached in `js/three/scene.js`, so hundreds of bricks share a handful of each.

  ```javascript
  const material = (hex) =>
    materialCache[hex] ||
    (materialCache[hex] = new T.MeshStandardMaterial({ color: linear(hex), roughness: ROUGHNESS, metalness: 0.02 }));
  ```

- The cards and the résumé view are rendered from the same small template helpers in `js/ui/templates.js`.

  ```javascript
  const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  const tagRow = (items) => `<div class="tags">${items.map((item) => `<span>${item}</span>`).join('')}</div>`;
  ```

- Colours, spacing and borders are CSS custom properties in `css/base.css`, declared once and reused.

  ```css
  --edge: 16px;
  --outline: 3px solid var(--ink);
  --press: 5px;
  ```

### Challenges

The most challenging aspects of this project are:

- Physics without a physics engine: bricks are treated as spheres for contact and as boxes for resting, which is cheap and looks right
- Keeping the frame rate steady with a few hundred bricks, by instancing the studs and sleeping bricks that have stopped moving
- One set of controls for keyboard, mouse and touch, including telling a tap from a joystick drag
- Splitting one large script into small files that load in the right order without a bundler
- Making sure a recruiter in a hurry can skip the game and still read everything

---

## UI/UX

---

The goal is a portfolio that is fun in the first ten seconds and still does its job as a résumé.

- **Explore**: Walking onto a glowing pad opens that place's card. On a wide screen the card opens by itself; on a phone a button and a bouncing "Details" hint appear instead, so the card never covers the controls unasked.

- **Play**: WASD or arrow keys to run, Space to jump, F to grab and throw, click or tap to walk somewhere, and R to rebuild everything.

- **Read**: The **Résumé view** button shows all of the content as a normal page for anyone who would rather not play.

<!-- ![Explore](./readme_files/explore.gif) -->

---

## Overall Project Experience

---

This project replaced my older template-based portfolio. The interesting part was getting believable brick physics and a responsive character out of a few hundred lines of plain JavaScript, and then making sure the playful side never got in the way of someone who just wants to see my work.

---

## Creator

---

**Benjamin Rawner**
