/*
 * 6c. Zone Signs & 3D Landmark Builders
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, COLORS, FONTS, HALF_PI, UNIT, scene, material, shadowed,
    box, boxes, brick, stackBricks, canvasTexture, texturedMaterial, fitText, addSolid,
  } = BI;

  const spinners = [];

  const buildSign = (zone, height, offsetZ = -1.9) => {
    const post = [0.22, height + 1, 0.22];
    const sign = new T.Group();
    sign.position.set(zone.at[0], 0, zone.at[1] + offsetZ);
    scene.add(sign);
    [-2.7, 2.7].forEach((x) => box(post, COLORS.steel, [x, post[1] / 2, 0], sign));

    const board = new T.Group();
    board.position.y = height + 1.75; board.rotation.x = -0.38;
    sign.add(board);
    box([6.6, 2.2, 0.22], COLORS.ink, [0, 0, 0], board);

    const label = canvasTexture(640, 200, (ctx, w, h) => {
      ctx.fillStyle = COLORS.paper; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = zone.color; ctx.fillRect(0, 0, 26, h);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = COLORS.ink; fitText(ctx, zone.title, '700', 78, FONTS.display, w - 80); ctx.fillText(zone.title, 52, 100);
      ctx.fillStyle = COLORS.muted; fitText(ctx, zone.sub, '400', 40, FONTS.body, w - 80); ctx.fillText(zone.sub, 52, 160);
    });
    const face = new T.Mesh(new T.PlaneGeometry(6.3, 1.95), texturedMaterial(label, 0.6));
    face.position.z = 0.12; board.add(face);
  };

  const landmarks = {
    about(zone, group) {
      stackBricks(group, [2, 1, 2], ['yellow']);
      const cap = brick(UNIT, COLORS.red); cap.position.y = 1.5; group.add(cap);
      addSolid(...zone.at, 2, 2, 1);
      return 2.2;
    },
    sfrider(zone, group) {
      const { blue, ink, steel, paper } = COLORS;
      const wheelY = 1.23;
      // The bike lives in its own group so it can be ridden away from its stand.
      const bike = new T.Group();
      bike.position.set(zone.at[0], 0, zone.at[1]);
      scene.add(bike);
      const tyre = new T.TorusGeometry(0.8, 0.13, 10, 28);
      const wheels = [-1.15, 1.15].map((x) => {
        const wheel = new T.Group();
        wheel.position.set(x, wheelY, 0);
        bike.add(wheel);
        const rim = new T.Mesh(tyre, material(ink)); rim.castShadow = true; wheel.add(rim);
        [0, HALF_PI].forEach((angle) => { box([1.5, 0.07, 0.07], paper, [0, 0, 0], wheel).rotation.z = angle; });
        return wheel;
      });
      const tube = ([x1, y1], [x2, y2]) => {
        box([0.14, Math.hypot(x2 - x1, y2 - y1), 0.14], blue, [(x1 + x2) / 2, (y1 + y2) / 2, 0], bike).rotation.z = -Math.atan2(x2 - x1, y2 - y1);
      };
      const [rH, fH, cr, st, hd] = [[-1.15, wheelY], [1.15, wheelY], [0.05, wheelY], [-0.35, 2.25], [0.85, 2.3]];
      [[rH, st], [rH, cr], [st, cr], [st, hd], [cr, hd], [fH, [0.8, 2.65]]].forEach(([a, b]) => tube(a, b));
      boxes(group, [[[4.4, 0.3, 1.6], steel, [0, 0.15, 0]]]);
      boxes(bike, [[[0.6, 0.14, 0.3], ink, [-0.4, 2.42, 0]], [[0.14, 0.14, 1], ink, [0.8, 2.7, 0]]]);
      addSolid(...zone.at, 4.4, 1.6, 0.3);
      BI.bikeRig = { group: bike, wheels, home: { x: zone.at[0], z: zone.at[1] } };
      return 2.7;
    },
    wordstar(zone, group) {
      stackBricks(group, [2, 1, 2], ['red', 'blue']);
      const outline = new T.Shape();
      for (let p = 0; p < 10; p++) {
        const [r, a] = [p % 2 ? 0.75 : 1.7, HALF_PI + (p * Math.PI) / 5];
        outline[p === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
      }
      const geo = new T.ExtrudeGeometry(outline, { depth: 0.5, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 2 });
      geo.translate(0, 0, -0.25);
      const star = new T.Mesh(geo, material(COLORS.yellow)); star.position.y = 4; star.castShadow = true;
      group.add(star); spinners.push(star); addSolid(...zone.at, 2, 2, 2);
      return 5;
    },
    checkoff(zone, group) {
      boxes(group, [[[3.6, 0.3, 1.4], COLORS.steel, [0, 0.15, 0]], [[3.2, 3.2, 0.4], COLORS.paper, [0, 1.9, 0]]]);
      box([0.5, 1.2, 0.24], COLORS.green, [-0.62, 1.45, 0.25], group).rotation.z = 0.78;
      box([0.5, 2.3, 0.24], COLORS.green, [0.42, 1.95, 0.25], group).rotation.z = -0.62;
      addSolid(...zone.at, 3.6, 1.4, 3.5);
      return 3.5;
    },
    tower(zone, group) {
      const { stone, stoneLight, ink, red } = COLORS;
      const cyl = (t, b, h, hex, y) => { const m = shadowed(new T.Mesh(new T.CylinderGeometry(t, b, h, 10), material(hex))); m.position.y = y; group.add(m); };
      cyl(1.3, 1.5, 4, stoneLight, 2); cyl(1.6, 1.6, 0.4, stone, 4.2);
      for (let i = 0, a = 0; i < 6; i++, a = (i * Math.PI) / 3) box([0.5, 0.6, 0.5], stone, [Math.cos(a) * 1.3, 4.7, Math.sin(a) * 1.3], group).rotation.y = -a;
      boxes(group, [[[0.12, 2, 0.12], ink, [0, 5.4, 0]], [[1, 0.6, 0.06], red, [0.55, 6.05, 0]], [[0.7, 1.1, 0.1], ink, [0, 0.55, 1.42]]]);
      addSolid(...zone.at, 2.9, 2.9, 4.4);
      return 6;
    },
  };

  Object.assign(BI, { spinners, buildSign, landmarks });
})();
