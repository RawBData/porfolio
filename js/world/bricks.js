/*
 * 6b. Knockable Bricks: Registry, Pixel-Font Name, Brick Piles & Skills Wall
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, CONTENT, COLORS, WORLD, STATE, RADIUS, BRICK_COLORS, PIXEL_FONT, FONTS,
    inkFor, zoneById, scene, brick, canvasTexture, fitText, facedBox, FRONT, BACK,
  } = BI;

  const bricks = [];
  const brickGroups = [];
  const stats = { knocked: 0 };
  const newGroup = () => brickGroups.push([]) - 1;

  const addBrick = (group, mesh, size, [x, y, z], options = {}) => {
    mesh.position.set(x, y, z);
    scene.add(mesh);
    const body = {
      mesh, size, group,
      radius: options.radius || RADIUS.unit,
      canopy: Boolean(options.canopy),
      state: STATE.HOME,
      velocity: new T.Vector3(),
      spin: new T.Vector3(),
      home: { position: mesh.position.clone(), quaternion: mesh.quaternion.clone() },
      restTime: 0, grace: 0, thrown: false, counted: false,
    };
    mesh.userData.body = body;
    bricks.push(body);
    brickGroups[group].push(body);
    return body;
  };

  const UNIT = [1, 1, 1];
  const addUnitBrick = (group, colorName, pos) => addBrick(group, brick(UNIT, COLORS[colorName]), UNIT, pos);
  const cycleColor = (index) => BRICK_COLORS[index % BRICK_COLORS.length];

  const buildName = () => {
    WORLD.nameRows.forEach(({ text, z }, rowIndex) => {
      const letters = [...text].map((ch) => PIXEL_FONT[ch]);
      const width = letters.reduce((sum, glyph) => sum + glyph[0].length + 1, -1);
      let x = -width / 2 + 0.5;
      letters.forEach((glyph, letterIndex) => {
        const group = newGroup();
        const colorName = cycleColor(rowIndex + letterIndex);
        glyph.forEach((row, r) => {
          [...row].forEach((px, c) => { if (px === '1') addUnitBrick(group, colorName, [x + c, 4.5 - r, z]); });
        });
        x += glyph[0].length + 1;
      });
    });
  };

  const buildPiles = () => {
    const pyramid = [[-1, 0], [0, 0], [1, 0], [-0.5, 1], [0.5, 1], [0, 2]];
    WORLD.pileSpots.forEach(([x, z], pileIndex) => {
      const group = newGroup();
      pyramid.forEach(([dx, dy], i) => addUnitBrick(group, BRICK_COLORS[(pileIndex + i) % 3], [x + dx, 0.5 + dy, z]));
    });
  };

  const buildSkillsWall = () => {
    const [wallX, wallZ] = zoneById('skills').at;
    const group = newGroup();
    const wallColors = ['red', 'blue', 'yellow', 'green', 'paper'];
    const size = [3, 1, 1];
    CONTENT.skillBricks.forEach((skill, index) => {
      const row = Math.floor(index / 4);
      const column = index % 4;
      const colorName = wallColors[(index + row) % wallColors.length];
      const hex = COLORS[colorName];
      const label = canvasTexture(384, 128, (ctx, w, h) => {
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = inkFor(colorName);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        fitText(ctx, skill, '600', 62, FONTS.display, w - 36);
        ctx.fillText(skill, w / 2, h / 2 + 4);
      });
      const mesh = brick(size, hex, facedBox(size, hex, label, [FRONT, BACK]));
      const stagger = row % 2 ? 0.75 : -0.75;
      addBrick(group, mesh, size, [wallX - 4.5 + column * 3 + stagger, 0.5 + row, wallZ], { radius: RADIUS.plank });
    });
  };

  Object.assign(BI, {
    bricks, brickGroups, stats, newGroup, addBrick, UNIT, addUnitBrick,
    buildName, buildPiles, buildSkillsWall,
  });
})();
