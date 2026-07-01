// controls.js — Free spectator camera: WASD + mouse-look + wheel zoom on desktop,
// virtual joystick + touch-rotate + pinch-zoom on mobile.
import * as THREE from 'three';

export function isMobileDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0 && window.innerWidth < 1000);
}

export class SpectatorControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.dom = domElement;
    this.moveSpeed = 60;
    this.yaw = -Math.PI / 2;
    this.pitch = -0.15;
    this.keys = {};
    this.enabled = true;
    this.mobile = isMobileDevice();
    this.joystick = { active: false, x: 0, y: 0 };

    this._bindDesktop();
    if (this.mobile) this._bindMobileUI();
  }

  _bindDesktop() {
    window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

    let dragging = false;
    let lastX = 0, lastY = 0;

    this.dom.addEventListener('mousedown', (e) => {
      if (e.target.closest && e.target.closest('.ui-layer')) return;
      dragging = true; lastX = e.clientX; lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!dragging || !this.enabled) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      this.yaw -= dx * 0.0028;
      this.pitch -= dy * 0.0028;
      this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch));
    });

    this.dom.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      this.camera.position.addScaledVector(dir, -e.deltaY * 0.05);
    }, { passive: true });
  }

  _bindMobileUI() {
    const zone = document.getElementById('joystickZone');
    const stick = document.getElementById('joystickStick');
    const base = document.getElementById('joystickBase');
    if (!zone || !stick || !base) return;

    const startJoy = (touch) => {
      const rect = base.getBoundingClientRect();
      this.joystick.baseX = rect.left + rect.width / 2;
      this.joystick.baseY = rect.top + rect.height / 2;
      this.joystick.active = true;
    };
    const moveJoy = (touch) => {
      if (!this.joystick.active) return;
      let dx = touch.clientX - this.joystick.baseX;
      let dy = touch.clientY - this.joystick.baseY;
      const max = 40;
      const len = Math.hypot(dx, dy);
      if (len > max) { dx = dx / len * max; dy = dy / len * max; }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joystick.x = dx / max;
      this.joystick.y = dy / max;
    };
    const endJoy = () => {
      this.joystick.active = false;
      this.joystick.x = 0; this.joystick.y = 0;
      stick.style.transform = 'translate(0px, 0px)';
    };

    zone.addEventListener('touchstart', (e) => { startJoy(e.touches[0]); moveJoy(e.touches[0]); e.preventDefault(); }, { passive: false });
    zone.addEventListener('touchmove', (e) => { moveJoy(e.touches[0]); e.preventDefault(); }, { passive: false });
    zone.addEventListener('touchend', () => endJoy(), { passive: false });

    let lastTouches = null;
    this.dom.addEventListener('touchstart', (e) => {
      if (e.target.closest && (e.target.closest('.ui-layer') || e.target.closest('#joystickZone'))) return;
      lastTouches = Array.from(e.touches).map(t => ({ clientX: t.clientX, clientY: t.clientY }));
    }, { passive: true });

    this.dom.addEventListener('touchmove', (e) => {
      if (e.target.closest && (e.target.closest('.ui-layer') || e.target.closest('#joystickZone'))) return;
      if (!this.enabled || !lastTouches) return;
      const touches = Array.from(e.touches);
      if (touches.length === 1 && lastTouches.length === 1) {
        const dx = touches[0].clientX - lastTouches[0].clientX;
        const dy = touches[0].clientY - lastTouches[0].clientY;
        this.yaw -= dx * 0.004;
        this.pitch -= dy * 0.004;
        this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch));
      } else if (touches.length === 2 && lastTouches.length === 2) {
        const d0 = Math.hypot(lastTouches[0].clientX - lastTouches[1].clientX, lastTouches[0].clientY - lastTouches[1].clientY);
        const d1 = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
        const dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        this.camera.position.addScaledVector(dir, (d1 - d0) * 0.12);
      }
      lastTouches = touches.map(t => ({ clientX: t.clientX, clientY: t.clientY }));
    }, { passive: true });

    this.dom.addEventListener('touchend', (e) => {
      lastTouches = Array.from(e.touches).map(t => ({ clientX: t.clientX, clientY: t.clientY }));
    }, { passive: true });
  }

  update(dt) {
    if (!this.enabled) return;
    const cam = this.camera;
    cam.rotation.order = 'YXZ';
    cam.rotation.y = this.yaw;
    cam.rotation.x = this.pitch;

    const fwd = new THREE.Vector3(Math.sin(this.yaw) * Math.cos(this.pitch), 0, Math.cos(this.yaw) * Math.cos(this.pitch)).negate();
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();

    if (!this.mobile) {
      if (this.keys['KeyW']) move.add(fwd);
      if (this.keys['KeyS']) move.sub(fwd);
      if (this.keys['KeyA']) move.sub(right);
      if (this.keys['KeyD']) move.add(right);
      if (this.keys['Space']) move.y += 1;
      if (this.keys['ShiftLeft']) move.y -= 1;
    } else {
      move.addScaledVector(fwd, -this.joystick.y);
      move.addScaledVector(right, this.joystick.x);
    }

    if (move.lengthSq() > 0) {
      move.normalize();
      const boost = (!this.mobile && this.keys['ShiftRight']) ? 3 : 1;
      cam.position.addScaledVector(move, this.moveSpeed * boost * dt);
    }
  }
}
