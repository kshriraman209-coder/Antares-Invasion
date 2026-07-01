// sceneSetup.js — Renderer, camera, lighting, starfield, and Milky Way backdrop.
import * as THREE from 'three';

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  return renderer;
}

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.0009);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 20000
  );
  camera.position.set(0, 40, 110);
  return camera;
}

export function createLights(scene) {
  const ambient = new THREE.AmbientLight(0x222233, 0.6);
  scene.add(ambient);

  const sunLight = new THREE.PointLight(0xfff2d8, 4.5, 0, 0.6);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Secondary light representing Antares' growing red glow — intensity is animated by timeline.js
  const antaresLight = new THREE.PointLight(0xff3311, 0, 0, 0.5);
  antaresLight.position.set(0, 0, 0);
  scene.add(antaresLight);

  return { ambient, sunLight, antaresLight };
}

// Procedural star field made of points, scattered on a huge sphere shell.
export function createStarField(count = 9000, radius = 6000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xbfd4ff),
    new THREE.Color(0xfff0d0),
    new THREE.Color(0xffd6c4)
  ];

  for (let i = 0; i < count; i++) {
    const r = radius * (0.6 + Math.random() * 0.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.9
  });

  return new THREE.Points(geometry, material);
}

// Procedural Milky Way band: a large flattened ellipsoid of soft points forming a galactic band.
export function createMilkyWay(count = 14000, radius = 5800) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tilt = 0.55;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    // Concentrate points near a band (galactic plane) using a narrow gaussian-ish spread
    const bandSpread = (Math.random() - 0.5) * 0.35;
    const r = radius * (0.8 + Math.random() * 0.2);

    let x = r * Math.cos(theta);
    let z = r * Math.sin(theta);
    let y = r * bandSpread;

    // tilt the band
    const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const y2 = y * cosT - z * sinT;
    const z2 = y * sinT + z * cosT;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y2;
    positions[i * 3 + 2] = z2;

    const brightness = 0.4 + Math.random() * 0.5;
    const warm = Math.random() > 0.5;
    colors[i * 3] = brightness * (warm ? 1.0 : 0.8);
    colors[i * 3 + 1] = brightness * (warm ? 0.85 : 0.9);
    colors[i * 3 + 2] = brightness * (warm ? 0.7 : 1.0);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 3.2,
    vertexColors: true,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

export function handleResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
