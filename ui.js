// ui.js — Info panel, timeline controls, stage display, language switching, HUD.
import { UI_STRINGS, TYPE_LABEL_KEY, BODIES } from './data.js';

let currentLang = 'en';
let onLangChange = null;
const bodyMap = {};
BODIES.forEach(b => { bodyMap[b.id] = b; });

export function getLang() { return currentLang; }

export function initUI(timeline, onLang) {
  onLangChange = onLang;
  _buildInfoPanel();
  _buildTimeline(timeline);
  _buildHUD();
  _buildMobileJoystick();
  applyLang(currentLang);
}

// ------------------------------------------------------------------
// LANGUAGE
// ------------------------------------------------------------------
export function applyLang(lang) {
  currentLang = lang;
  const s = UI_STRINGS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (s[key] !== undefined) el.textContent = s[key];
  });
  document.getElementById('langToggle').textContent = s.lang;
  if (onLangChange) onLangChange(lang);
}

// ------------------------------------------------------------------
// INFO PANEL
// ------------------------------------------------------------------
function _buildInfoPanel() {
  const panel = document.getElementById('infoPanel');
  panel.innerHTML = `
    <button class="close-btn" id="infoPanelClose" aria-label="Close">✕</button>
    <div class="info-name" id="infoPanelName"></div>
    <div class="info-type" id="infoPanelType"></div>
    <table class="info-table" id="infoPanelTable"></table>
    <div class="info-facts-title" data-i18n="facts"></div>
    <ul class="info-facts" id="infoPanelFacts"></ul>
    <div class="info-hypo-note" id="infoPanelNote"></div>
  `;
  document.getElementById('infoPanelClose').addEventListener('click', hideInfoPanel);
}

export function showInfoPanel(bodyId) {
  const panel = document.getElementById('infoPanel');
  const data = bodyMap[bodyId];
  if (!data) return;
  const s = UI_STRINGS[currentLang];
  const typeKey = TYPE_LABEL_KEY[data.type] || 'typePlanet';

  document.getElementById('infoPanelName').textContent = data.name[currentLang] || data.name.en;
  document.getElementById('infoPanelType').textContent = s[typeKey] || data.type;

  const rows = [
    [s.diameter,     data.realDiameterKm],
    [s.mass,         data.realMassKg],
    [s.gravity,      typeof data.realGravity === 'number' ? `${data.realGravity} m/s²` : data.realGravity],
    [s.temperature,  data.realTempC],
    [s.distFromSun,  data.realDistanceAU === 0 ? '—' : (typeof data.realDistanceAU === 'number' ? `${data.realDistanceAU} AU` : data.realDistanceAU)]
  ];

  const table = document.getElementById('infoPanelTable');
  table.innerHTML = rows.map(([label, val]) => `
    <tr><td class="info-label">${label}</td><td class="info-val">${val || '—'}</td></tr>
  `).join('');

  const facts = data.facts[currentLang] || data.facts.en;
  const factsList = document.getElementById('infoPanelFacts');
  factsList.innerHTML = facts.map(f => `<li>${f}</li>`).join('');

  // Show disclaimer for Antares
  const noteEl = document.getElementById('infoPanelNote');
  noteEl.style.display = bodyId === 'antares' ? 'block' : 'none';
  noteEl.textContent = currentLang === 'ta'
    ? '⚠️ இந்த உண்டு-இல்லாத காட்சி கல்வி நோக்கங்களுக்காக மட்டுமே.'
    : '⚠️ This is a fictional scenario for educational purposes only.';

  document.querySelector('[data-i18n="facts"]').textContent = s.facts;
  panel.classList.add('visible');
}

export function hideInfoPanel() {
  document.getElementById('infoPanel').classList.remove('visible');
}

export function refreshInfoPanelLang() {
  const panel = document.getElementById('infoPanel');
  if (!panel.classList.contains('visible')) return;
  const id = panel.dataset.currentId;
  if (id) showInfoPanel(id);
}

// showBodyInfo wraps showInfoPanel to track current id for lang refresh
export function showBodyInfo(bodyId) {
  document.getElementById('infoPanel').dataset.currentId = bodyId;
  showInfoPanel(bodyId);
}

// ------------------------------------------------------------------
// TIMELINE CONTROLS
// ------------------------------------------------------------------
function _buildTimeline(timeline) {
  const ctrl = document.getElementById('timelineControls');
  ctrl.innerHTML = `
    <button id="btnPlay"    class="tl-btn" data-i18n="play"></button>
    <button id="btnPause"   class="tl-btn" data-i18n="pause"></button>
    <button id="btnRestart" class="tl-btn" data-i18n="restart"></button>
    <label class="tl-speed-label">
      <span data-i18n="speed"></span>
      <select id="speedSelect" class="tl-speed">
        <option value="0.5">×0.5</option>
        <option value="1" selected>×1</option>
        <option value="2">×2</option>
        <option value="4">×4</option>
        <option value="8">×8</option>
      </select>
    </label>
    <div class="tl-progress-wrap">
      <div class="tl-progress-bar" id="progressBar">
        <div class="tl-progress-fill" id="progressFill"></div>
      </div>
    </div>
    <div class="tl-stage-badge" id="stageBadge"></div>
  `;

  applyLang(currentLang);

  document.getElementById('btnPlay').addEventListener('click', () => { timeline.play(); });
  document.getElementById('btnPause').addEventListener('click', () => { timeline.pause(); });
  document.getElementById('btnRestart').addEventListener('click', () => { timeline.restart(); });
  document.getElementById('speedSelect').addEventListener('change', (e) => {
    timeline.setSpeed(parseFloat(e.target.value));
  });

  // Click on progress bar to seek
  const bar = document.getElementById('progressBar');
  bar.addEventListener('click', (e) => {
    const rect = bar.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width;
    timeline.elapsed = t * 320;
  });
}

export function updateTimelineUI(timeline) {
  const fill = document.getElementById('progressFill');
  const badge = document.getElementById('stageBadge');
  if (!fill || !badge) return;
  fill.style.width = `${timeline.progress * 100}%`;
  const stage = timeline.stage;
  if (stage) {
    const s = UI_STRINGS[currentLang];
    badge.textContent = `${s.stage} ${stage.id} ${s.of} 13 — ${stage.title[currentLang] || stage.title.en}`;
  }
}

// ------------------------------------------------------------------
// STAGE EVENT PANEL
// ------------------------------------------------------------------
export function showStagePanel(stage, lang) {
  const panel = document.getElementById('stagePanel');
  const l = lang || currentLang;
  const s = UI_STRINGS[l];
  const tagLabel = stage.tag === 'science' ? s.science : s.hypo;
  const tagClass = stage.tag === 'science' ? 'tag-science' : 'tag-hypo';
  panel.innerHTML = `
    <div class="stage-tag ${tagClass}">${tagLabel}</div>
    <div class="stage-title">${stage.title[l] || stage.title.en}</div>
    <div class="stage-desc">${stage.desc[l] || stage.desc.en}</div>
  `;
  panel.classList.add('visible');
  clearTimeout(panel._hideTimer);
  panel._hideTimer = setTimeout(() => panel.classList.remove('visible'), 9000);
}

// ------------------------------------------------------------------
// HUD
// ------------------------------------------------------------------
function _buildHUD() {
  const hud = document.getElementById('hud');
  const isMob = ('ontouchstart' in window);
  const s = UI_STRINGS[currentLang];
  hud.querySelector('#controlsHint').textContent = isMob ? s.controlsHintMobile : s.controlsHintDesktop;
}

export function updateHUD(lang) {
  const isMob = ('ontouchstart' in window);
  const s = UI_STRINGS[lang];
  const hint = document.getElementById('controlsHint');
  if (hint) hint.textContent = isMob ? s.controlsHintMobile : s.controlsHintDesktop;
}

// ------------------------------------------------------------------
// MOBILE JOYSTICK HTML (injected if needed)
// ------------------------------------------------------------------
function _buildMobileJoystick() {
  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;
  let jz = document.getElementById('joystickZone');
  if (jz) return;
  jz = document.createElement('div');
  jz.id = 'joystickZone';
  jz.innerHTML = `<div id="joystickBase"><div id="joystickStick"></div></div>`;
  document.body.appendChild(jz);
}
