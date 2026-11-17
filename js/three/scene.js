/*
 * 5a. Three.js Scene, Renderer, Camera, Lights & Geometry/Material Caches
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { T, COLORS, WORLD, CAMERA, ROUGHNESS, dom } = BI;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new T.WebGLRenderer({ canvas: dom.canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;

  /* Material colors are authored in sRGB and must be linear for lighting. */
  const linear = (hex) => new T.Color(hex).convertSRGBToLinear();

  const scene = new T.Scene();
  scene.background = linear(COLORS.sky);
  scene.fog = new T.Fog(scene.background.getHex(), 70, 150);
  const camera = new T.PerspectiveCamera(CAMERA.fov, 1, 0.5, 300);

  scene.add(new T.HemisphereLight(0xffffff, 0x7fa0c0, 0.72));
  const sun = new T.DirectionalLight(0xfff4dc, 0.95);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0006;
  Object.assign(sun.shadow.camera, { left: -36, right: 36, top: 36, bottom: -36, near: 1, far: 90 });
  scene.add(sun, sun.target);

  /* Geometry and materials are cached so hundreds of bricks share a handful of each. */
  const materialCache = {};
  const geometryCache = {};
  const material = (hex) =>
    materialCache[hex] ||
    (materialCache[hex] = new T.MeshStandardMaterial({ color: linear(hex), roughness: ROUGHNESS, metalness: 0.02 }));
  const boxGeometry = (x, y, z) => {
    const key = `${x}|${y}|${z}`;
    return geometryCache[key] || (geometryCache[key] = new T.BoxGeometry(x, y, z));
  };
  const studGeometry = new T.CylinderGeometry(WORLD.studRadius, WORLD.studRadius, WORLD.studHeight, 14);

  Object.assign(BI, {
    reducedMotion, renderer, linear, scene, camera, sun,
    material, boxGeometry, studGeometry,
  });
})();

