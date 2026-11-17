/*
 * 7. Character Figure: 3D Rig, Textures & Running/Jumping Animation
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { T, COLORS, FONTS, HERO, scene, box, canvasTexture, facedBox } = BI;

  const figure = new T.Group();
  const torsoRig = new T.Group();
  figure.add(torsoRig);
  scene.add(figure);

  const limb = (x, y, [width, length, depth], hex, endHex) => {
    const pivot = new T.Group();
    pivot.position.set(x, y, 0);
    torsoRig.add(pivot);
    box([width, length, depth], hex, [0, -length / 2, 0], pivot);
    box([width + 0.02, 0.22, depth + 0.02], endHex, [0, -length + 0.05, 0], pivot);
    return pivot;
  };

  const legs = [-0.27, 0.27].map((x) => limb(x, 0.95, [0.46, 0.95, 0.52], COLORS.navy, COLORS.ink));
  const arms = [-0.66, 0.66].map((x) => limb(x, 2.02, [0.28, 0.85, 0.32], COLORS.red, COLORS.skin));

  const shirt = canvasTexture(128, 128, (ctx) => {
    ctx.fillStyle = COLORS.red; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = COLORS.paper; ctx.font = `700 56px ${FONTS.display}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BR', 64, 62);
  });
  const face = canvasTexture(128, 128, (ctx) => {
    ctx.fillStyle = COLORS.skin; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = COLORS.ink; ctx.beginPath();
    ctx.arc(42, 58, 8, 0, 7); ctx.arc(86, 58, 8, 0, 7); ctx.fill();
    ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.strokeStyle = COLORS.ink;
    ctx.beginPath(); ctx.arc(64, 66, 28, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
  });

  const torso = facedBox([1.02, 0.95, 0.56], COLORS.red, shirt); torso.position.y = 1.6;
  const head = facedBox([0.78, 0.7, 0.74], COLORS.skin, face); head.position.y = 2.45;
  torsoRig.add(torso, head);
  box([1.02, 0.2, 0.54], COLORS.ink, [0, 1.03, 0], torsoRig);
  box([0.84, 0.24, 0.8], COLORS.blue, [0, 2.9, 0], torsoRig);
  box([0.84, 0.08, 0.4], COLORS.blue, [0, 2.8, 0.55], torsoRig);

  const animateFigure = (speed) => {
    const { hero } = BI;
    const effort = Math.min(1, speed / HERO.speed);
    const swing = Math.sin(hero.stride) * effort;
    const [legLeft, legRight] = legs;
    const [armLeft, armRight] = arms;

    if (BI.bike && BI.bike.riding) {
      const pedal = Math.sin(BI.bike.crank) * 0.4;
      legLeft.rotation.x = -0.6 + pedal;
      legRight.rotation.x = -0.6 - pedal;
      armLeft.rotation.x = armRight.rotation.x = hero.held ? -3.0 : -0.8;
      armLeft.rotation.z = hero.held ? -0.15 : 0;
      armRight.rotation.z = hero.held ? 0.15 : 0;
      torsoRig.position.y = 0;
      torsoRig.rotation.x = hero.held ? 0.1 : 0.3;
      figure.position.set(hero.x, hero.y + BI.bike.figureLift, hero.z);
      figure.rotation.y = hero.facing;
      return;
    }

    if (hero.onGround) {
      legLeft.rotation.x = swing * 0.95;
      legRight.rotation.x = -swing * 0.95;
      armLeft.rotation.x = -swing * 0.9;
      armRight.rotation.x = swing * 0.9;
      armLeft.rotation.z = armRight.rotation.z = 0;
      torsoRig.position.y = Math.abs(Math.cos(hero.stride)) * 0.1 * effort;
    } else {
      legLeft.rotation.x = 0.5;
      legRight.rotation.x = -0.4;
      armLeft.rotation.x = armRight.rotation.x = -2.6;
      armLeft.rotation.z = -0.3;
      armRight.rotation.z = 0.3;
      torsoRig.position.y = 0;
    }
    if (hero.held) {
      armLeft.rotation.x = armRight.rotation.x = -3.0;
      armLeft.rotation.z = -0.15;
      armRight.rotation.z = 0.15;
    }
    torsoRig.rotation.x = effort * 0.12;
    figure.position.set(hero.x, hero.y, hero.z);
    figure.rotation.y = hero.facing;
  };

  Object.assign(BI, { figure, animateFigure });
})();

