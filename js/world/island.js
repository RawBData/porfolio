/*
 * 6a. Island Baseplate, Paths & Static Colliders
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, COLORS, WORLD, ZONES, ROUGHNESS, HALF_PI, clamp,
    scene, linear, studGeometry, box, canvasTexture, texturedMaterial,
  } = BI;

  const solids = [];
  const addSolid = (centerX, centerZ, sizeX, sizeZ, height) =>
    solids.push({
      x0: centerX - sizeX / 2, x1: centerX + sizeX / 2,
      z0: centerZ - sizeZ / 2, z1: centerZ + sizeZ / 2, height,
    });

  const onIsland = (x, z, margin = 0) =>
    Math.abs(x) < WORLD.half + margin && Math.abs(z) < WORLD.half + margin;

  const nearestRingPoint = (x, z) => {
    const { x: ringX, z: ringZ } = WORLD.ring;
    let [px, pz] = [clamp(x, -ringX, ringX), clamp(z, -ringZ, ringZ)];
    if (px === x && pz === z) {
      if (ringX - Math.abs(x) < ringZ - Math.abs(z)) px = Math.sign(x || 1) * ringX;
      else pz = Math.sign(z || 1) * ringZ;
    }
    return [px, pz];
  };

  const pathSegments = (() => {
    const { x, z } = WORLD.ring;
    const { spawn } = WORLD;
    return [
      [-x, -z, x, -z], [x, -z, x, z], [x, z, -x, z], [-x, z, -x, -z],
      [spawn.x, spawn.z, spawn.x, z],
      ...ZONES.map(({ pad }) => [...pad, ...nearestRingPoint(...pad)]),
    ];
  })();

  const distanceToSegment = (px, pz, [ax, az, bx, bz]) => {
    const [vx, vz] = [bx - ax, bz - az];
    const lengthSq = vx * vx + vz * vz;
    const t = lengthSq ? clamp(((px - ax) * vx + (pz - az) * vz) / lengthSq, 0, 1) : 0;
    return Math.hypot(px - ax - vx * t, pz - az - vz * t);
  };
  const onPath = (x, z) => pathSegments.some((s) => distanceToSegment(x, z, s) < WORLD.pathWidth);

  const buildIsland = () => {
    const size = WORLD.half * 2;
    const cellCenter = (index) => index - WORLD.half + 0.5;
    const groundMap = canvasTexture(size, size, (ctx) => {
      for (let px = 0; px < size; px++) {
        for (let py = 0; py < size; py++) {
          const grass = ((px >> 2) + (py >> 2)) % 2 ? COLORS.grassA : COLORS.grassB;
          ctx.fillStyle = onPath(cellCenter(px), cellCenter(py)) ? COLORS.path : grass;
          ctx.fillRect(px, py, 1, 1);
        }
      }
    });
    groundMap.magFilter = groundMap.minFilter = T.NearestFilter;
    groundMap.generateMipmaps = false;

    const top = new T.Mesh(new T.PlaneGeometry(size, size), texturedMaterial(groundMap, 0.5));
    top.rotation.x = -HALF_PI; top.receiveShadow = true; scene.add(top);

    box([size, 3, size], COLORS.leafDark, [0, -1.51, 0]).castShadow = false;
    box([size + 2, 1.2, size + 2], COLORS.sand, [0, -3.2, 0]).castShadow = false;

    const sea = new T.Mesh(new T.PlaneGeometry(600, 600), new T.MeshStandardMaterial({ color: linear(COLORS.sea), roughness: 0.25 }));
    sea.rotation.x = -HALF_PI; sea.position.y = -3.4; scene.add(sea);

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
    studs.receiveShadow = true;
    scene.add(studs);
  };

  Object.assign(BI, { solids, addSolid, onPath, onIsland, buildIsland });
})();
