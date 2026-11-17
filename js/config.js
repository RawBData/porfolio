/*
 * 1. Config & Shared Utilities
 * Tunable constants, color palette, map layout, and DRY math/DOM helpers.
 */
(() => {
  'use strict';

  const BI = (window.BI = window.BI || {});
  BI.CONTENT = window.PORTFOLIO;
  BI.T = window.THREE;

  const COLORS = {
    red: '#d8352a', yellow: '#f6c21c', blue: '#1e6fd9', green: '#3aa655',
    paper: '#fffdf5', ink: '#1b2333', muted: '#5a6478', stone: '#7b8494',
    stoneLight: '#9aa2b1', steel: '#4a5366', navy: '#24467a', skin: '#eec39a',
    bark: '#8a5a2e', leafDark: '#2f8a45', leafLight: '#45ad5a', grassA: '#3fa654',
    grassB: '#45ad5a', path: '#e9c98a', sand: '#e3d3a2', sea: '#2f9fe0', sky: '#9bdcff',
  };
  const LIGHT_COLORS = ['yellow', 'paper'];
  const inkFor = (colorName) => (LIGHT_COLORS.includes(colorName) ? COLORS.ink : '#ffffff');

  const WORLD = {
    half: 30,
    studHeight: 0.16,
    studRadius: 0.3,
    ring: { x: 17, z: 13 },
    pathWidth: 1.15,
    spawn: { x: 0, z: 9 },
    padOffset: 4,
    padRadius: 2.5,
    treeCount: 16,
    pileSpots: [[8, -9], [-8, -9], [26, 17], [-26, -22], [11, -25], [-27, 24]],
    nameRows: [{ text: 'BEN', z: -4 }, { text: 'RAWNER', z: 2 }],
    fallLimit: -26,
    ramp: { x0: -19, x1: -12, z: -26.5, width: 4, height: 3 },
  };

  const ZONE_SPOTS = {
    about: [8, 7.5], sfrider: [-22, 4], wordstar: [-22, -12], checkoff: [-10, -20],
    tower: [4, -22], freelance: [18, -18], braindo: [23, -6], behb: [22, 6],
    skills: [-16, 17], education: [-3, 19], contact: [16, 19],
  };

  const HERO = {
    speed: 9.5, jump: 10, radius: 0.55, stepUp: 0.4,
    grabReach: 2.3, clickReach: 1.9, carryHeight: 3.35,
    throwSpeed: 15, throwLift: 7.5,
    bikeSpeed: 21, bikeReach: 2.6,
  };

  const PHYSICS = {
    gravity: 28, bounce: 0.32, groundFriction: 5, spinFriction: 3.5,
    settleTime: 0.7, throwGrace: 0.4, maxStep: 1 / 30,
  };

  const CAMERA = { fov: 38, height: 24, back: 22, lookAhead: 2.5 };
  const STATE = Object.freeze({ HOME: 0, AWAKE: 1, SETTLED: 2, LOST: 3, HELD: 4 });
  const RADIUS = { unit: 0.48, plank: 0.7, canopyLarge: 1.3, canopySmall: 0.95 };
  const BRICK_COLORS = ['red', 'yellow', 'blue', 'paper'];

  const PIXEL_FONT = {
    B: ['110', '101', '110', '101', '110'],
    E: ['111', '100', '110', '100', '111'],
    N: ['1001', '1101', '1011', '1001', '1001'],
    R: ['110', '101', '110', '101', '101'],
    A: ['010', '101', '111', '101', '101'],
    W: ['10001', '10001', '10101', '10101', '01010'],
  };

  const FONTS = {
    display: "Fredoka,'Trebuchet MS',sans-serif",
    body: "'Atkinson Hyperlegible','Segoe UI',sans-serif",
  };

  const $ = (id) => document.getElementById(id);
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const dist2D = (x1, z1, x2, z2) => Math.hypot(x1 - x2, z1 - z2);
  const HALF_PI = Math.PI / 2;
  const ROUGHNESS = 0.42;

  Object.assign(BI, {
    COLORS, LIGHT_COLORS, inkFor, WORLD, ZONE_SPOTS, HERO, PHYSICS, CAMERA,
    STATE, RADIUS, BRICK_COLORS, PIXEL_FONT, FONTS, $, clamp, dist2D, HALF_PI, ROUGHNESS,
  });
})();

