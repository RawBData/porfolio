/*
 * 5b. Three.js Primitives & Texture Builders
 * Reusable 3D elements: boxes, studded bricks, canvas textures, faced boxes, and decals.
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { T, WORLD, ROUGHNESS, HALF_PI, COLORS, renderer, scene, material, boxGeometry, studGeometry } = BI;

  const shadowed = (mesh) => {
    mesh.castShadow = mesh.receiveShadow = true;
    return mesh;
  };

  const box = (size, hex, position, parent = scene) => {
    const mesh = shadowed(new T.Mesh(boxGeometry(...size), material(hex)));
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };

  const boxes = (parent, specs) => specs.map(([size, hex, pos]) => box(size, hex, pos, parent));

  const addStuds = (parent, countX, countZ, topY, hex) => {
    for (let i = 0; i < countX; i++) {
      for (let j = 0; j < countZ; j++) {
        const stud = new T.Mesh(studGeometry, material(hex));
        stud.position.set(i - (countX - 1) / 2, topY + WORLD.studHeight / 2, j - (countZ - 1) / 2);
        stud.castShadow = true;
        parent.add(stud);
      }
    }
  };

  const brick = (size, hex, body = shadowed(new T.Mesh(boxGeometry(...size), material(hex)))) => {
    const [sx, sy, sz] = size;
    const group = new T.Group();
    group.add(body);
    addStuds(group, sx, sz, sy / 2, hex);
    return group;
  };

  const stackBricks = (parent, size, colorNames) =>
    colorNames.forEach((colorName, level) => {
      const piece = brick(size, COLORS[colorName]);
      piece.position.y = size[1] / 2 + level * size[1];
      parent.add(piece);
    });

  const canvasTexture = (width, height, draw) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height });
    draw(canvas.getContext('2d'), width, height);
    const texture = new T.CanvasTexture(canvas);
    texture.encoding = T.sRGBEncoding;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  };

  const texturedMaterial = (texture, roughness = ROUGHNESS) =>
    new T.MeshStandardMaterial({ map: texture, roughness });

  const fitText = (context, text, weight, size, family, maxWidth) => {
    do {
      context.font = `${weight} ${size}px ${family}`;
      size -= 2;
    } while (context.measureText(text).width > maxWidth && size > 10);
  };

  const FRONT = 4;
  const BACK = 5;
  const facedBox = (size, hex, texture, faces = [FRONT]) => {
    const materials = Array(6).fill(material(hex));
    faces.forEach((face) => { materials[face] = texturedMaterial(texture); });
    return shadowed(new T.Mesh(boxGeometry(...size), materials));
  };

  const groundDecal = (geometry, color, opacity, lift) => {
    const mesh = new T.Mesh(geometry, new T.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
    mesh.rotation.x = -HALF_PI;
    mesh.position.y = WORLD.studHeight + lift;
    scene.add(mesh);
    return mesh;
  };

  Object.assign(BI, {
    shadowed, box, boxes, addStuds, brick, stackBricks, canvasTexture,
    texturedMaterial, fitText, FRONT, BACK, facedBox, groundDecal,
  });
})();
