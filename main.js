// main.js — Application entry point. Wires all modules.
import * as THREE from 'three';
import { createRenderer, createScene, createCamera, createLights, createStarField, createMilkyWay, handleResize } from './sceneSetup.js';
import { buildBodies } from './bodies.js';
import { SpectatorControls } from './controls.js';
import { Timeline } from './timeline.js';
import { initUI, applyLang, updateTimelineUI, showStagePanel, updateHUD, getLang } from './ui.js';
import { initRaycaster } from './raycaster.js';
import { animate } from './animate.js';
import { STAGES } from './data.js';

const canvas = document.getElementById('threeCanvas');

const renderer = createRenderer(canvas);
const scene = createScene();
const camera = createCamera();
const lights = createLights(scene);

scene.add(createStarField());
scene.add(createMilkyWay());

const { registry, clickable } = buildBodies(scene);
const controls = new SpectatorControls(camera, canvas);
const timeline = new Timeline(scene, registry, lights);

// Stage change handler
timeline.onStageChange((stage, idx) => {
  showStagePanel(stage, getLang());
});

// Initialize UI
initUI(timeline, (lang) => {
  updateHUD(lang);
});

// Show stage panel for first stage
showStagePanel(STAGES[0], getLang());

// Raycasting for object selection
initRaycaster(camera, renderer, clickable);

// Language toggle
document.getElementById('langToggle').addEventListener('click', () => {
  const next = getLang() === 'en' ? 'ta' : 'en';
  applyLang(next);
  updateHUD(next);
  // re-show current stage description in new lang
  showStagePanel(STAGES[timeline.stageIndex], next);
});

// Resize handling
handleResize(camera, renderer);

// Orbit labels (small dots on orbit rings for reference)
buildOrbitLines(scene, registry);

// Start the loop
animate({
  renderer, scene, camera, controls, timeline, registry,
  updateUI: () => {
    updateTimelineUI(timeline);
  }
});

// -------------------------------------------------------
// Helper: draw faint orbit circles for all planets
// -------------------------------------------------------
function buildOrbitLines(scene, registry) {
  const orbitBodies = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','pluto'];
  const colors = {
    mercury: 0x666660, venus: 0x88774a, earth: 0x2244aa,
    mars: 0x773322, jupiter: 0x7a6a54, saturn: 0x8a7a5a,
    uranus: 0x4a8890, neptune: 0x334488, pluto: 0x776655
  };
  orbitBodies.forEach(id => {
    const reg = registry[id];
    if (!reg) return;
    const r = reg.data.orbitRadius;
    const segments = 128;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
    }
    // For moons, orbit is relative to parent so skip global orbit line
    if (reg.data.parent) return;
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: colors[id] || 0x444444,
      transparent: true,
      opacity: 0.18
    });
    scene.add(new THREE.Line(geometry, material));
  });
}
