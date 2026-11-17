/*
 * 6d. Remaining Landmarks, Zone Pads, Seeded Trees & World Orchestration
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, COLORS, WORLD, ZONES, RADIUS, UNIT, scene, linear,
    box, boxes, brick, stackBricks, groundDecal, addSolid, onPath,
    newGroup, addBrick, buildIsland, buildName, buildPiles, buildSkillsWall,
    buildSign, landmarks,
  } = BI;

  Object.assign(landmarks, {
    education(zone, group) {
      const { red, blue, ink, yellow } = COLORS;
      box([2.2, 0.5, 1.6], red, [0, 0.25, 0], group).rotation.y = 0.12;
      box([2, 0.5, 1.5], blue, [0, 0.75, 0], group).rotation.y = -0.1;
      box([2.1, 0.12, 2.1], ink, [0, 1.56, 0], group).rotation.y = 0.6;
      boxes(group, [[[1.2, 0.5, 1.2], ink, [0, 1.25, 0]], [[0.1, 0.7, 0.1], yellow, [0.9, 1.25, 0.6]]]);
      addSolid(...zone.at, 2.2, 1.6, 1);
      return 2.2;
    },
    contact(zone, group) {
      const { steel, blue, paper, red } = COLORS;
      boxes(group, [
        [[0.35, 1.7, 0.35], steel, [0, 0.85, 0]], [[1.1, 1.1, 1.8], blue, [0, 2.25, 0]],
        [[0.9, 0.5, 0.06], paper, [0, 2.25, 0.92]], [[0.1, 0.8, 0.1], red, [0.62, 2.7, 0.4]],
        [[0.1, 0.35, 0.5], red, [0.62, 3.0, 0.2]],
      ]);
      addSolid(...zone.at, 1.1, 1.8, 2.8);
      return 3;
    },
    skills: () => 5,
    job(zone, group) {
      const palette = ['red', 'yellow', 'blue', 'paper', 'green', 'yellow'];
      stackBricks(group, [2, 1, 2], Array.from({ length: zone.years }, (_, l) => palette[(l + zone.years) % palette.length]));
      addSolid(...zone.at, 2, 2, zone.years);
      return zone.years + 0.3;
    },
  });

  const pads = [];
  const buildZones = () => {
    ZONES.forEach((zone) => {
      const group = new T.Group();
      group.position.set(zone.at[0], 0, zone.at[1]);
      scene.add(group);
      const build = zone.years ? landmarks.job : landmarks[zone.id];
      buildSign(zone, build(zone, group), zone.id === 'skills' ? -1.6 : undefined);
      const color = linear(zone.color);
      const disc = groundDecal(new T.CircleGeometry(2, 40), color, 0.3, 0.03);
      const ring = groundDecal(new T.RingGeometry(1.85, 2.2, 48), color, 0.95, 0.05);
      [disc, ring].forEach((d) => { d.position.x = zone.pad[0]; d.position.z = zone.pad[1]; });
      pads.push(ring);
    });
  };

  const buildTrees = () => {
    let seed = 11;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const { spawn, pileSpots, nameRows, treeCount } = WORLD;
    const clearings = [[spawn.x, spawn.z, 5], ...ZONES.flatMap(({ at, pad }) => [[...at, 5.5], [...pad, 4]]), ...pileSpots.map((s) => [...s, 4])];
    const nameZ = nameRows.map((r) => r.z);
    const inNameArea = (x, z) => Math.abs(x) < 16 && z > Math.min(...nameZ) - 3 && z < Math.max(...nameZ) + 3;
    const isClear = (x, z) => !onPath(x, z) && !inNameArea(x, z) && clearings.every(([cx, cz, r]) => Math.hypot(x - cx, z - cz) >= r);

    const span = (WORLD.half - 4) * 2;
    for (let planted = 0, tries = 0; planted < treeCount && tries < 600; tries++) {
      const [x, z] = [Math.round(random() * span - span / 2), Math.round(random() * span - span / 2)];
      if (!isClear(x, z)) continue;
      const trunkHeight = 2 + Math.floor(random() * 2);
      const group = newGroup();
      for (let l = 0; l < trunkHeight; l++) addBrick(group, brick(UNIT, COLORS.bark), UNIT, [x, 0.5 + l, z]);
      [
        { size: [3, 1, 3], hex: COLORS.leafDark, options: { radius: RADIUS.canopyLarge, canopy: true } },
        { size: [2, 1, 2], hex: COLORS.green, options: { radius: RADIUS.canopySmall, canopy: true } },
        { size: UNIT, hex: COLORS.leafLight, options: {} },
      ].forEach(({ size, hex, options }, l) => addBrick(group, brick(size, hex), size, [x, trunkHeight + 0.5 + l, z], options));
      clearings.push([x, z, 5]);
      planted++;
    }
  };

  const buildWorld = () => { buildIsland(); buildName(); buildPiles(); buildSkillsWall(); buildZones(); buildTrees(); };
  Object.assign(BI, { pads, buildWorld });
})();
