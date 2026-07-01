// animate.js — Main render loop. Handles orbital motion and rotation of all bodies.
import * as THREE from 'three';
import { BODIES } from './data.js';

// Store per-body angle state separately so we don't clobber Three.js internals.
const orbitAngles = {};
const DAYS_PER_SECOND = 8; // simulation speed factor for orbits at ×1

export function animate({ renderer, scene, camera, controls, timeline, registry, updateUI }) {
  let lastTime = performance.now();

  function loop() {
    requestAnimationFrame(loop);

    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1); // cap at 100ms
    lastTime = now;

    const scaledDt = dt * timeline.speed;
    const simDays = DAYS_PER_SECOND * scaledDt;

    // Camera controls
    controls.update(dt);

    // Orbit + rotation of planets/moons
    BODIES.forEach((data) => {
      if (data.type === 'belt' || data.type === 'cloud') return;
      const reg = registry[data.id];
      if (!reg) return;

      if (data.orbitRadius && data.orbitSpeed && reg.group && data.id !== 'antares') {
        if (!orbitAngles[data.id]) orbitAngles[data.id] = Math.random() * Math.PI * 2;
        orbitAngles[data.id] += data.orbitSpeed * simDays;
        reg.group.rotation.y = orbitAngles[data.id];
      }

      // Self-rotation
      if (reg.mesh && data.rotSpeed) {
        reg.mesh.rotation.y += data.rotSpeed * simDays;
      }
    });

    // Slight axial tilt on select planets
    applyAxialTilts(registry);

    // Belt/cloud gentle slow rotation
    const beltIds = ['asteroidBelt', 'kuiperBelt'];
    beltIds.forEach(id => {
      const reg = registry[id];
      if (reg && reg.group) reg.group.rotation.y += 0.00008 * scaledDt;
    });

    // Timeline advancement
    timeline.update(dt);
    updateUI(dt);

    renderer.render(scene, camera);
  }

  loop();
}

let tiltApplied = false;
function applyAxialTilts(registry) {
  if (tiltApplied) return;
  tiltApplied = true;
  const tilts = {
    earth: 23.4, mars: 25.2, saturn: 26.7, neptune: 28.3, uranus: 97.8
  };
  Object.entries(tilts).forEach(([id, deg]) => {
    const reg = registry[id];
    if (reg && reg.mesh) {
      reg.mesh.rotation.z = THREE.MathUtils.degToRad(deg);
    }
  });
}
