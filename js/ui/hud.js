/*
 * 4. Interface & HUD
 * Plain DOM state for detail cards, résumé view, toast notifications, and zone counters.
 */
(() => {
  'use strict';

  const BI = window.BI;
  const { $, T, WORLD, ZONES, resumeHTML, dist2D } = BI;

  const dom = {
    canvas: $('stage'), card: $('card'), resume: $('resume'),
    prompt: $('prompt'), toast: $('toast'), openButton: $('btnOpen'),
    grabButton: $('grab'), jumpButton: $('jump'), joystick: $('joy'),
  };
  const ui = { activeZone: null, openZone: null, resumeOpen: false, toastTimer: 0 };
  const isWideScreen = () => window.innerWidth > 720;

  const setResume = (open) => {
    ui.resumeOpen = open;
    dom.resume.hidden = !open;
    (open ? $('resumeClose') : dom.canvas).focus();
  };

  const openCard = (zone) => {
    ui.openZone = zone;
    dom.card.style.setProperty('--zone', zone.color);
    dom.card.style.setProperty('--zone-ink', zone.ink);
    $('cardKind').textContent = zone.kind;
    $('cardTitle').textContent = zone.title;
    $('cardBody').innerHTML = zone.html;
    dom.card.hidden = false;
    dom.card.scrollTop = 0;
    dom.prompt.classList.add('open');
  };

  const closeCard = () => {
    ui.openZone = null; dom.card.hidden = true; dom.prompt.classList.remove('open');
  };

  const toggleCard = () => {
    if (ui.activeZone) (ui.openZone === ui.activeZone ? closeCard : () => openCard(ui.activeZone))();
  };

  const say = (message) => {
    dom.toast.textContent = message; dom.toast.hidden = false;
    clearTimeout(ui.toastTimer);
    ui.toastTimer = setTimeout(() => { dom.toast.hidden = true; }, 2600);
  };

  const thenRefocus = (handler) => () => { handler(); dom.canvas.focus(); };

  $('sheet').innerHTML = resumeHTML();
  $('resumeClose').addEventListener('click', () => setResume(false));
  $('btnResume').addEventListener('click', () => setResume(true));
  $('cardClose').addEventListener('click', thenRefocus(closeCard));
  dom.openButton.addEventListener('click', thenRefocus(toggleCard));
  $('nudge').addEventListener('click', thenRefocus(toggleCard));

  const hasWebGL = (() => {
    try {
      const probe = document.createElement('canvas');
      return Boolean(T && (probe.getContext('webgl') || probe.getContext('experimental-webgl')));
    } catch (e) { return false; }
  })();
  if (!hasWebGL) {
    ['who', 'tools', 'score', 'resumeClose'].forEach((id) => { $(id).hidden = true; });
    setResume(true);
  }

  const found = new Set();
  const hud = { found: $('found'), knocked: $('knocked'), lastKnocked: -1 };

  const stepZones = () => {
    const { hero, stats } = BI;
    const zone = hero.y < -1 ? null : ZONES.find(({ pad }) => dist2D(hero.x, hero.z, pad[0], pad[1]) < WORLD.padRadius) || null;
    if (zone !== ui.activeZone) {
      ui.activeZone = zone;
      if (!zone) { dom.prompt.hidden = true; closeCard(); }
      else {
        if (!found.has(zone.id)) {
          found.add(zone.id);
          hud.found.textContent = `Found ${found.size} of ${ZONES.length}`;
          if (found.size === ZONES.length) say(`That's all ${ZONES.length}. Thanks for exploring.`);
        }
        dom.openButton.textContent = zone.title;
        dom.prompt.hidden = isWideScreen();
        if (isWideScreen()) openCard(zone);
      }
    }
    if (stats.knocked !== hud.lastKnocked) {
      hud.lastKnocked = stats.knocked;
      hud.knocked.textContent = `Bricks knocked ${stats.knocked}`;
    }
  };

  Object.assign(BI, { dom, ui, setResume, openCard, closeCard, toggleCard, say, thenRefocus, hasWebGL, stepZones });
})();
