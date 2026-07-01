// timeline.js — Simulation clock, stage progression, Antares trajectory, and
// per-stage side-effects (orbital perturbations, comet spawning, light changes).
import * as THREE from 'three';
import { STAGES } from './data.js';

const TOTAL_DURATION = 320; // seconds of real time for full simulation at speed×1

// Antares approaches from diagonally above-front, passes through at closest approach,
// then recedes out the other side — a hyperbolic flyby path.
function getAntaresPosition(t) {
  // t: 0..1 normalised simulation progress
  // We map t -> signed "s" from -1 (far approach) to +1 (far recession)
  const s = (t - 0.5) * 2; // -1..+1
  // Stage 11 (closest approach) maps to t≈0.77 -> s≈0.54
  // Use a hyperbola: x=cosh(s*2), y=sinh(s*2) style path
  const param = s * 2.5;
  const dist = 55 + 650 * (Math.cosh(param * 0.7) - 1); // distance from sun
  const angle = -Math.PI / 4; // approach angle in XZ plane
  const tilt = Math.PI / 6;   // approach from slightly above
  return new THREE.Vector3(
    Math.cos(angle) * dist,
    Math.sin(tilt) * dist * 0.4,
    Math.sin(angle) * dist
  );
}

// Spawn transient comets from Oort / Kuiper belt regions as glowing streaks.
function spawnComet(scene, cometList, stageId) {
  const isLong = stageId <= 7;
  const startR = isLong ? (260 + Math.random() * 80) : (182 + Math.random() * 48);
  const theta = Math.random() * Math.PI * 2;
  const phi = isLong ? (Math.acos(2 * Math.random() - 1)) : (Math.PI * 0.5 + (Math.random() - 0.5) * 0.4);
  const start = new THREE.Vector3(
    startR * Math.sin(phi) * Math.cos(theta),
    startR * Math.sin(phi) * Math.sin(theta),
    startR * Math.cos(phi)
  );
  // Head toward a random inner-system point
  const target = new THREE.Vector3((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 60);
  const dir = target.clone().sub(start).normalize();
  const speed = 1.2 + Math.random() * 2.0;
  const length = 18 + Math.random() * 30;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(6);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.LineBasicMaterial({
    color: isLong ? 0xaaddff : 0xccffee,
    transparent: true,
    opacity: 0.85,
    linewidth: 1
  });
  const line = new THREE.Line(geometry, mat);
  scene.add(line);

  const comet = { pos: start.clone(), dir, speed, length, line, life: 1, isLong, geometry, positions };
  cometList.push(comet);
}

function updateComets(cometList, scene, dt) {
  for (let i = cometList.length - 1; i >= 0; i--) {
    const c = cometList[i];
    c.pos.addScaledVector(c.dir, c.speed * dt * 40);
    const tail = c.pos.clone().addScaledVector(c.dir, -c.length);

    c.positions[0] = tail.x; c.positions[1] = tail.y; c.positions[2] = tail.z;
    c.positions[3] = c.pos.x; c.positions[4] = c.pos.y; c.positions[5] = c.pos.z;
    c.geometry.attributes.position.needsUpdate = true;

    c.life -= dt * 0.08;
    c.line.material.opacity = Math.max(0, c.life * 0.85);

    if (c.pos.length() < 8 || c.life <= 0) {
      scene.remove(c.line);
      c.geometry.dispose();
      c.line.material.dispose();
      cometList.splice(i, 1);
    }
  }
}

export class Timeline {
  constructor(scene, registry, lights) {
    this.scene = scene;
    this.registry = registry;
    this.lights = lights;
    this.elapsed = 0; // real seconds elapsed
    this.speed = 1;
    this.paused = false;
    this.currentStage = 0;
    this.comets = [];
    this._cometTimer = 0;
    this._perturbAngles = {};
    this._onStageChange = null;
    this._dayCounter = 0;
  }

  onStageChange(fn) { this._onStageChange = fn; }

  get progress() { return Math.min(this.elapsed / TOTAL_DURATION, 1); }
  get stageIndex() { return this.currentStage; }
  get stage() { return STAGES[this.currentStage]; }

  play()    { this.paused = false; }
  pause()   { this.paused = true; }
  restart() { this.elapsed = 0; this.currentStage = 0; this.comets.forEach(c => { this.scene.remove(c.line); }); this.comets = []; this._cometTimer = 0; }
  setSpeed(s) { this.speed = s; }

  update(dt) {
    if (this.paused) return;
    const scaledDt = dt * this.speed;
    this.elapsed = Math.min(this.elapsed + scaledDt, TOTAL_DURATION);
    this._dayCounter += scaledDt * 0.3; // simulated days

    const t = this.progress;

    // Determine current stage (stages share [0..1] range evenly)
    const stageStep = 1 / STAGES.length;
    const newStage = Math.min(Math.floor(t / stageStep), STAGES.length - 1);
    if (newStage !== this.currentStage) {
      this.currentStage = newStage;
      if (this._onStageChange) this._onStageChange(STAGES[newStage], newStage);
    }

    this._updateAntares(t, scaledDt);
    this._updateLights(t);
    this._updateComets(t, scaledDt);
    this._updateOrbitalEffects(t, scaledDt);
  }

  _updateAntares(t, scaledDt) {
    const antaresReg = this.registry['antares'];
    if (!antaresReg) return;
    const visible = t > 0.08; // show from stage 2 onward
    antaresReg.group.visible = visible;
    if (visible) {
      const pos = getAntaresPosition(t);
      antaresReg.group.position.copy(pos);
      this.lights.antaresLight.position.copy(pos);
      // rotate slowly
      if (antaresReg.mesh) antaresReg.mesh.rotation.y += scaledDt * 0.08;
    }
  }

  _updateLights(t) {
    // Antares red light grows in stages 4-11, fades from 12 onward
    const peak = 0.77; // stage 11
    let antaresIntensity = 0;
    if (t > 0.23 && t < peak) {
      antaresIntensity = THREE.MathUtils.smoothstep(t, 0.23, peak) * 3.5;
    } else if (t >= peak) {
      antaresIntensity = THREE.MathUtils.smoothstep(t, 1.0, peak) * 3.5;
    }
    this.lights.antaresLight.intensity = antaresIntensity;

    // Tint ambient slightly red as Antares dominates sky
    const redTint = Math.min(antaresIntensity / 3.5, 1);
    const ambColor = new THREE.Color().lerpColors(
      new THREE.Color(0x222233),
      new THREE.Color(0x442211),
      redTint * 0.7
    );
    this.lights.ambient.color.copy(ambColor);

    // Scene background shifts to deep red at closest approach
    const bgColor = new THREE.Color().lerpColors(
      new THREE.Color(0x000000),
      new THREE.Color(0x1a0500),
      redTint * 0.9
    );
    this.scene.background = bgColor;
  }

  _updateComets(t, scaledDt) {
    // Stage 6+ (t>0.38): spawn long-period comets from Oort
    // Stage 7+ (t>0.46): spawn shorter Kuiper comets too
    updateComets(this.comets, this.scene, scaledDt);

    if (t < 0.38) return;
    this._cometTimer += scaledDt;
    const rate = t < 0.46 ? 4.5 : (t < 0.77 ? 2.0 : 5.5); // seconds between spawns
    if (this._cometTimer > rate) {
      this._cometTimer = 0;
      const stageId = t < 0.46 ? 6 : 7;
      spawnComet(this.scene, this.comets, stageId);
      if (t > 0.54) spawnComet(this.scene, this.comets, stageId + 1); // extra
    }
  }

  _updateOrbitalEffects(t, scaledDt) {
    if (t < 0.46) return;
    // Apply progressive perturbation offsets to outer → inner planets as t grows
    const perturbTargets = [
      { id: 'neptune',  onset: 0.46, strength: 8 },
      { id: 'uranus',   onset: 0.50, strength: 6 },
      { id: 'saturn',   onset: 0.54, strength: 4 },
      { id: 'jupiter',  onset: 0.58, strength: 3 },
      { id: 'mars',     onset: 0.62, strength: 2 },
      { id: 'earth',    onset: 0.65, strength: 1.5 },
      { id: 'venus',    onset: 0.67, strength: 1.2 },
      { id: 'mercury',  onset: 0.69, strength: 1.0 }
    ];

    perturbTargets.forEach(({ id, onset, strength }) => {
      if (t < onset) return;
      if (!this._perturbAngles[id]) this._perturbAngles[id] = 0;
      const factor = THREE.MathUtils.smoothstep(t, onset, Math.min(onset + 0.15, 0.85));
      // recede after Antares leaves
      const recession = t > 0.85 ? THREE.MathUtils.smoothstep(t, 1.0, 0.85) : 1;
      const amp = factor * recession * strength;
      this._perturbAngles[id] += scaledDt * 0.8;
      const reg = this.registry[id];
      if (reg && reg.mesh) {
        const localOffset = Math.sin(this._perturbAngles[id]) * amp;
        reg.mesh.position.y = localOffset;
      }
    });

    // Belt turbulence: wobble opacity to simulate stirring
    const beltIds = ['asteroidBelt', 'kuiperBelt', 'oortCloud'];
    const beltOnset = [0.0, 0.42, 0.30];
    beltIds.forEach((id, idx) => {
      const reg = this.registry[id];
      if (!reg || !reg.group) return;
      const on = beltOnset[idx];
      if (t < on) return;
      const factor = THREE.MathUtils.smoothstep(t, on, on + 0.12);
      const points = reg.group.userData.points;
      if (points) {
        const base = reg.group.userData.baseOpacity || 0.6;
        points.material.opacity = base + factor * 0.25 * Math.sin(this._dayCounter * 1.5 + idx);
      }
    });
  }
}
