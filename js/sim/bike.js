/*
 * 8d. Rideable Bike: Mount, Dismount, Follow the Hero & Spin the Wheels
 * The SFRider bike (built in landmarks.js as BI.bikeRig) can be clicked to ride.
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { $, HERO, STATE, HALF_PI, dist2D, ui, say, hero, onIsland } = BI;

  const bike = { riding: false, crank: 0, figureLift: 1.26 };   // figureLift raises the rider onto the seat
  const exitButton = $('btnBike');
  const SEAT_BACK = 0.4;   // the seat sits this far behind the bike's centre
  const LIFT = 0.3;        // the wheels touch down this far above the bike group's origin
  const WHEEL_RADIUS = 0.93;

  const rig = () => BI.bikeRig;
  const bikeFacing = () => rig().group.rotation.y + HALF_PI;

  const isBikePart = (object) => {
    for (let node = object; node; node = node.parent) if (node === rig().group) return true;
    return false;
  };

  const bikeInReach = () => {
    const { x, z } = rig().group.position;
    return dist2D(x, z, hero.x, hero.z) < HERO.bikeReach;
  };

  const mountBike = () => {
    if (bike.riding || ui.resumeOpen) return;
    const { group } = rig();
    const facing = bikeFacing();
    Object.assign(hero, {
      x: group.position.x - Math.sin(facing) * SEAT_BACK,
      z: group.position.z - Math.cos(facing) * SEAT_BACK,
      y: Math.max(hero.y, group.position.y + LIFT),
      vx: 0, vz: 0, facing, route: null,
    });
    bike.riding = true;
    exitButton.hidden = false;
    say('On the bike. Ride fast! Press Exit bike to hop off.');
  };

  const dismountBike = () => {
    if (!bike.riding) return;
    if (!hero.onGround) { say('Land first, then hop off.'); return; }
    bike.riding = false;
    exitButton.hidden = true;
    hero.route = null;
    const [sideX, sideZ] = [hero.x + Math.cos(hero.facing) * 1.1, hero.z - Math.sin(hero.facing) * 1.1];
    if (onIsland(sideX, sideZ, 0.6)) { hero.x = sideX; hero.z = sideZ; }
    hero.vx = hero.vz = 0;
    say('Parked. Click the bike to ride again.');
  };

  const toggleBike = () => {
    if (bike.riding) dismountBike();
    else if (bikeInReach()) mountBike();
    else {
      hero.route = { bike: true, stall: 0 };
      say('Heading to the bike. Press any other key to stop.');
    }
  };

  const stepBike = (dt, speed) => {
    const { group, wheels, stand, home } = rig();
    if (!bike.riding) {
      const atHome = group.position.x === home.x && group.position.z === home.z;
      if (atHome) group.position.y = stand.state === STATE.HOME ? 0 : -LIFT;
      return;
    }
    const [forwardX, forwardZ] = [Math.sin(hero.facing), Math.cos(hero.facing)];
    group.position.set(hero.x + forwardX * SEAT_BACK, hero.y - LIFT, hero.z + forwardZ * SEAT_BACK);
    group.rotation.y = hero.facing - HALF_PI;
    const roll = (speed * dt) / WHEEL_RADIUS;
    wheels.forEach((wheel) => { wheel.rotation.z -= roll; });
    bike.crank += roll * 0.7;
  };

  const parkBikeHome = () => {
    if (bike.riding || !rig()) return;
    const { group, home } = rig();
    group.position.set(home.x, 0, home.z);
    group.rotation.set(0, 0, 0);
  };

  exitButton.addEventListener('click', () => { dismountBike(); BI.dom.canvas.focus(); });

  Object.assign(BI, { bike, isBikePart, bikeInReach, mountBike, dismountBike, toggleBike, stepBike, parkBikeHome });
})();
