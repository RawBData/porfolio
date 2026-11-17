/*
 * 9b. Brick Rigid-Body Motion & Orientation Settling
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { T, PHYSICS, STATE, HALF_PI, onIsland, rampHeight } = BI;
  const scratch = {
    quaternion: new T.Quaternion(), vector: new T.Vector3(),
    matrix: new T.Matrix4(), euler: new T.Euler(),
  };

  /* Half the brick's height in its current orientation, so it rests flat on any face. */
  const halfHeight = (body) => {
    const e = scratch.matrix.makeRotationFromQuaternion(body.mesh.quaternion).elements;
    const [sx, sy, sz] = body.size;
    return (Math.abs(e[1]) * sx + Math.abs(e[5]) * sy + Math.abs(e[9]) * sz) / 2;
  };

  /* The nearest orientation with a face flat on the ground. */
  const flatOrientation = (body) => {
    const { euler, quaternion } = scratch;
    euler.setFromQuaternion(body.mesh.quaternion, 'YXZ');
    euler.x = Math.round(euler.x / HALF_PI) * HALF_PI;
    euler.z = Math.round(euler.z / HALF_PI) * HALF_PI;
    return quaternion.setFromEuler(euler);
  };

  const integrateBrick = (body, dt) => {
    const [pos, { velocity, spin }] = [body.mesh.position, body];
    velocity.y -= PHYSICS.gravity * dt;
    pos.addScaledVector(velocity, dt);

    const spinRate = spin.length();
    if (spinRate > 1e-3) {
      scratch.quaternion.setFromAxisAngle(scratch.vector.copy(spin).divideScalar(spinRate), spinRate * dt);
      body.mesh.quaternion.premultiply(scratch.quaternion);
    }

    const floor = Math.max(0, rampHeight(pos.x, pos.z));
    const rest = halfHeight(body) + floor;
    if (onIsland(pos.x, pos.z) && pos.y < rest && pos.y > floor - 1.5) {
      pos.y = rest;
      velocity.y = velocity.y < -2.5 ? -velocity.y * PHYSICS.bounce : 0;
      const friction = Math.max(0, 1 - PHYSICS.groundFriction * dt);
      velocity.x *= friction;
      velocity.z *= friction;
      spin.multiplyScalar(Math.max(0, 1 - PHYSICS.spinFriction * dt));

      if (velocity.lengthSq() >= 0.5 || spin.lengthSq() >= 2.5) {
        body.restTime = 0;
      } else {
        const flat = flatOrientation(body);
        body.mesh.quaternion.slerp(flat, Math.min(1, 10 * dt));
        spin.multiplyScalar(0.8);
        if ((body.restTime += dt) > PHYSICS.settleTime) {
          body.mesh.quaternion.copy(flat);
          pos.y = halfHeight(body) + floor;
          velocity.set(0, 0, 0);
          spin.set(0, 0, 0);
          Object.assign(body, { state: STATE.SETTLED, thrown: false });
        }
      }
    }
    if (pos.y < -30) {
      body.state = STATE.LOST;
      body.mesh.visible = false;
    }
  };

  Object.assign(BI, { scratch, integrateBrick });
})();
