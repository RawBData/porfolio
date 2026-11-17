/*
 * 9c. Brick Collisions: Carrying, Hero Shoving & Sphere-Sphere Contact
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { HERO, STATE, bricks, hero, wake, scratch, integrateBrick } = BI;

  const carryHeldBrick = () => {
    const body = hero.held;
    if (!body) return;
    body.mesh.position.set(hero.x, hero.y + HERO.carryHeight + body.size[1] / 2, hero.z);
    body.mesh.rotation.set(0, hero.facing, 0);
  };

  const shoveBricks = (dt) => {
    const speed = Math.hypot(hero.vx, hero.vz);
    bricks.forEach((body) => {
      if (body.state >= STATE.LOST) return;
      if (body.grace > 0) { body.grace -= dt; return; }
      if (body.canopy && body.state === STATE.HOME) return;

      const pos = body.mesh.position;
      const [dx, dz, h, reach] = [pos.x - hero.x, pos.z - hero.z, pos.y - hero.y, HERO.radius + body.radius];
      const dist = Math.hypot(dx, dz);
      if (h <= -0.6 || h >= 3.1 || dist >= reach || (speed <= 0.5 && hero.onGround && body.state === STATE.HOME)) return;

      wake(body);
      const [nx, nz, push] = [dx / (dist || 0.001), dz / (dist || 0.001), speed * 1.05 + 2.5];
      pos.x = hero.x + nx * reach;
      pos.z = hero.z + nz * reach;
      body.velocity.set(
        nx * push + hero.vx * 0.35,
        Math.max(body.velocity.y, 2.2 + speed * 0.4 + (hero.onGround ? 0 : 2)),
        nz * push + hero.vz * 0.35
      );
      body.spin.set(nz * 6, (Math.random() - 0.5) * 4, -nx * 6);
      body.restTime = 0;
    });
  };

  const collideBricks = () => {
    bricks.forEach((a, iA) => {
      if (a.state !== STATE.AWAKE) return;
      bricks.forEach((b, iB) => {
        if (b === a || b.state >= STATE.LOST || (b.state === STATE.HOME && !a.thrown) || (b.state === STATE.AWAKE && iB < iA)) return;
        const [posA, posB, normal] = [a.mesh.position, b.mesh.position, scratch.vector.subVectors(b.mesh.position, a.mesh.position)];
        const dist = normal.length();
        const overlap = a.radius + b.radius - dist;
        if (overlap <= 0 || dist < 1e-3) return;
        normal.divideScalar(dist);

        const closing = a.velocity.dot(normal) - b.velocity.dot(normal);
        if (b.state === STATE.HOME || (b.state === STATE.SETTLED && closing > 3.5)) wake(b);
        if (b.state === STATE.AWAKE) {
          posA.addScaledVector(normal, -overlap / 2);
          posB.addScaledVector(normal, overlap / 2);
          if (closing > 0) {
            a.velocity.addScaledVector(normal, -closing * 0.6);
            b.velocity.addScaledVector(normal, closing * 0.6);
          }
        } else {
          posA.addScaledVector(normal, -overlap);
          if (closing > 0) a.velocity.addScaledVector(normal, -closing * 1.2);
        }
      });
    });
  };

  const stepBricks = (dt) => {
    carryHeldBrick();
    shoveBricks(dt);
    bricks.forEach((body) => { if (body.state === STATE.AWAKE) integrateBrick(body, dt); });
    collideBricks();
  };

  Object.assign(BI, { stepBricks });
})();

