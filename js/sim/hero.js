/*
 * 9a. Hero Simulation: Movement, Jumping, Ledge Step-Up & Solid Collision
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    WORLD, HERO, PHYSICS, clamp, ui, say, solids, onIsland, rampHeight, rampSlope,
    hero, readMoveInput, followRoute, animateFigure, bike, stepBike,
  } = BI;

  const groundHeight = (x, z, y) => {
    const pad = 0.25;
    const reachable = solids
      .filter((s) => x > s.x0 - pad && x < s.x1 + pad && z > s.z0 - pad && z < s.z1 + pad && s.height <= y + HERO.stepUp)
      .map((s) => s.height);
    const ramp = rampHeight(x, z);
    return Math.max(onIsland(x, z, 0.3) ? 0 : -Infinity, ramp <= y + HERO.stepUp ? ramp : -Infinity, ...reachable);
  };

  const resolveSolids = () => {
    const radius = HERO.radius;
    solids.forEach((solid) => {
      if (hero.y >= solid.height - HERO.stepUp) return;
      const [nearX, nearZ] = [clamp(hero.x, solid.x0, solid.x1), clamp(hero.z, solid.z0, solid.z1)];
      const [dx, dz] = [hero.x - nearX, hero.z - nearZ];
      const distance = Math.hypot(dx, dz);
      if (distance >= radius) return;
      if (distance > 1e-4) {
        hero.x = nearX + (dx / distance) * radius;
        hero.z = nearZ + (dz / distance) * radius;
        return;
      }
      const exits = [
        [hero.x - solid.x0, () => { hero.x = solid.x0 - radius; }],
        [solid.x1 - hero.x, () => { hero.x = solid.x1 + radius; }],
        [hero.z - solid.z0, () => { hero.z = solid.z0 - radius; }],
        [solid.z1 - hero.z, () => { hero.z = solid.z1 + radius; }],
      ];
      exits.sort((a, b) => a[0] - b[0])[0][1]();
    });
  };

  /* The ramp's tall end and high sides act as walls: slide along them instead of passing through. */
  const blockRampSides = (lastX, lastZ) => {
    const tooHigh = (x, z) => rampHeight(x, z) > hero.y + HERO.stepUp;
    if (!tooHigh(hero.x, hero.z)) return;
    if (!tooHigh(lastX, hero.z)) { hero.x = lastX; hero.vx = 0; }
    else if (!tooHigh(hero.x, lastZ)) { hero.z = lastZ; hero.vz = 0; }
    else { hero.x = lastX; hero.z = lastZ; hero.vx = hero.vz = 0; }
  };

  const respawn = () => {
    Object.assign(hero, { x: WORLD.spawn.x, y: 7, z: WORLD.spawn.z, vx: 0, vy: 0, vz: 0, route: null });
    say('Splash. Back to the start you go.');
  };

  const stepHero = (dt) => {
    let [moveX, moveZ] = ui.resumeOpen ? [0, 0] : readMoveInput();
    if (moveX || moveZ) hero.route = null;
    else if (hero.route && !ui.resumeOpen) [moveX, moveZ] = followRoute(dt) || [0, 0];

    const topSpeed = bike.riding ? HERO.bikeSpeed : HERO.speed;
    const grip = bike.riding ? 7 : 14;
    const response = Math.min(1, (hero.onGround ? grip : 5) * dt);
    hero.vx += (moveX * topSpeed - hero.vx) * response;
    hero.vz += (moveZ * topSpeed - hero.vz) * response;
    const [lastX, lastZ] = [hero.x, hero.z];
    hero.x += hero.vx * dt;
    hero.z += hero.vz * dt;
    resolveSolids();
    blockRampSides(lastX, lastZ);

    // On the ramp, climbing speed becomes upward speed, so riding off the top end launches you.
    const onRamp = hero.onGround && Math.abs(rampHeight(hero.x, hero.z) - hero.y) < 0.6;
    if (onRamp) hero.vy = hero.vx * rampSlope;

    if (hero.wantsJump && hero.onGround && !ui.resumeOpen) {
      hero.vy = HERO.jump + Math.max(0, hero.vy);
      hero.onGround = false;
    }
    hero.wantsJump = false;
    const previousY = hero.y;
    hero.vy -= PHYSICS.gravity * dt;
    hero.y += hero.vy * dt;
    const ground = groundHeight(hero.x, hero.z, previousY);
    if (hero.y <= ground && (hero.vy <= 0 || onRamp)) {
      hero.y = ground; hero.vy = onRamp ? Math.max(0, hero.vy) : 0; hero.onGround = true;
    } else if (hero.y > ground + 0.05) {
      hero.onGround = false;
    }
    if (hero.y < WORLD.fallLimit) respawn();

    const speed = Math.hypot(hero.vx, hero.vz);
    if (speed > 0.6) {
      let turn = Math.atan2(hero.vx, hero.vz) - hero.facing;
      while (turn > Math.PI) turn -= 2 * Math.PI;
      while (turn < -Math.PI) turn += 2 * Math.PI;
      hero.facing += turn * Math.min(1, 14 * dt);
    }
    hero.stride += speed * dt * 1.5;
    animateFigure(speed);
    stepBike(dt, speed);
  };

  Object.assign(BI, { stepHero });
})();
