/*
 * 6c. Zone Signs & 3D Landmark Builders
 * Signs are fixed scenery. Every landmark in front of a sign is built from loose
 * pieces (addBrick bodies) that can be knocked over, picked up and thrown.
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, COLORS, FONTS, HALF_PI, scene, material, shadowed,
    box, brick, canvasTexture, texturedMaterial, fitText, addBrick,
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

  /* Loose landmark pieces: positions are relative to the zone, sizes drive resting and reach. */
  const pieceRadius = ([sx, , sz]) => Math.max(0.35, Math.max(sx, sz) * 0.42);
  const place = (zone, group, mesh, size, [x, y, z]) =>
    addBrick(group, mesh, size, [zone.at[0] + x, y, zone.at[1] + z], { radius: pieceRadius(size) });
  const plain = (size, hex) => box(size, hex, [0, 0, 0]);
  const turned = (mesh, axis, angle) => { mesh.rotation[axis] = angle; return mesh; };
  const cylinder = (top, bottom, height, hex) => shadowed(new T.Mesh(new T.CylinderGeometry(top, bottom, height, 10), material(hex)));
  const stack = (zone, group, size, colorNames, baseY = 0) =>
    colorNames.forEach((name, level) => place(zone, group, brick(size, COLORS[name]), size, [0, baseY + size[1] / 2 + level * size[1], 0]));
  const assembly = (parts) => {
    const holder = new T.Group();
    parts.forEach(([size, hex, pos, rotY = 0]) => { box(size, hex, pos, holder).rotation.y = rotY; });
    return holder;
  };

  const landmarks = {
    about(zone, group) {
      stack(zone, group, [2, 1, 2], ['yellow']);
      place(zone, group, brick([1, 1, 1], COLORS.red), [1, 1, 1], [0, 1.5, 0]);
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
      [[[0.6, 0.14, 0.3], ink, [-0.4, 2.42, 0]], [[0.14, 0.14, 1], ink, [0.8, 2.7, 0]]].forEach(([size, hex, pos]) => box(size, hex, pos, bike));
      const standSize = [4.4, 0.3, 1.6];
      const stand = place(zone, group, plain(standSize, steel), standSize, [0, 0.15, 0]);
      BI.bikeRig = { group: bike, wheels, stand, home: { x: zone.at[0], z: zone.at[1] } };
      return 2.7;
    },
    wordstar(zone, group) {
      stack(zone, group, [2, 1, 2], ['red', 'blue']);
      const outline = new T.Shape();
      for (let p = 0; p < 10; p++) {
        const [r, a] = [p % 2 ? 0.75 : 1.7, HALF_PI + (p * Math.PI) / 5];
        outline[p === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
      }
      const geo = new T.ExtrudeGeometry(outline, { depth: 0.5, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 2 });
      geo.translate(0, 0, -0.25);
      const star = shadowed(new T.Mesh(geo, material(COLORS.yellow)));
      place(zone, group, star, [3.4, 3.2, 0.66], [0, 4, 0]);
      spinners.push(star);
      return 5;
    },
    checkoff(zone, group) {
      const { steel, paper, green } = COLORS;
      place(zone, group, plain([3.6, 0.3, 1.4], steel), [3.6, 0.3, 1.4], [0, 0.15, 0]);
      const row = [3.2, 3.2 / 3, 0.4];
      [0, 1, 2].forEach((r) => place(zone, group, plain(row, paper), row, [0, 0.3 + row[1] * (r + 0.5), 0]));
      place(zone, group, turned(plain([0.5, 1.2, 0.24], green), 'z', 0.78), [0.5, 1.2, 0.24], [-0.62, 1.45, 0.32]);
      place(zone, group, turned(plain([0.5, 2.3, 0.24], green), 'z', -0.62), [0.5, 2.3, 0.24], [0.42, 1.95, 0.32]);
      return 3.5;
    },
    tower(zone, group) {
      const { stone, stoneLight, ink, red } = COLORS;
      const radiusAt = (y) => 1.5 - (0.2 * y) / 4;
      for (let level = 0; level < 4; level++) {
        const drum = cylinder(radiusAt(level + 1), radiusAt(level), 1, stoneLight);
        if (level === 0) box([0.7, 1, 0.1], ink, [0, 0, 1.44], drum);
        place(zone, group, drum, [2.9, 1, 2.9], [0, level + 0.5, 0]);
      }
      place(zone, group, cylinder(1.6, 1.6, 0.4, stone), [3.2, 0.4, 3.2], [0, 4.2, 0]);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        place(zone, group, turned(plain([0.5, 0.6, 0.5], stone), 'y', -a), [0.5, 0.6, 0.5], [Math.cos(a) * 1.3, 4.7, Math.sin(a) * 1.3]);
      }
      place(zone, group, assembly([[[0.12, 2, 0.12], ink, [0, 0, 0]], [[1, 0.6, 0.06], red, [0.55, 0.65, 0]]]), [1.1, 2, 0.2], [0, 5.4, 0]);
      return 6;
    },
  };

  Object.assign(BI, { spinners, buildSign, landmarks, place, plain, stack, assembly, turned });
})();
