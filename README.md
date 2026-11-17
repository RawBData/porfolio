# Ben Rawner's Portfolio

_Web developer and project manager in the San Francisco Bay Area._

[Portfolio Live](https://rawbdata.github.io/porfolio/ "Brick Island")

My portfolio is **Brick Island**: a small 3D toy-brick world you run around in. Projects, jobs, skills, education and contact details are landmarks on the map. Walk onto a glowing pad to read about each one, or knock everything over along the way. Everything except the ground and the signs is built from loose blocks, so every landmark can be knocked over, picked up and thrown. Hop on the bike at the SFRider landmark to ride around the island twice as fast, and you can still grab and throw bricks while you ride. Take it up the red ramp at the top of the map to launch into the air.

Prefer to just read? The **Résumé view** button shows the same content as a plain page.

<!-- ![Splash](./readme_files/main.gif) -->

---

## Controls

---

| Action | Keyboard and mouse | Phone or tablet |
| --- | --- | --- |
| Run | WASD or arrow keys | Drag anywhere |
| Walk to a spot | Click the ground | Tap the ground |
| Jump | Space | Jump button |
| Grab the nearest brick, then throw it | F | Grab button |
| Grab a particular brick | Click it | Tap it |
| Throw at a spot | Click while holding a brick | Tap while holding a brick |
| Open or close a card | Enter | Tap the place name or "Details" |
| Ride the bike (much faster) | Click the bike, or B to walk to it and get on (any other key cancels) | Tap the bike |
| Get off the bike | Exit bike button, or B | Exit bike button |
| Grab or throw a brick while riding | F, or click a brick | Grab button, or tap a brick |
| Rebuild everything | R | Rebuild bricks button |

---

## The Bike

---

The bike parked at the **SFRider** landmark is rideable.

- **Get on:** click the bike, or press **B** from anywhere on the island. Your character walks over and climbs on. Change your mind on the way? Press any other key, or click somewhere else, to stop.
- **Ride:** steer as usual. The bike goes about twice running speed, its wheels spin and the rider pedals.
- **Bricks:** you can still grab, carry and throw bricks while riding. Ride into a landmark to knock it flying.
- **Ramp:** ride up the red ramp at the top of the map and you launch off the end, about 17 units through the air.
- **Get off:** the **Exit bike** button (top right) or **B**. The bike stays parked where you left it, and **Rebuild bricks** returns it to its stand.

The code is in `js/sim/bike.js`. The ramp's shape and height are in `js/world/island.js`, and its position is set in `js/config.js` under `WORLD.ramp`.

---

## Built With

---

- JavaScript (ES6+), no framework and no build step
- [three.js](https://threejs.org/) r128 for 3D rendering
- HTML5 and CSS3 with custom properties
- Hosted on GitHub Pages

---

## Project Structure

---

```text
index.html        page structure and script load order
content.js        all résumé content, separate from the game code
styles.css        imports the three files in css/
css/              base, heads-up display, and card and résumé views
js/config.js      settings, colour palette, map layout, shared helpers
js/ui/            card and résumé templates, on-screen interface
js/three/         renderer, scene, lights, reusable 3D building blocks
js/world/         island, bricks, landmarks, trees, character
js/input/         keyboard, touch joystick, click-to-walk
js/sim/           movement, brick physics, collisions, grab and throw, rideable bike
script.js         entry point and frame loop
```

To update the résumé, edit `content.js`. Each project or job added there gets its own landmark on the island.

To run it locally, open `index.html` in a browser. It needs an internet connection for three.js and the fonts.

---

## How It Works

---

A full walkthrough of the code, with examples from each part of the project, is in **[readme_breakdown.md](./readme_breakdown.md)**.

---

## Other Projects

---

- [SFRider](https://github.com/RawBData/SFRider): San Francisco bicycle data on interactive maps (React)
- [Checkoff](https://github.com/RawBData/Checkoff): a full-stack to-do app inspired by Remember the Milk (Rails, React, Redux)

---

## Creator

---

**Benjamin Rawner**

[LinkedIn](https://www.linkedin.com/in/benjaminrawner/) · [GitHub](https://github.com/RawBData)
