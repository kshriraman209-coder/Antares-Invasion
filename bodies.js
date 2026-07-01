// bodies.js — Builds Three.js meshes for every celestial body, using procedurally
// generated canvas textures (no external image assets required, keeps the project
// fully self-contained and offline-capable).
import * as THREE from 'three';
import { BODIES } from './data.js';

// ---------- Procedural texture helpers ----------

function hexToRgb(hex) {
  return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255 };
}

function shade(c, amt) {
  return {
    r: Math.max(0, Math.min(255, c.r + amt)),
    g: Math.max(0, Math.min(255, c.g + amt)),
    b: Math.max(0, Math.min(255, c.b + amt))
  };
}

function rgbStr({ r, g, b }, a = 1) {
  return `rgba(${r | 0},${g | 0},${b | 0},${a})`;
}

// Creates a mottled planet-surface texture with bands/spots for visual variety.
function createPlanetTexture(baseColorHex, { banded = false, spotty = true, size = 512 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size / 2;
  const ctx = canvas.getContext('2d');
  const base = hexToRgb(baseColorHex);

  // base fill
  ctx.fillStyle = rgbStr(base);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (banded) {
    const bandCount = 10 + Math.floor(Math.random() * 6);
    for (let i = 0; i < bandCount; i++) {
      const y = (i / bandCount) * canvas.height;
      const h = canvas.height / bandCount;
      const variance = (Math.random() - 0.5) * 50;
      ctx.fillStyle = rgbStr(shade(base, variance));
      ctx.globalAlpha = 0.55;
      ctx.fillRect(0, y, canvas.width, h);
    }
    ctx.globalAlpha = 1;
  }

  if (spotty) {
    const spots = Math.floor(size * 0.6);
    for (let i = 0; i < spots; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * (size / 60) + 1;
      const variance = (Math.random() - 0.5) * 60;
      ctx.fillStyle = rgbStr(shade(base, variance), 0.25);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createSunTexture(baseColorHex) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size / 2;
  const ctx = canvas.getContext('2d');
  const base = hexToRgb(baseColorHex);
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, rgbStr(shade(base, 40)));
  grad.addColorStop(0.5, rgbStr(base));
  grad.addColorStop(1, rgbStr(shade(base, -30)));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 6 + 1;
    ctx.fillStyle = rgbStr(shade(base, (Math.random() - 0.5) * 70), 0.3);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRingTexture(baseColorHex) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = 1;
  const ctx = canvas.getContext('2d');
  const base = hexToRgb(baseColorHex);
  for (let x = 0; x < size; x++) {
    const alpha = 0.2 + Math.random() * 0.6;
    const variance = (Math.random() - 0.5) * 40;
    ctx.fillStyle = rgbStr(shade(base, variance), alpha);
    ctx.fillRect(x, 0, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGlowSprite(colorHex, scale) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const c = hexToRgb(colorHex);
  grad.addColorStop(0, rgbStr(c, 0.9));
  grad.addColorStop(0.4, rgbStr(c, 0.35));
  grad.addColorStop(1, rgbStr(c, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

// ---------- Body construction ----------

export function buildBodies(scene) {
  const registry = {}; // id -> { data, group, mesh, orbitAngle, pivot }
  const clickable = [];

  BODIES.forEach((data) => {
    if (data.type === 'belt' || data.type === 'cloud') {
      const group = buildScatterRegion(data);
      scene.add(group);
      registry[data.id] = { data, group, isField: true };
      group.userData.bodyId = data.id;
      clickable.push(group);
      return;
    }

    if (data.id === 'antares') {
      const { group, mesh } = buildStar(data, 0xff3311);
      scene.add(group);
      registry[data.id] = { data, group, mesh, orbitAngle: 0 };
      mesh.userData.bodyId = data.id;
      clickable.push(mesh);
      group.visible = false; // hidden until timeline activates the encounter
      return;
    }

    if (data.id === 'sun') {
      const { group, mesh } = buildStar(data, 0xffcc33);
      scene.add(group);
      registry[data.id] = { data, group, mesh, orbitAngle: 0 };
      mesh.userData.bodyId = data.id;
      clickable.push(mesh);
      return;
    }

    // Standard planet / moon / dwarf
    const pivot = new THREE.Object3D(); // orbit pivot
    const angle = Math.random() * Math.PI * 2;
    pivot.rotation.y = angle;

    const mesh = buildPlanetMesh(data);
    mesh.position.set(data.orbitRadius || 0, 0, 0);
    pivot.add(mesh);

    let parentObj = scene;
    if (data.parent && registry[data.parent]) {
      parentObj = registry[data.parent].mesh;
    }
    parentObj.add(pivot);

    if (data.hasRings) {
      const ring = buildRings(data);
      mesh.add(ring);
    }

    if (data.atmosphere) {
      const atmo = buildAtmosphere(data);
      mesh.add(atmo);
    }

    mesh.userData.bodyId = data.id;
    clickable.push(mesh);
    registry[data.id] = { data, group: pivot, mesh, orbitAngle: angle };
  });

  return { registry, clickable };
}

function buildPlanetMesh(data) {
  const texture = createPlanetTexture(data.color, { banded: data.id === 'jupiter' || data.id === 'saturn' || data.id === 'uranus' || data.id === 'neptune' });
  const geometry = new THREE.SphereGeometry(data.renderRadius, 48, 32);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.85,
    metalness: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

function buildRings(data) {
  const inner = data.renderRadius * 1.4;
  const outer = data.renderRadius * 2.3;
  const geometry = new THREE.RingGeometry(inner, outer, 64);
  // Map UVs radially for the ring gradient texture
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const dist = v3.length();
    const u = (dist - inner) / (outer - inner);
    uv.setXY(i, u, 0.5);
  }
  const texture = createRingTexture(data.color);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2.1;
  return ring;
}

function buildAtmosphere(data) {
  const geometry = new THREE.SphereGeometry(data.renderRadius * 1.06, 32, 24);
  const material = new THREE.MeshBasicMaterial({
    color: data.atmosphere,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });
  return new THREE.Mesh(geometry, material);
}

function buildStar(data, glowColor) {
  const group = new THREE.Group();
  const texture = createSunTexture(data.color);
  const geometry = new THREE.SphereGeometry(data.renderRadius, 48, 32);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  const glow = createGlowSprite(glowColor, data.renderRadius * 7);
  group.add(glow);
  return { group, mesh };
}

// Asteroid Belt / Kuiper Belt / Oort Cloud — instanced point clouds in a torus/shell shape.
function buildScatterRegion(data) {
  const group = new THREE.Group();
  const count = data.count;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const isCloud = data.type === 'cloud';

  for (let i = 0; i < count; i++) {
    const r = THREE.MathUtils.lerp(data.orbitRadiusInner, data.orbitRadiusOuter, Math.random());
    const theta = Math.random() * Math.PI * 2;
    let y;
    if (isCloud) {
      // spherical shell distribution
      const phi = Math.acos(2 * Math.random() - 1);
      const rr = r;
      positions[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = rr * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = rr * Math.cos(phi);
      continue;
    } else {
      y = (Math.random() - 0.5) * (data.id === 'kuiperBelt' ? 6 : 2);
    }
    positions[i * 3] = r * Math.cos(theta);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = r * Math.sin(theta);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: data.color,
    size: isCloud ? 1.1 : 0.6,
    sizeAttenuation: true,
    transparent: true,
    opacity: isCloud ? 0.45 : 0.8
  });
  const points = new THREE.Points(geometry, material);
  group.add(points);
  group.userData.points = points;
  group.userData.baseOpacity = material.opacity;
  return group;
}
