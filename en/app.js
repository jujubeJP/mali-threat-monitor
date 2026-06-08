/* ===================================================
   Mali Threat Monitor - Dashboard Logic v2 (Phase-aware)
   =================================================== */

// Global state
const state = {
  filters: {
    target: null,
    group:  null,
    phase:  null   // null = all phases (P1..P4)
  }
};

const PHASE_KEYS = ["P1", "P2", "P3", "P4"];

// ----------------------------------------------------
// 1) KPI ROW
// ----------------------------------------------------
function renderKPIs() {
  const data = getFiltered();
  const total = data.length;
  const totalFatalities = data.reduce((s, i) => s + i.fatalities, 0);
  const kidnappings = data.filter(i => i.targetType === "kidnapping").length;
  const fuelAttacks = data.filter(i => i.targetType === "fuel_tanker").length;
  const militaryAttacks = data.filter(i =>
    i.targetType === "military_base" || i.targetType === "airport"
  ).length;

  const ctxLabel = state.filters.phase
    ? `${phases[state.filters.phase].label} (${phases[state.filters.phase].range})`
    : "2025-05 → 2026-06";

  const html = `
    <div class="kpi">
      <div class="kpi-label">Recorded Incidents</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-sub">${ctxLabel}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Estimated Fatalities</div>
      <div class="kpi-value alert">${totalFatalities}+</div>
      <div class="kpi-sub">based on major incidents</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Military / Airport Attacks</div>
      <div class="kpi-value warn">${militaryAttacks}</div>
      <div class="kpi-sub">Hard targets</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Fuel Convoy Attacks</div>
      <div class="kpi-value warn">${fuelAttacks}</div>
      <div class="kpi-sub">300+ fuel trucks destroyed</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Kidnappings</div>
      <div class="kpi-value">${kidnappings}</div>
      <div class="kpi-sub">Multiple foreign nationals affected</div>
    </div>
  `;
  document.getElementById('kpi-row').innerHTML = html;
}

// ----------------------------------------------------
// 2) PHASE TRACK
// ----------------------------------------------------
function renderPhaseTrack() {
  const track = document.getElementById('phase-track');
  const allCount = incidents.length;

  const items = [
    { key: null, label: "All Periods", range: "2025-05 → 2026-06", color: "#9aa1ad", count: allCount }
  ];
  PHASE_KEYS.forEach(k => {
    items.push({
      key: k,
      label: phases[k].label,
      range: phases[k].range,
      color: phases[k].color,
      count: incidents.filter(i => i.phase === k).length
    });
  });

  track.innerHTML = items.map(it => {
    const active = state.filters.phase === it.key;
    return `
      <button class="phase-pill ${active ? 'active' : ''}" data-phase="${it.key === null ? 'ALL' : it.key}" style="--pill-color:${it.color}">
        <div class="phase-pill-head">
          <span class="phase-pill-dot" style="background:${it.color}"></span>
          <span class="phase-pill-label">${it.label}</span>
          <span class="phase-pill-count">${it.count}</span>
        </div>
        <div class="phase-pill-range">${it.range}</div>
      </button>
    `;
  }).join('');

  track.querySelectorAll('[data-phase]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.phase;
      state.filters.phase = (v === 'ALL') ? null : v;
      updateAll();
    });
  });
}

// ----------------------------------------------------
// 3) FILTER CHIPS
// ----------------------------------------------------
function renderFilterChips() {
  const tBox = document.getElementById('target-filters');
  tBox.innerHTML = Object.entries(targetTypes).map(([k, v]) => `
    <button class="chip" data-target="${k}">
      <span class="chip-dot" style="background:${v.color}"></span>${v.label}
    </button>
  `).join('');

  const gBox = document.getElementById('group-filters');
  gBox.innerHTML = Object.entries(groups).map(([k, v]) => `
    <button class="chip" data-group="${k}">
      <span class="chip-dot" style="background:${v.color}"></span>${v.label}
    </button>
  `).join('');

  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.target;
      state.filters.target = (state.filters.target === v) ? null : v;
      updateAll();
    });
  });
  document.querySelectorAll('[data-group]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.group;
      state.filters.group = (state.filters.group === v) ? null : v;
      updateAll();
    });
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    state.filters.target = null;
    state.filters.group  = null;
    state.filters.phase  = null;
    updateAll();
  });
}

function syncChipStates() {
  document.querySelectorAll('[data-target]').forEach(b => {
    b.classList.toggle('active', state.filters.target === b.dataset.target);
  });
  document.querySelectorAll('[data-group]').forEach(b => {
    b.classList.toggle('active', state.filters.group === b.dataset.group);
  });
  document.querySelectorAll('[data-phase]').forEach(b => {
    const key = b.dataset.phase === 'ALL' ? null : b.dataset.phase;
    b.classList.toggle('active', state.filters.phase === key);
  });
}

function getFiltered() {
  return incidents.filter(i => {
    if (state.filters.target && i.targetType !== state.filters.target) return false;
    if (state.filters.group  && i.group       !== state.filters.group)  return false;
    if (state.filters.phase  && i.phase       !== state.filters.phase)  return false;
    return true;
  });
}

// ----------------------------------------------------
// 4) MAP
// ----------------------------------------------------
let map, markerLayer;

function initMap() {
  map = L.map('map', {
    center: [15.5, -4.5],
    zoom: 5,
    zoomControl: true,
    minZoom: 4,
    maxZoom: 12,
    worldCopyJump: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    pane: 'overlayPane'
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  majorCities.forEach(c => {
    L.circleMarker([c.lat, c.lng], {
      radius: 3,
      color: '#9aa1ad',
      weight: 1,
      fillColor: '#1a1e25',
      fillOpacity: 1
    }).addTo(map).bindTooltip(
      `<b>${c.name}</b><br><span style="color:#9aa1ad">${c.role}</span>`,
      { permanent: false, direction: 'top', className: 'city-tooltip' }
    );
  });

  // Map legend: target type swatches + phase border legend
  const targetLegend = Object.entries(targetTypes).map(([k, v]) => `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${v.color}"></span>
      ${v.label}
    </div>
  `).join('');
  const phaseLegend = PHASE_KEYS.map(k => `
    <div class="legend-item">
      <span class="legend-swatch legend-ring" style="border-color:${phases[k].color}"></span>
      ${k}
    </div>
  `).join('');
  document.getElementById('map-legend').innerHTML = `
    <div class="legend-block"><div class="legend-title">Target</div><div class="legend-row">${targetLegend}</div></div>
    <div class="legend-block"><div class="legend-title">Phase Border</div><div class="legend-row">${phaseLegend}</div></div>
  `;
}

function plotIncidents() {
  markerLayer.clearLayers();
  const data = getFiltered();
  data.forEach(inc => {
    const tt = targetTypes[inc.targetType];
    const ph = phases[inc.phase];
    const radius = 6 + Math.min(14, Math.sqrt(Math.max(inc.fatalities, 1)) * 1.6);
    const marker = L.circleMarker([inc.lat, inc.lng], {
      radius,
      color: ph.color,         // phase border
      weight: 3,
      fillColor: tt.color,     // target fill
      fillOpacity: 0.82
    });

    const grp = groups[inc.group];
    const popup = `
      <div class="popup-title">${inc.location}</div>
      <div class="popup-meta">${inc.date} · ${inc.region} · ${inc.fatalities} fatalities</div>
      <div class="popup-tags">
        <span class="tag" style="background:${ph.color}25; color:${ph.color}; border:1px solid ${ph.color}77">${inc.phase}</span>
        <span class="tag" style="background:${tt.color}25; color:${tt.color}; border:1px solid ${tt.color}55">${tt.label}</span>
        <span class="tag" style="background:${grp.color}25; color:${grp.color}; border:1px solid ${grp.color}55">${grp.label}</span>
      </div>
      <div>${inc.summary}</div>
      <a class="popup-source" href="${inc.sourceUrl}" target="_blank" rel="noopener">▸ ${inc.source}</a>
    `;
    marker.bindPopup(popup, { maxWidth: 360 });
    marker.addTo(markerLayer);
  });
}

// ----------------------------------------------------
// 5) CHARTS
// ----------------------------------------------------
let timelineChart, targetChart, groupChart, regionChart;

const chartDefaults = {
  font: { family: "'Inter', 'Noto Sans JP', sans-serif", size: 11 },
  colorAxis: '#6b7280',
  colorGrid: 'rgba(108, 117, 125, 0.12)',
  colorTick: '#9aa1ad'
};

Chart.defaults.color = chartDefaults.colorTick;
Chart.defaults.font.family = chartDefaults.font.family;
Chart.defaults.font.size = chartDefaults.font.size;
Chart.defaults.borderColor = chartDefaults.colorGrid;
Chart.defaults.plugins.legend.labels.color = chartDefaults.colorTick;
Chart.defaults.plugins.tooltip.backgroundColor = '#1a1e25';
Chart.defaults.plugins.tooltip.borderColor = '#2c323d';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 4;
Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 12 };
Chart.defaults.plugins.tooltip.bodyFont = { size: 11.5 };

// Generate month list 2025-05 → 2026-06
function buildMonthList() {
  const months = [];
  let y = 2025, m = 5;
  while (!(y === 2026 && m === 7)) {
    months.push(`${y}-${String(m).padStart(2,'0')}`);
    m++; if (m > 12) { m = 1; y++; }
  }
  return months;
}

// ---- Timeline: phase-stacked monthly bars ----
function buildTimeline() {
  const data = getFiltered();
  const months = buildMonthList();

  const datasets = PHASE_KEYS.map(p => ({
    label: phases[p].label,
    backgroundColor: phases[p].color,
    borderRadius: 2,
    barPercentage: 0.78,
    data: months.map(month =>
      data.filter(i => i.date.startsWith(month) && i.phase === p).length
    )
  }));

  if (timelineChart) timelineChart.destroy();
  timelineChart = new Chart(document.getElementById('timelineChart'), {
    type: 'bar',
    data: { labels: months, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 6, right: 8, top: 4, bottom: 4 } },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, padding: 12, font: { size: 11 } }
        },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            padding: 8,
            font: { size: 10, family: "'JetBrains Mono', monospace" },
            callback: function(v) {
              const lab = this.getLabelForValue(v);
              return lab.slice(2);
            }
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            padding: 6,
            font: { size: 10, family: "'JetBrains Mono', monospace" },
            stepSize: 1,
            precision: 0
          },
          grid: { color: chartDefaults.colorGrid, drawTicks: false }
        }
      }
    }
  });
}

// ---- Target type doughnut ----
function buildTargetChart() {
  const data = getFiltered();
  const counts = {};
  Object.keys(targetTypes).forEach(t => counts[t] = 0);
  data.forEach(i => counts[i.targetType]++);

  const labels = Object.keys(counts).filter(k => counts[k] > 0);
  const values = labels.map(k => counts[k]);
  const colors = labels.map(k => targetTypes[k].color);
  const labelsLoc = labels.map(k => targetTypes[k].label);

  if (targetChart) targetChart.destroy();
  targetChart = new Chart(document.getElementById('targetChart'), {
    type: 'doughnut',
    data: {
      labels: labelsLoc,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: '#14171c',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 10, boxHeight: 10, padding: 10, font: { size: 11 } }
        }
      }
    }
  });
}

// ---- Group activity horizontal bar ----
function buildGroupChart() {
  const data = getFiltered();
  const counts = {};
  Object.keys(groups).forEach(g => counts[g] = 0);
  data.forEach(i => counts[i.group]++);
  const labels = Object.keys(counts);
  const values = labels.map(k => counts[k]);
  const colors = labels.map(k => groups[k].color);
  const labelsLoc = labels.map(k => groups[k].label);

  if (groupChart) groupChart.destroy();
  groupChart = new Chart(document.getElementById('groupChart'), {
    type: 'bar',
    data: {
      labels: labelsLoc,
      datasets: [{
        label: 'Incidents',
        data: values,
        backgroundColor: colors,
        borderRadius: 3,
        barPercentage: 0.6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'JetBrains Mono', monospace", size: 10 }}, grid: { color: chartDefaults.colorGrid }},
        y: { grid: { display: false }, ticks: { font: { size: 11 }}}
      }
    }
  });
}

// ---- Region breakdown ----
function buildRegionChart() {
  const data = getFiltered();
  const counts = {};
  data.forEach(i => counts[i.region] = (counts[i.region] || 0) + 1);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(s => s[0]);
  const values = sorted.map(s => s[1]);
  const max = Math.max(...values, 1);
  const colors = values.map(v => {
    const t = v / max;
    return `rgba(230, 57, 70, ${0.35 + t * 0.55})`;
  });

  if (regionChart) regionChart.destroy();
  regionChart = new Chart(document.getElementById('regionChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Incidents',
        data: values,
        backgroundColor: colors,
        borderRadius: 2,
        barPercentage: 0.7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }},
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }}},
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'JetBrains Mono', monospace", size: 10 }}, grid: { color: chartDefaults.colorGrid }}
      }
    }
  });
}

// ----------------------------------------------------
// 6) PHASE SHIFT GRID (NEW)
//    Visualize 'what changed' across P1..P4
// ----------------------------------------------------
function renderPhaseShiftGrid() {
  const grid = document.getElementById('phase-shift-grid');

  const html = PHASE_KEYS.map(p => {
    const set = incidents.filter(i => i.phase === p);
    const total = set.length;
    const fatal = set.reduce((s, i) => s + i.fatalities, 0);

    // top target types
    const tCount = {};
    set.forEach(i => tCount[i.targetType] = (tCount[i.targetType] || 0) + 1);
    const topTargets = Object.entries(tCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // top regions
    const rCount = {};
    set.forEach(i => rCount[i.region] = (rCount[i.region] || 0) + 1);
    const topRegions = Object.entries(rCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // groups
    const gCount = {};
    set.forEach(i => gCount[i.group] = (gCount[i.group] || 0) + 1);
    const topGroups = Object.entries(gCount)
      .sort((a, b) => b[1] - a[1]);

    const ph = phases[p];

    const targetRows = topTargets.map(([k, v]) => {
      const tt = targetTypes[k];
      return `
        <li>
          <span class="ps-bullet" style="background:${tt.color}"></span>
          <span class="ps-label">${tt.label}</span>
          <span class="ps-num">${v}</span>
        </li>`;
    }).join('');

    const regionRows = topRegions.map(([k, v]) => `
      <li>
        <span class="ps-label">${k}</span>
        <span class="ps-num">${v}</span>
      </li>`).join('');

    const groupRows = topGroups.map(([k, v]) => {
      const g = groups[k];
      return `
        <li>
          <span class="ps-bullet" style="background:${g.color}"></span>
          <span class="ps-label">${g.label}</span>
          <span class="ps-num">${v}</span>
        </li>`;
    }).join('');

    return `
      <div class="phase-col" style="--phase-color:${ph.color}">
        <div class="phase-col-head">
          <div class="phase-col-key">${p}</div>
          <div class="phase-col-title">${ph.label.replace(/^P\d\s/, '')}</div>
          <div class="phase-col-range">${ph.range}</div>
        </div>
        <div class="phase-col-stats">
          <div><span class="ps-stat-num">${total}</span><span class="ps-stat-lab">events</span></div>
          <div><span class="ps-stat-num">${fatal}+</span><span class="ps-stat-lab">fatalities</span></div>
        </div>
        <div class="phase-col-section">
          <div class="phase-col-section-label">Top Targets</div>
          <ul class="ps-list">${targetRows}</ul>
        </div>
        <div class="phase-col-section">
          <div class="phase-col-section-label">Top Regions</div>
          <ul class="ps-list">${regionRows}</ul>
        </div>
        <div class="phase-col-section">
          <div class="phase-col-section-label">Groups</div>
          <ul class="ps-list">${groupRows}</ul>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = html;
}

// ----------------------------------------------------
// 7) REGION × PHASE HEATMAP (NEW)
// ----------------------------------------------------
function renderHeatmap() {
  const wrap = document.getElementById('heatmap');

  // collect regions, then sort by total descending
  const regionTotals = {};
  incidents.forEach(i => regionTotals[i.region] = (regionTotals[i.region] || 0) + 1);
  const regions = Object.entries(regionTotals).sort((a, b) => b[1] - a[1]).map(([r]) => r);

  // matrix[region][phase] = count
  const matrix = {};
  regions.forEach(r => {
    matrix[r] = { P1: 0, P2: 0, P3: 0, P4: 0 };
  });
  incidents.forEach(i => { matrix[i.region][i.phase]++; });

  const maxVal = Math.max(
    ...regions.flatMap(r => PHASE_KEYS.map(p => matrix[r][p])),
    1
  );

  const head = `
    <thead>
      <tr>
        <th class="hm-corner">Region / Phase</th>
        ${PHASE_KEYS.map(p => `
          <th class="hm-phase-head" style="--phase-color:${phases[p].color}">
            <div class="hm-phase-key">${p}</div>
            <div class="hm-phase-range">${phases[p].range}</div>
          </th>
        `).join('')}
        <th class="hm-total-head">Total</th>
      </tr>
    </thead>
  `;

  const rows = regions.map(r => {
    const cells = PHASE_KEYS.map(p => {
      const v = matrix[r][p];
      if (v === 0) return `<td class="hm-cell hm-empty">·</td>`;
      const alpha = 0.18 + (v / maxVal) * 0.72;
      const color = phases[p].color;
      return `
        <td class="hm-cell" style="background:${hexToRgba(color, alpha)}">
          <span class="hm-num">${v}</span>
        </td>`;
    }).join('');
    const tot = regionTotals[r];
    return `
      <tr>
        <th class="hm-row-head">${r}</th>
        ${cells}
        <td class="hm-total">${tot}</td>
      </tr>
    `;
  }).join('');

  wrap.innerHTML = `<table class="heatmap-table">${head}<tbody>${rows}</tbody></table>`;
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ----------------------------------------------------
// 8) TABLE
// ----------------------------------------------------
function renderTable() {
  const data = getFiltered().slice().sort((a, b) => b.date.localeCompare(a.date));
  const tbody = document.querySelector('#incident-table tbody');
  tbody.innerHTML = data.map(i => {
    const tt = targetTypes[i.targetType];
    const grp = groups[i.group];
    const ph = phases[i.phase];
    return `
      <tr>
        <td class="td-date">${i.date}</td>
        <td><span class="tag" style="background:${ph.color}25;color:${ph.color};border:1px solid ${ph.color}77;font-weight:600">${i.phase}</span></td>
        <td class="td-loc">${i.location}<div style="color:#6b7280;font-family:var(--font-mono);font-size:10.5px;margin-top:2px">${i.region}</div></td>
        <td><span class="tag" style="background:${tt.color}25;color:${tt.color};border:1px solid ${tt.color}55">${tt.label}</span></td>
        <td><span class="tag" style="background:${grp.color}25;color:${grp.color};border:1px solid ${grp.color}55">${grp.label}</span></td>
        <td class="td-fat">${i.fatalities || '—'}</td>
        <td class="td-summary">${i.summary}</td>
        <td class="td-source"><a href="${i.sourceUrl}" target="_blank" rel="noopener">${i.source} ↗</a></td>
      </tr>
    `;
  }).join('');
  document.getElementById('table-count').textContent = `${data.length} items`;
}

// ----------------------------------------------------
// 9) UPDATE ORCHESTRATOR
// ----------------------------------------------------
function updateAll() {
  syncChipStates();
  renderKPIs();
  plotIncidents();
  buildTimeline();
  buildTargetChart();
  buildGroupChart();
  buildRegionChart();
  renderTable();
}

// ----------------------------------------------------
// INIT
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderPhaseTrack();
  renderFilterChips();
  initMap();
  renderPhaseShiftGrid();  // static — always shows all 4 phases regardless of filter
  renderHeatmap();         // static
  updateAll();
});
