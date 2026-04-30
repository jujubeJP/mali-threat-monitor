// バマコ治安ダッシュボード - メインアプリケーション

const TYPE_COLORS = {
  attack: '#ef4444',
  demo: '#f59e0b',
  curfew: '#eab308',
  blockade: '#a855f7',
  poi: '#3b82f6'
};

const TYPE_LABELS = {
  attack: '攻撃',
  demo: 'デモ・抗議',
  curfew: '外出禁止令',
  blockade: '封鎖・包囲',
  poi: '主要拠点'
};

const POI_ICONS = {
  airport: '✈',
  military: '⚔',
  culture: '◆',
  city: '●',
  government: '★'
};

// State
const state = {
  filters: { attack: true, demo: true, curfew: true, blockade: true, poi: true },
  currentTime: null,
  startTime: new Date('2026-04-27T00:00:00').getTime(),
  endTime: new Date('2026-04-30T13:40:00').getTime(),
  isPlaying: false,
  playInterval: null,
  markers: { events: [], pois: [] }
};
state.currentTime = state.endTime;

// Map init - centered on Bamako
const map = L.map('map', {
  center: [12.65, -7.99],
  zoom: 11,
  zoomControl: true,
  attributionControl: true
});

// Dark tile layer (CARTO Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Render POI markers
function createPoiIcon(poi) {
  const icon = POI_ICONS[poi.subtype] || '●';
  return L.divIcon({
    className: 'custom-poi-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          background: rgba(59, 130, 246, 0.2);
          border: 2px solid #3b82f6;
          border-radius: 50%;
        "></div>
        <div style="
          position: relative;
          color: #3b82f6;
          font-size: 16px;
          font-weight: 700;
          z-index: 1;
        ">${icon}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

function createEventIcon(event) {
  const color = TYPE_COLORS[event.type];
  const size = event.type === 'attack' ? 22 : 18;
  return L.divIcon({
    className: 'custom-event-marker',
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
      ">
        <div class="pulse-marker" style="
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          box-shadow: 0 0 12px ${color};
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
}

function buildPoiPopup(poi) {
  const icon = POI_ICONS[poi.subtype] || '●';
  return `
    <div class="popup-title" style="color: #3b82f6;">
      <span>${icon}</span>
      <span>${poi.name}</span>
    </div>
    <div class="popup-meta">${poi.nameEn} · ${poi.lat.toFixed(4)}, ${poi.lng.toFixed(4)}</div>
    <div class="popup-desc">${poi.desc}</div>
    <div class="popup-source">
      出典: <a href="${poi.source}" target="_blank" rel="noopener">参照リンク ↗</a>
    </div>
  `;
}

function buildEventPopup(event) {
  const color = TYPE_COLORS[event.type];
  const dt = formatDateTime(event.datetime);
  let timeRange = dt;
  if (event.endtime) {
    timeRange = `${dt} → ${formatDateTime(event.endtime)}`;
  }
  return `
    <div class="popup-title" style="color: ${color};">
      <span>● ${TYPE_LABELS[event.type]}</span>
    </div>
    <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">
      ${event.title}
    </div>
    <div class="popup-meta">📅 ${timeRange}</div>
    <div class="popup-meta" style="margin-bottom: 8px;">📍 ${event.location}</div>
    <div class="popup-desc">${event.desc}</div>
    <div class="popup-source">
      出典: <a href="${event.sourceUrl}" target="_blank" rel="noopener">${event.source} ↗</a>
    </div>
  `;
}

function formatDateTime(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTimeOnly(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Render markers
function renderPois() {
  state.markers.pois.forEach(m => map.removeLayer(m));
  state.markers.pois = [];
  if (!state.filters.poi) return;
  POIS.forEach(poi => {
    const marker = L.marker([poi.lat, poi.lng], { icon: createPoiIcon(poi) })
      .addTo(map)
      .bindPopup(buildPoiPopup(poi), { maxWidth: 300 });
    state.markers.pois.push(marker);
  });
}

function renderEvents() {
  state.markers.events.forEach(m => map.removeLayer(m));
  state.markers.events = [];
  EVENTS.forEach(ev => {
    if (!state.filters[ev.type]) return;
    const evTime = new Date(ev.datetime).getTime();
    if (evTime > state.currentTime) return;
    const marker = L.marker([ev.lat, ev.lng], { icon: createEventIcon(ev) })
      .addTo(map)
      .bindPopup(buildEventPopup(ev), { maxWidth: 320 });
    state.markers.events.push(marker);
  });
}

// Stats
function updateStats() {
  const visible = EVENTS.filter(ev => new Date(ev.datetime).getTime() <= state.currentTime);
  document.getElementById('stat-attacks').textContent = visible.filter(e => e.type === 'attack').length;
  document.getElementById('stat-demos').textContent = visible.filter(e => e.type === 'demo').length;
  document.getElementById('stat-curfews').textContent = visible.filter(e => e.type === 'curfew').length;
  document.getElementById('stat-blockades').textContent = visible.filter(e => e.type === 'blockade').length;

  document.getElementById('count-attack').textContent = visible.filter(e => e.type === 'attack').length;
  document.getElementById('count-demo').textContent = visible.filter(e => e.type === 'demo').length;
  document.getElementById('count-curfew').textContent = visible.filter(e => e.type === 'curfew').length;
  document.getElementById('count-blockade').textContent = visible.filter(e => e.type === 'blockade').length;
  document.getElementById('count-poi').textContent = POIS.length;
}

// Event list (timeline)
function renderEventList() {
  const list = document.getElementById('event-list');
  list.innerHTML = '';
  const visible = EVENTS
    .filter(ev => state.filters[ev.type])
    .filter(ev => new Date(ev.datetime).getTime() <= state.currentTime)
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  if (visible.length === 0) {
    list.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; text-align: center; padding: 20px;">表示できるイベントがありません</div>';
    return;
  }

  visible.forEach(ev => {
    const item = document.createElement('div');
    item.className = `event-item ${ev.type}`;
    item.innerHTML = `
      <div class="event-header">
        <span class="event-time">${formatTimeOnly(ev.datetime)}</span>
        <span class="event-type ${ev.type}">${TYPE_LABELS[ev.type]}</span>
      </div>
      <div class="event-title">${ev.title}</div>
      <div class="event-location">📍 ${ev.location}</div>
    `;
    item.addEventListener('click', () => {
      map.setView([ev.lat, ev.lng], 13, { animate: true });
      // Find marker and open popup
      setTimeout(() => {
        const marker = state.markers.events.find(m => {
          const ll = m.getLatLng();
          return Math.abs(ll.lat - ev.lat) < 0.0001 && Math.abs(ll.lng - ev.lng) < 0.0001;
        });
        if (marker) marker.openPopup();
      }, 300);
    });
    list.appendChild(item);
  });
}

// Filter handling
document.querySelectorAll('.filter-item').forEach(el => {
  el.addEventListener('click', () => {
    const type = el.dataset.type;
    state.filters[type] = !state.filters[type];
    el.classList.toggle('active');
    renderAll();
  });
});

// Time slider
const slider = document.getElementById('time-slider');
function updateCurrentTimeDisplay() {
  const d = new Date(state.currentTime);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('current-time').textContent =
    `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function setTimeFromSlider(value) {
  const range = state.endTime - state.startTime;
  state.currentTime = state.startTime + (range * value / 100);
  updateCurrentTimeDisplay();
  renderEvents();
  renderEventList();
  updateStats();
}

slider.addEventListener('input', e => setTimeFromSlider(parseFloat(e.target.value)));

// Playback controls
document.getElementById('btn-play').addEventListener('click', () => {
  if (state.isPlaying) {
    clearInterval(state.playInterval);
    state.isPlaying = false;
    document.getElementById('btn-play').textContent = '▶';
  } else {
    state.isPlaying = true;
    document.getElementById('btn-play').textContent = '⏸';
    if (parseFloat(slider.value) >= 100) {
      slider.value = 0;
      setTimeFromSlider(0);
    }
    state.playInterval = setInterval(() => {
      let v = parseFloat(slider.value) + 1;
      if (v >= 100) {
        v = 100;
        clearInterval(state.playInterval);
        state.isPlaying = false;
        document.getElementById('btn-play').textContent = '▶';
      }
      slider.value = v;
      setTimeFromSlider(v);
    }, 200);
  }
});

document.getElementById('btn-prev').addEventListener('click', () => {
  // Jump to previous event
  const sorted = [...EVENTS].sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  const prev = sorted.reverse().find(e => new Date(e.datetime).getTime() < state.currentTime);
  if (prev) {
    const t = new Date(prev.datetime).getTime();
    const v = ((t - state.startTime) / (state.endTime - state.startTime)) * 100;
    slider.value = Math.max(0, v);
    setTimeFromSlider(parseFloat(slider.value));
  }
});

document.getElementById('btn-next').addEventListener('click', () => {
  const sorted = [...EVENTS].sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  const next = sorted.find(e => new Date(e.datetime).getTime() > state.currentTime);
  if (next) {
    const t = new Date(next.datetime).getTime();
    const v = ((t - state.startTime) / (state.endTime - state.startTime)) * 100;
    slider.value = Math.min(100, v);
    setTimeFromSlider(parseFloat(slider.value));
  } else {
    slider.value = 100;
    setTimeFromSlider(100);
  }
});

function renderAll() {
  renderPois();
  renderEvents();
  renderEventList();
  updateStats();
}

renderAll();
updateCurrentTimeDisplay();

// Fit bounds initially with a slight delay
setTimeout(() => {
  const allLatLngs = [
    ...POIS.map(p => [p.lat, p.lng]),
    ...EVENTS.map(e => [e.lat, e.lng])
  ];
  if (allLatLngs.length > 0) {
    map.fitBounds(allLatLngs, { padding: [60, 60], maxZoom: 12 });
  }
}, 100);
