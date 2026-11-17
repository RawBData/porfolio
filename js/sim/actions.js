/*
 * 8a. Hero State & Brick Actions (Wake, Pick Up, Throw, Rebuild)
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { WORLD, HERO, PHYSICS, STATE, clamp, dist2D, dom, ui, say, bricks, brickGroups, stats } = BI;

  const hero = {
    x: WORLD.spawn.x, y: 6, z: WORLD.spawn.z, vx: 0, vy: 0, vz: 0,
    onGround: false, facing: 0, stride: 0, wantsJump: false, held: null, route: null,
  };

  const wake = (body) => {
    if (body.state === STATE.SETTLED) { body.state = STATE.AWAKE; body.restTime = 0; return; }
    if (body.state !== STATE.HOME) return;
    const jitter = (scale) => (Math.random() - 0.5) * scale;
    brickGroups[body.group].forEach((member) => {
      if (member.state !== STATE.HOME) return;
      member.state = STATE.AWAKE; member.restTime = 0;
      member.velocity.set(jitter(1.6), Math.random() * 1.5, jitter(1.6));
      member.spin.set(jitter(3), jitter(3), jitter(3));
      if (!member.counted) { member.counted = true; stats.knocked++; }
    });
  };

  const setHeld = (body) => {
    hero.held = body;
    dom.grabButton.textContent = body ? 'Throw' : 'Grab';
  };

  const pickUp = (body) => {
    wake(body);
    body.state = STATE.HELD;
    body.velocity.set(0, 0, 0); body.spin.set(0, 0, 0);
    setHeld(body);
  };

  const throwHeld = (target) => {
    const body = hero.held;
    const from = body.mesh.position;
    let [dirX, dirZ] = [Math.sin(hero.facing), Math.cos(hero.facing)];
    if (target) {
      const [dx, dz] = [target.x - from.x, target.z - from.z];
      const distance = Math.hypot(dx, dz) || 0.001;
      const flight = clamp(distance / HERO.throwSpeed, 0.45, 1.4);
      const rise = (target.y - from.y + 0.5 * PHYSICS.gravity * flight * flight) / flight;
      body.velocity.set(dx / flight, rise, dz / flight);
      [dirX, dirZ] = [dx / distance, dz / distance];
      hero.facing = Math.atan2(dx, dz);
    } else {
      body.velocity.set(dirX * HERO.throwSpeed + hero.vx * 0.6, HERO.throwLift, dirZ * HERO.throwSpeed + hero.vz * 0.6);
    }
    body.spin.set(dirZ * 7, 0, -dirX * 7);
    Object.assign(body, { state: STATE.AWAKE, restTime: 0, thrown: true, grace: PHYSICS.throwGrace });
    setHeld(null);
  };

  const nearestBrickInReach = () => {
    let [nearest, best] = [null, HERO.grabReach];
    bricks.forEach((body) => {
      if (body.state === STATE.LOST) return;
      const { x, y, z } = body.mesh.position;
      if (y - hero.y < -0.6 || y - hero.y > 3.2) return;
      const distance = dist2D(x, z, hero.x, hero.z);
      if (distance < best) { best = distance; nearest = body; }
    });
    return nearest;
  };

  const grabOrThrow = () => {
    if (ui.resumeOpen) return;
    hero.route = null;
    if (hero.held) return throwHeld(null);
    const body = nearestBrickInReach();
    if (body) pickUp(body);
    else say('No brick close enough to grab.');
  };

  const rebuild = () => {
    setHeld(null); hero.route = null;
    bricks.forEach((body) => {
      body.mesh.position.copy(body.home.position);
      body.mesh.quaternion.copy(body.home.quaternion);
      body.mesh.visible = true;
      body.velocity.set(0, 0, 0); body.spin.set(0, 0, 0);
      Object.assign(body, { state: STATE.HOME, thrown: false, grace: 0, counted: false });
    });
    if (BI.parkBikeHome) BI.parkBikeHome();
    say('All rebuilt. Have another go.');
  };

  Object.assign(BI, { hero, wake, pickUp, throwHeld, grabOrThrow, rebuild });
})();
