/*
 * 8b. Pointer Raycasting & Click-to-Walk Route Steering
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const {
    T, COLORS, WORLD, HERO, STATE, clamp, dist2D,
    camera, linear, groundDecal, ui, bricks, hero, pickUp, throwHeld,
    bike, isBikePart, bikeInReach, mountBike,
  } = BI;

  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const routeMarker = groundDecal(new T.RingGeometry(0.45, 0.7, 28), linear(COLORS.paper), 0.9, 0.07);
  routeMarker.visible = false;

  const bodyOf = (object) => {
    while (object && !object.userData.body) object = object.parent;
    return object ? object.userData.body : null;
  };

  const pickAt = (clientX, clientY) => {
    pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);

    const candidates = bricks
      .filter((body) => body.state !== STATE.LOST && body !== hero.held)
      .map((body) => body.mesh);
    if (!bike.riding && BI.bikeRig) candidates.push(BI.bikeRig.group);
    const [hit] = raycaster.intersectObjects(candidates, true);
    if (hit && isBikePart(hit.object)) return { bike: true, body: null, point: hit.point.clone() };
    if (hit) return { body: bodyOf(hit.object), point: hit.point.clone() };

    const { origin, direction } = raycaster.ray;
    if (direction.y > -1e-4) return null;
    const distance = -origin.y / direction.y;
    return {
      body: null,
      point: new T.Vector3(origin.x + direction.x * distance, 0.5, origin.z + direction.z * distance),
    };
  };

  const handleClick = (clientX, clientY) => {
    if (ui.resumeOpen) return;
    const picked = pickAt(clientX, clientY);
    if (!picked) return;

    if (hero.held) {
      hero.route = null;
      throwHeld(picked.point);
    } else if (picked.bike) {
      if (bikeInReach()) mountBike();
      else hero.route = { bike: true, stall: 0 };
    } else if (picked.body) {
      hero.route = { brick: picked.body, stall: 0 };
    } else {
      const edge = WORLD.half - 0.6;
      hero.route = { x: clamp(picked.point.x, -edge, edge), z: clamp(picked.point.z, -edge, edge), stall: 0 };
    }
  };

  const routeTarget = (route) => {
    if (route.bike) return BI.bikeRig.group.position;
    return route.brick ? route.brick.mesh.position : route;
  };

  const followRoute = (dt) => {
    const route = hero.route;
    const target = routeTarget(route);
    const [dx, dz] = [target.x - hero.x, target.z - hero.z];
    const distance = Math.hypot(dx, dz) || 0.001;

    const brickGone = route.brick && route.brick.state >= STATE.LOST;
    const brickReach = bike.riding ? HERO.bikeReach : HERO.clickReach;
    const reach = route.bike ? HERO.bikeReach * 0.8 : route.brick ? brickReach : 0.3;
    const arrived = distance < reach;
    if (arrived && route.brick && !brickGone) pickUp(route.brick);
    if (arrived && route.bike) mountBike();

    const moved = dist2D(hero.x, hero.z, route.lastX, route.lastZ) / dt;
    route.lastX = hero.x;
    route.lastZ = hero.z;
    route.stall = moved < 1 ? route.stall + dt : 0;

    if (brickGone || arrived || route.stall > 0.9) {
      hero.route = null;
      return null;
    }
    const ease = route.brick || route.bike ? 1 : Math.min(1, distance / 1.5 + 0.25);
    return [(dx / distance) * ease, (dz / distance) * ease];
  };

  Object.assign(BI, { routeMarker, handleClick, routeTarget, followRoute });
})();

