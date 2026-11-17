/*
 * 10. Main Entry & Render Loop
 * Initializes the 3D world, updates camera & decorations, and drives the animation frame.
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, PHYSICS, CAMERA, dom, reducedMotion, renderer, scene, camera, sun,
    pads, spinners, buildWorld, hero, routeMarker, routeTarget,
    stepHero, stepBricks, stepZones,
  } = BI;

  buildWorld();

  const view = { focus: new T.Vector3(hero.x, 0, hero.z), zoom: 1 };
  const clock = new T.Clock();
  let elapsed = 0;

  const zoomForAspect = (aspect) => {
    if (aspect < 0.7) return 1.75;
    if (aspect < 1) return 1.45;
    if (aspect < 1.5) return 1.15;
    return 1;
  };

  const resize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view.zoom = zoomForAspect(camera.aspect);
  };
  window.addEventListener('resize', resize);
  resize();

  const stepDecorations = () => {
    routeMarker.visible = Boolean(hero.route);
    if (hero.route) {
      const target = routeTarget(hero.route);
      routeMarker.position.x = target.x;
      routeMarker.position.z = target.z;
    }
    if (reducedMotion) return;
    pads.forEach((ring, index) => {
      const pulse = 1 + Math.sin(elapsed * 3 + index) * 0.05;
      ring.scale.set(pulse, pulse, 1);
    });
    spinners.forEach((mesh) => { if (mesh.userData.body.state === BI.STATE.HOME) mesh.rotation.y = elapsed * 0.9; });
  };

  const stepCamera = (dt) => {
    const { focus, zoom } = view;
    const follow = Math.min(1, 6 * dt);
    focus.x += (hero.x - focus.x) * follow;
    focus.z += (hero.z - focus.z) * follow;
    focus.y += (Math.max(hero.y, -2) - focus.y) * Math.min(1, 4 * dt);

    camera.position.set(focus.x, focus.y + CAMERA.height * zoom, focus.z + CAMERA.back * zoom);
    camera.lookAt(focus.x, focus.y + 1, focus.z - CAMERA.lookAhead);

    sun.position.set(focus.x + 14, focus.y + 34, focus.z + 12);
    sun.target.position.copy(focus);
  };

  const frame = () => {
    const dt = Math.min(clock.getDelta(), PHYSICS.maxStep);
    elapsed += dt;
    stepHero(dt);
    stepBricks(dt);
    stepZones();
    stepDecorations();
    stepCamera(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  };

  dom.canvas.focus();
  frame();
})();
