// raycaster.js — Maps click / tap on the canvas to clickable Three.js objects
// and triggers the info panel.
import * as THREE from 'three';
import { showBodyInfo } from './ui.js';

export function initRaycaster(camera, renderer, clickable) {
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 6;
  const pointer = new THREE.Vector2();

  function cast(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x =  ((clientX - rect.left) / rect.width)  * 2 - 1;
    pointer.y = -((clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    // Flatten groups: check meshes in groups and also standalone meshes
    const targets = [];
    clickable.forEach(obj => {
      if (obj.isMesh) targets.push(obj);
      else if (obj.isGroup) obj.traverse(c => { if (c.isMesh) targets.push(c); });
    });

    const hits = raycaster.intersectObjects(targets, false);
    if (hits.length > 0) {
      let obj = hits[0].object;
      // Walk up to find a userData.bodyId
      while (obj && !obj.userData.bodyId) obj = obj.parent;
      if (obj && obj.userData.bodyId) {
        showBodyInfo(obj.userData.bodyId);
      }
    }
  }

  renderer.domElement.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('.ui-layer')) return;
    cast(e.clientX, e.clientY);
  });

  renderer.domElement.addEventListener('touchend', (e) => {
    if (e.target.closest && e.target.closest('.ui-layer')) return;
    const t = e.changedTouches[0];
    cast(t.clientX, t.clientY);
  }, { passive: true });
}
