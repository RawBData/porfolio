/*
 * 8c. Keyboard & Touch Joystick Controls
 */
(() => {
  'use strict';

  const BI = window.BI;
  if (!BI.hasWebGL) return;

  const { $, dom, ui, setResume, closeCard, toggleCard, thenRefocus, hero, grabOrThrow, rebuild, handleClick } = BI;

  const keys = {};
  const joystick = { pointerId: null, originX: 0, originY: 0, x: 0, y: 0, startedAt: 0, travel: 0 };
  const JOYSTICK_RANGE = 48;
  const TAP = { maxTravel: 10, maxDuration: 350 };

  const KEY_DIRECTIONS = {
    a: [-1, 0], ArrowLeft: [-1, 0], d: [1, 0], ArrowRight: [1, 0],
    w: [0, -1], ArrowUp: [0, -1], s: [0, 1], ArrowDown: [0, 1],
  };
  const SCROLL_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
  const normaliseKey = (event) => (event.key.length === 1 ? event.key.toLowerCase() : event.key);

  const readMoveInput = () => {
    let [x, z] = [joystick.x, joystick.y];
    Object.entries(KEY_DIRECTIONS).forEach(([key, [dx, dz]]) => { if (keys[key]) { x += dx; z += dz; } });
    const length = Math.hypot(x, z);
    return length > 1 ? [x / length, z / length] : [x, z];
  };

  const KEY_ACTIONS = {
    ' ': () => { hero.wantsJump = true; },
    Enter: toggleCard, e: toggleCard, r: rebuild, f: grabOrThrow,
  };

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { (ui.resumeOpen ? () => setResume(false) : closeCard)(); return; }
    if (ui.resumeOpen) return;
    const key = normaliseKey(event);
    if (['BUTTON', 'A'].includes(event.target.tagName) && (key === ' ' || key === 'Enter')) return;
    if (SCROLL_KEYS.includes(key)) event.preventDefault();
    if (!event.repeat && KEY_ACTIONS[key]) KEY_ACTIONS[key]();
    keys[key] = true;
  });
  window.addEventListener('keyup', (event) => { keys[normaliseKey(event)] = false; });
  window.addEventListener('blur', () => { Object.keys(keys).forEach((key) => { keys[key] = false; }); });

  const joystickKnob = dom.joystick.firstElementChild;
  dom.canvas.addEventListener('pointerdown', (event) => {
    dom.canvas.focus();
    if (event.pointerType === 'mouse') {
      if (event.button === 0) handleClick(event.clientX, event.clientY);
      return;
    }
    dom.jumpButton.hidden = dom.grabButton.hidden = false;
    if (joystick.pointerId !== null) return;
    Object.assign(joystick, {
      pointerId: event.pointerId, originX: event.clientX, originY: event.clientY,
      x: 0, y: 0, startedAt: performance.now(), travel: 0,
    });
    dom.joystick.hidden = false;
    dom.joystick.style.left = `${event.clientX}px`;
    dom.joystick.style.top = `${event.clientY}px`;
    joystickKnob.style.transform = '';
  });

  window.addEventListener('pointermove', (event) => {
    if (event.pointerId !== joystick.pointerId) return;
    let [dx, dy] = [event.clientX - joystick.originX, event.clientY - joystick.originY];
    const length = Math.hypot(dx, dy);
    joystick.travel = Math.max(joystick.travel, length);
    if (length > JOYSTICK_RANGE) { dx *= JOYSTICK_RANGE / length; dy *= JOYSTICK_RANGE / length; }
    joystick.x = dx / JOYSTICK_RANGE;
    joystick.y = dy / JOYSTICK_RANGE;
    joystickKnob.style.transform = `translate(${dx}px,${dy}px)`;
  });

  const endJoystick = (event) => {
    if (event.pointerId !== joystick.pointerId) return;
    Object.assign(joystick, { pointerId: null, x: 0, y: 0 });
    dom.joystick.hidden = true;
    const wasTap = event.type === 'pointerup' && joystick.travel < TAP.maxTravel && performance.now() - joystick.startedAt < TAP.maxDuration;
    if (wasTap) handleClick(event.clientX, event.clientY);
  };
  window.addEventListener('pointerup', endJoystick);
  window.addEventListener('pointercancel', endJoystick);

  const onPress = (el, fn) => el.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(); });
  onPress(dom.jumpButton, KEY_ACTIONS[' ']);
  onPress(dom.grabButton, grabOrThrow);
  $('btnRebuild').addEventListener('click', thenRefocus(rebuild));

  Object.assign(BI, { readMoveInput });
})();
