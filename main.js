import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';

const sceneContainer = document.getElementById('scene');
const tooltip = document.getElementById('tooltip');
const details = document.getElementById('details');
const creatorCheckboxes = document.getElementById('creatorCheckboxes');
const allCreatorsToggle = document.getElementById('allCreatorsToggle');
const sourceFilter = document.getElementById('sourceFilter');
const scoreFilter = document.getElementById('scoreFilter');
const scoreValue = document.getElementById('scoreValue');

const advancedFilter = document.getElementById('advancedFilter');
const advancedControls = document.getElementById('advancedControls');

const codingFilter = document.getElementById('codingFilter');
const knowledgeFilter = document.getElementById('knowledgeFilter');
const agenticFilter = document.getElementById('agenticFilter');

const codingValue = document.getElementById('codingValue');
const knowledgeValue = document.getElementById('knowledgeValue');
const agenticValue = document.getElementById('agenticValue');


const WIDTH = 70;
const HEIGHT = 70;
const DEPTH = 70;
let models = [];
let spheres = [];
let linkGroup = new THREE.Group();
let selected = null;
let selectedAxisMarkers = new THREE.Group();
let comparisonModel = null;
let comparisonGroup = new THREE.Group();
let axisTickGroup = new THREE.Group();

let ranges = {};

const creatorColors = new Map([
  ['Alibaba', '#ff6a00'],      
  ['Anthropic', '#f8d057'],    
  ['DeepSeek', '#ff67b3'],     
  ['Google', '#4488f5'],       
  ['Microsoft', '#032bad'],    
  ['MiniMax', '#ffffff'],      
  ['Moonshot AI', '#6b2cff'],  
  ['NVIDIA', '#023615'],      
  ['OpenAI', '#04f725'],       
  ['Z.AI', '#5ea89c'],         
  ['xAI', '#ef4444']           
]);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#050712');
scene.add(selectedAxisMarkers);
scene.add(comparisonGroup);
scene.add(axisTickGroup);
//scene.fog = new THREE.Fog('#050712', 115, 260);

const camera = new THREE.PerspectiveCamera(55, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
camera.position.set(145, 110, 170);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
sceneContainer.appendChild(renderer.domElement);
const resetView = document.getElementById('resetView');
const visibleCount = document.getElementById('visibleCount');
const modelSearch = document.getElementById('modelSearch');

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xffffff, 0.9));
const light = new THREE.DirectionalLight(0xffffff, 2.2);
light.position.set(80, 120, 60);
scene.add(light);

const grid = new THREE.GridHelper(120, 12, 0x334155, 0x1e293b);
grid.position.y = -40;
scene.add(grid);
scene.add(linkGroup);

function axisLine(start, end, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...start), new THREE.Vector3(...end)]);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
  return new THREE.Line(geo, mat);
}
scene.add(axisLine([-WIDTH,0,0],[WIDTH,0,0],0xff7d7d));
scene.add(axisLine([0,-HEIGHT,0],[0,HEIGHT,0],0x81ff9a));
scene.add(axisLine([0,0,-DEPTH],[0,0,DEPTH],0x7db4ff));

function makeTextSprite(text, color = '#ffffff') {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
 ctx.font = 'bold 42px Inter, Arial';

// Schwarze Umrandung
ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;
ctx.strokeText(text, 20, 76);

// Farbiger Text
ctx.fillStyle = color;
ctx.fillText(text, 20, 76);
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(28, 7, 1);
  return sprite;
}
const xLabel = makeTextSprite('Coding', '#ff9b9b');
xLabel.scale.set(40, 10, 1);
xLabel.position.set(85, 0, 0);
scene.add(xLabel);

const yLabel = makeTextSprite('Knowledge', '#9cffad');
yLabel.scale.set(40, 10, 1);
yLabel.position.set(0, 85, 0);
scene.add(yLabel);

const zLabel = makeTextSprite('Agentic', '#9cc4ff');
zLabel.scale.set(40, 10, 1);
zLabel.position.set(0, 0, 85);
scene.add(zLabel);


function addAxisArrow(position, direction, color) {
  const coneGeo = new THREE.ConeGeometry(2.5, 7, 20);
  const coneMat = new THREE.MeshBasicMaterial({ color });
  const cone = new THREE.Mesh(coneGeo, coneMat);

  cone.position.set(...position);

  if (direction === 'x') cone.rotation.z = -Math.PI / 2;
  if (direction === 'z') cone.rotation.x = Math.PI / 2;

  scene.add(cone);
}

addAxisArrow([WIDTH + 4, 0, 0], 'x', 0xff7d7d);
addAxisArrow([0, HEIGHT + 4, 0], 'y', 0x81ff9a);
addAxisArrow([0, 0, DEPTH + 4], 'z', 0x7db4ff);

function addAxisTicks() {

  const ticks = 5;
  const tickLength = 2;

  for (let i = 0; i < ticks; i++) {

    const t = i / (ticks - 1);

    const xPos = -WIDTH + t * (WIDTH * 2);
    const yPos = -HEIGHT + t * (HEIGHT * 2);
    const zPos = -DEPTH + t * (DEPTH * 2);

    const codingValue =
      ranges.codingMin +
      t * (ranges.codingMax - ranges.codingMin);

    const knowledgeValue =
      ranges.knowledgeMin +
      t * (ranges.knowledgeMax - ranges.knowledgeMin);

    const agenticValue =
      ranges.agenticMin +
      t * (ranges.agenticMax - ranges.agenticMin);

    // X-Achse (rot)

    scene.add(axisLine(
      [xPos, -tickLength, 0],
      [xPos, tickLength, 0],
      0xff7d7d
    ));

    const tx = makeTextSprite(
      codingValue.toFixed(0),
      '#ff7d7d'
    );

    tx.scale.set(12,6,1);
    tx.position.set(xPos, -4, 0);
    axisTickGroup.add(tx);

    // Y-Achse (grün)

    scene.add(axisLine(
      [-tickLength, yPos, 0],
      [tickLength, yPos, 0],
      0x81ff9a
    ));

    const ty = makeTextSprite(
      knowledgeValue.toFixed(0),
      '#81ff9a'
    );

    ty.scale.set(12,6,1);
    ty.position.set(4, yPos, 0);
    axisTickGroup.add(ty);

    // Z-Achse (blau)

    scene.add(axisLine(
      [0, -tickLength, zPos],
      [0, tickLength, zPos],
      0x7db4ff
    ));

    const tz = makeTextSprite(
      agenticValue.toFixed(0),
      '#7db4ff'
    );

    tz.scale.set(12,6,1);
    tz.position.set(0, -4, zPos);
    axisTickGroup.add(tz);
  }
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',').map(h => h.trim());
  return lines.map(line => {
    const values = [];
    let current = '', quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === ',' && !quoted) { values.push(current); current = ''; }
      else current += ch;
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i]);
    return obj;
  });
}

function num(v, fallback = null) {
  if (v === null || v === undefined || String(v).trim() === '') {
    return fallback;
  }

  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function calculateRanges() {

  const coding = models
    .map(m => num(m.coding, null))
    .filter(v => v !== null);

  const knowledge = models
    .map(m => num(m.knowledge, null))
    .filter(v => v !== null);

  const agentic = models
    .map(m => num(m.agentic, null))
    .filter(v => v !== null);

  ranges = {
    codingMin: Math.min(...coding),
    codingMax: Math.max(...coding),

    knowledgeMin: Math.min(...knowledge),
    knowledgeMax: Math.max(...knowledge),

    agenticMin: Math.min(...agentic),
    agenticMax: Math.max(...agentic)
  };
}

function normalize(value, min, max) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 2 - 1;
}

function toPosition(m) {

  const coding = num(
  m.coding,
  (ranges.codingMin + ranges.codingMax) / 2
);

const knowledge = num(
  m.knowledge,
  (ranges.knowledgeMin + ranges.knowledgeMax) / 2
);

const agentic = num(
  m.agentic,
  (ranges.agenticMin + ranges.agenticMax) / 2
);


  return new THREE.Vector3(
    normalize(coding, ranges.codingMin, ranges.codingMax) * WIDTH,
    normalize(knowledge, ranges.knowledgeMin, ranges.knowledgeMax) * HEIGHT,
    normalize(agentic, ranges.agenticMin, ranges.agenticMax) * DEPTH
  );
}

function addSelectedAxisMarkers(m) {
  selectedAxisMarkers.clear();

  const pos = toPosition(m);

  const coding = num(m.coding, 0);
  const knowledge = num(m.knowledge, 0);
  const agentic = num(m.agentic, 0);

  const markerSize = 5;

  // Verbindungslinien von Kugel zu den Achsen
  selectedAxisMarkers.add(axisLine([pos.x, pos.y, pos.z], [pos.x, 0, 0], 0xff7d7d));
  selectedAxisMarkers.add(axisLine([pos.x, pos.y, pos.z], [0, pos.y, 0], 0x81ff9a));
  selectedAxisMarkers.add(axisLine([pos.x, pos.y, pos.z], [0, 0, pos.z], 0x7db4ff));

  // X / Coding Marker
  selectedAxisMarkers.add(axisLine([pos.x, -markerSize, 0], [pos.x, markerSize, 0], 0xff7d7d));
  const xText = makeTextSprite(coding.toFixed(1), '#ff7d7d');
  xText.scale.set(18, 9, 1);
  xText.position.set(pos.x, -8, 0);
  selectedAxisMarkers.add(xText);

  // Y / Knowledge Marker
  selectedAxisMarkers.add(axisLine([-markerSize, pos.y, 0], [markerSize, pos.y, 0], 0x81ff9a));
  const yText = makeTextSprite(knowledge.toFixed(1), '#81ff9a');
  yText.scale.set(18, 9, 1);
  yText.position.set(8, pos.y, 0);
  selectedAxisMarkers.add(yText);

  // Z / Agentic Marker
  selectedAxisMarkers.add(axisLine([0, -markerSize, pos.z], [0, markerSize, pos.z], 0x7db4ff));
  const zText = makeTextSprite(agentic.toFixed(1), '#7db4ff');
  zText.scale.set(18, 9, 1);
  zText.position.set(0, -8, pos.z);
  selectedAxisMarkers.add(zText);
}

function showComparison(m1, m2) {
  axisTickGroup.visible = false;
  comparisonGroup.clear();
  selectedAxisMarkers.clear();

  const p1 = toPosition(m1);
  const p2 = toPosition(m2);

  comparisonGroup.add(axisLine([p1.x, p1.y, p1.z], [p2.x, p2.y, p2.z], 0xffffff));

  spheres.forEach(s => {
    s.material.transparent = true;
    s.material.opacity =
      s.userData.model === m1.model || s.userData.model === m2.model
        ? 1
        : 0.12;

    s.scale.set(
      s.userData.model === m1.model || s.userData.model === m2.model ? 1.45 : 1,
      s.userData.model === m1.model || s.userData.model === m2.model ? 1.45 : 1,
      s.userData.model === m1.model || s.userData.model === m2.model ? 1.45 : 1
    );

    s.material.needsUpdate = true;
  });

  details.classList.remove('empty');
  details.innerHTML = `
 
  <div class="comparison-header">
  <div class="comparison-model-left">
    ${m1.model}
  </div>

  <div class="comparison-vs">
    VS
  </div>

  <div class="comparison-model-right">
    ${m2.model}
  </div>
</div>

    ${compareMetric('Overall', m1.overallScore, m2.overallScore)}
    ${compareMetric('Coding', m1.coding, m2.coding)}
    ${compareMetric('Knowledge', m1.knowledge, m2.knowledge)}
    ${compareMetric('Agentic', m1.agentic, m2.agentic)}
    ${compareMetric('Input Price', price(m1.inputPrice), price(m2.inputPrice))}
    ${compareMetric('Output Price', price(m1.outputPrice), price(m2.outputPrice))}
  `;
}

function compareMetric(label, a, b) {
  const aNum = num(a, null);
  const bNum = num(b, null);

  let aClass = '';
  let bClass = '';

  const lowerIsBetter =
    label.includes('Price');

  if (aNum !== null && bNum !== null) {
    if (lowerIsBetter) {
      if (aNum < bNum) aClass = 'better';
      if (bNum < aNum) bClass = 'better';
    } else {
      if (aNum > bNum) aClass = 'better';
      if (bNum > aNum) bClass = 'better';
    }
  }

  return `
    <div class="metric compare-row">
      <span>${label}</span>
      <b>
        <span class="compare-value ${aClass}">${a || '—'}</span>
        <span class="compare-separator">|</span>
        <span class="compare-value ${bClass}">${b || '—'}</span>
      </b>
    </div>
  `;
}

function getCreatorColor(creator) {
  return creatorColors.get(creator) || '#ffffff';
}

function sourceIsOpen(sourceType) {
  return String(sourceType || '').toLowerCase().includes('open');
}

function createSpikyGeometry(radius) {
  const geo = new THREE.IcosahedronGeometry(radius, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const factor = 1 + (i % 3 === 0 ? 0.28 : 0.02);
    v.multiplyScalar(factor);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildScene() {
  spheres.forEach(s => scene.remove(s));
  spheres = [];
  linkGroup.clear();

  const creators = [...new Set(models.map(m => m.creator))].sort();
  const sources = [...new Set(models.map(m => m.sourceType))].sort();
  creatorCheckboxes.innerHTML = creators.map(c => `
  <label class="creator-check">
    <input type="checkbox" value="${c}" checked>
    <span class="creator-dot"
          style="background:${getCreatorColor(c)}"></span>
    ${c}
  </label>
`).join('');

creatorCheckboxes.querySelectorAll('input').forEach(cb => {
  cb.addEventListener('input', updateVisibility);
});
  sourceFilter.innerHTML = '<option value="all">Alle Typen</option>' + sources.map(s => `<option value="${s}">${s}</option>`).join('');

  for (const m of models) {
    const open = sourceIsOpen(m.sourceType);
    const score = num(m.overallScore, 60);
    const radius = 1.5 + (score / 100) * 1.8;
    const geo = new THREE.SphereGeometry(radius, 32, 18);
   const mat = new THREE.MeshStandardMaterial({
  color: getCreatorColor(m.creator),

  metalness: open ? 0.05 : 0.8,
  roughness: open ? 0.9 : 0.15,

  emissive: getCreatorColor(m.creator),
  emissiveIntensity: 0.04
});
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(toPosition(m));
    mesh.userData = m;
    scene.add(mesh);
    spheres.push(mesh);
  }
  updateVisibility();
}



function updateVisibility() {

  const searchText =
  modelSearch.value.trim().toLowerCase();

  const selectedCreators = [...creatorCheckboxes.querySelectorAll('input:checked')]
    .map(cb => cb.value);

  const source = sourceFilter.value;

  const useAdvanced = advancedFilter.checked;

  const minScore = Number(scoreFilter.value);
  const minCoding = Number(codingFilter.value);
  const minKnowledge = Number(knowledgeFilter.value);
  const minAgentic = Number(agenticFilter.value);

  scoreValue.textContent = minScore;
  codingValue.textContent = minCoding;
  knowledgeValue.textContent = minKnowledge;
  agenticValue.textContent = minAgentic;

  scoreFilter.disabled = useAdvanced;
  advancedControls.classList.toggle('disabled', !useAdvanced);

  codingFilter.disabled = !useAdvanced;
  knowledgeFilter.disabled = !useAdvanced;
  agenticFilter.disabled = !useAdvanced;

  let count = 0;

  for (const s of spheres) {
    const m = s.userData;

    const creatorOk = selectedCreators.includes(m.creator);
    const sourceOk = source === 'all' || m.sourceType === source;

    const searchOk =
  searchText === '' ||
  m.model.toLowerCase().includes(searchText);



    const overallOk = !useAdvanced && num(m.overallScore, 0) >= minScore;

    const advancedOk =
      useAdvanced &&
      num(m.coding, 0) >= minCoding &&
      num(m.knowledge, 0) >= minKnowledge &&
      num(m.agentic, 0) >= minAgentic;

    s.visible =
  creatorOk &&
  sourceOk &&
  searchOk &&
  (overallOk || advancedOk);
    if (s.visible) count++;
  }
  visibleCount.textContent = count;


}

function showDetails(m) {
  const missingAxisValues = [];

if (!m.coding) missingAxisValues.push('Coding');
if (!m.knowledge) missingAxisValues.push('Knowledge');
if (!m.agentic) missingAxisValues.push('Agentic');

const missingNote = missingAxisValues.length
  ? `<div class="badge">Fehlender Achsenwert approximiert: ${missingAxisValues.join(', ')}</div>`
  : '';
  details.classList.remove('empty');
  details.innerHTML = `
    <div class="detail-title">${m.model}</div>
    <div class="detail-sub">${m.creator} · ${m.sourceType}</div>
    ${metric('Rank', m.rank)}
    ${metric('Overall Score', m.overallScore)}
    ${metric('Coding', m.coding)}
    ${metric('Reasoning', m.reasoning || '—')}
    ${metric('Math', m.math || '—')}
    ${metric('Knowledge', m.knowledge || '—')}
    ${metric('Agentic', m.agentic || '—')}
    ${metric('Input Price', price(m.inputPrice))}
    ${metric('Output Price', price(m.outputPrice))}
    ${missingNote}
  `;
}
function metric(label, value) { return `<div class="metric"><span>${label}</span><b>${value}</b></div>`; }
function price(v) { const n = num(v, null); return n === null ? '—' : `$${n}`; }

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

let pointerDownPosition = { x: 0, y: 0 };

renderer.domElement.addEventListener('pointerdown', event => {
  pointerDownPosition.x = event.clientX;
  pointerDownPosition.y = event.clientY;
});

renderer.domElement.addEventListener('pointerup', event => {
  const dx = event.clientX - pointerDownPosition.x;
  const dy = event.clientY - pointerDownPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Wenn die Maus bewegt wurde, war es Drehen/Drag, kein Klick
  if (distance > 5) return;

  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(spheres.filter(s => s.visible), false);

  if (!hits.length) {
  selected = null;
  comparisonModel = null;
comparisonGroup.clear();
axisTickGroup.visible = true;

  spheres.forEach(s => {
    s.material.transparent = false;
    s.material.opacity = 1;
    s.scale.set(1, 1, 1);
    s.material.needsUpdate = true;
  });

  selectedAxisMarkers.clear();

  details.classList.add('empty');
  details.innerHTML = 'Wähle ein Modell aus.';

  return;
}

if (event.shiftKey && selected) {
  comparisonModel = hits[0].object;

  if (comparisonModel !== selected) {
    showComparison(selected.userData, comparisonModel.userData);
  }

  return;
}
  comparisonModel = null;
  comparisonGroup.clear();
  selected = hits[0].object;
  axisTickGroup.visible = false;
  const creator = selected.userData.creator;

  spheres.forEach(s => {
    s.material.transparent = true;
    s.material.opacity = s.userData.creator === creator ? 1 : 0.18;
    s.scale.set(1, 1, 1);
    s.material.needsUpdate = true;
  });

  selected.scale.set(1.45, 1.45, 1.45);

  showDetails(selected.userData);
  addSelectedAxisMarkers(selected.userData);
});


renderer.domElement.addEventListener('mousemove', event => {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(spheres.filter(s => s.visible));
  if (hits.length) {
    tooltip.style.opacity = 1;
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
    const m = hits[0].object.userData;

tooltip.innerHTML = `
  <b>${m.model}</b><br>
  ${m.creator}<br>
  <hr>
  Overall: ${m.overallScore}<br>
  Coding: ${m.coding || '—'}<br>
  Knowledge: ${m.knowledge || '—'}<br>
  Agentic: ${m.agentic || '—'}
`;
  } else {
    tooltip.style.opacity = 0;
  }
});

[sourceFilter, scoreFilter, advancedFilter, codingFilter, knowledgeFilter, agenticFilter, modelSearch].forEach(el => {
  el.addEventListener('input', updateVisibility);
});

window.addEventListener('resize', () => {
  camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
});


allCreatorsToggle.addEventListener('input', () => {
  creatorCheckboxes.querySelectorAll('input').forEach(cb => {
    cb.checked = allCreatorsToggle.checked;
  });

  updateVisibility();
});

resetView.addEventListener('click', () => {

  camera.position.set(145, 110, 170);

  controls.target.set(0, 0, 0);

  controls.update();
});

advancedFilter.addEventListener('change', () => {
  if (advancedFilter.checked) {
    scoreFilter.value = scoreFilter.min;

    codingFilter.value = codingFilter.min;
    knowledgeFilter.value = knowledgeFilter.min;
    agenticFilter.value = agenticFilter.min;
  } else {
    codingFilter.value = codingFilter.min;
    knowledgeFilter.value = knowledgeFilter.min;
    agenticFilter.value = agenticFilter.min;

    scoreFilter.value = scoreFilter.min;
  }

  updateVisibility();
});




function animate() {
  requestAnimationFrame(animate);
  controls.update();
  for (const s of spheres) {
    s.rotation.y += sourceIsOpen(s.userData.sourceType) ? 0.002 : 0.004;
  }
  renderer.render(scene, camera);
}

fetch('data.csv')
  .then(r => r.text())
  .then(text => {
   models = parseCSV(text)
  .map(row => ({ ...row }))
  .filter(m => m.creator !== 'MiniMax');
calculateRanges();

scoreFilter.min = Math.floor(Math.min(...models.map(m => num(m.overallScore, 0))));
scoreFilter.max = Math.ceil(Math.max(...models.map(m => num(m.overallScore, 0))));
scoreFilter.value = scoreFilter.min;

codingFilter.min = Math.floor(ranges.codingMin);
codingFilter.max = Math.ceil(ranges.codingMax);
codingFilter.value = codingFilter.min;

knowledgeFilter.min = Math.floor(ranges.knowledgeMin);
knowledgeFilter.max = Math.ceil(ranges.knowledgeMax);
knowledgeFilter.value = knowledgeFilter.min;

agenticFilter.min = Math.floor(ranges.agenticMin);
agenticFilter.max = Math.ceil(ranges.agenticMax);
agenticFilter.value = agenticFilter.min;

addAxisTicks();
buildScene();
animate();
  })
  .catch(err => {
    details.innerHTML = 'CSV konnte nicht geladen werden. Starte die Webseite bitte über einen lokalen Server, z. B. mit: python -m http.server';
    console.error(err);
  });
