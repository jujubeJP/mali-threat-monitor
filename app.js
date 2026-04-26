/* ===================================================
   Mali Threat Monitor - Dashboard Logic
   =================================================== */

// グローバル状態
const state = {
  filters: {
    target: null,   // null = all
    group:  null
  }
};

// ----------------------------------------------------
// 1) KPI ROW
// ----------------------------------------------------
function renderKPIs() {
  const total = incidents.length;
  const totalFatalities = incidents.reduce((s, i) => s + i.fatalities, 0);
  const kidnappings = incidents.filter(i => i.targetType === "kidnapping").length;
  const fuelAttacks = incidents.filter(i => i.targetType === "fuel_tanker").length;
  const militaryAttacks = incidents.filter(i =>
    i.targetType === "military_base" || i.targetType === "airport"
  ).length;

  const html = `
    <div class="kpi">
      <div class="kpi-label">記録インシデント数</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-sub">2025-05 → 2026-04</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">推定死者数</div>
      <div class="kpi-value alert">${totalFatalities}+</div>
      <div class="kpi-sub">主要事案ベース</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">軍施設・空港攻撃</div>
      <div class="kpi-value warn">${militaryAttacks}</div>
      <div class="kpi-sub">ハードターゲット</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">燃料輸送車襲撃</div>
      <div class="kpi-value warn">${fuelAttacks}</div>
      <div class="kpi-sub">タンクローリー300台以上焼失（OSINT）</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">誘拐事案</div>
      <div class="kpi-value">${kidnappings}</div>
      <div class="kpi-sub">外国人多数被害</div>
    </div>
  `;
  document.getElementById('kpi-row').innerHTML = html;
}

// ----------------------------------------------------
// 2) FILTER CHIPS
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
}

function getFiltered() {
  return incidents.filter(i => {
    if (state.filters.target && i.targetType !== state.filters.target) return false;
    if (state.filters.group  && i.group       !== state.filters.group)  return false;
    return true;
  });
}

// ----------------------------------------------------
// 3) MAP
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

  // Dark CartoDB tiles for editorial feel
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  // Reference labels overlay (cities)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    pane: 'overlayPane'
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  // Draw major city reference markers
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

  // Map legend
  document.getElementById('map-legend').innerHTML = Object.entries(targetTypes).map(([k, v]) => `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${v.color}"></span>
      ${v.label}
    </div>
  `).join('');
}

function plotIncidents() {
  markerLayer.clearLayers();
  const data = getFiltered();
  data.forEach(inc => {
    const tt = targetTypes[inc.targetType];
    const radius = 6 + Math.min(14, Math.sqrt(Math.max(inc.fatalities, 1)) * 1.6);
    const marker = L.circleMarker([inc.lat, inc.lng], {
      radius,
      color: '#ffffff',
      weight: 1.4,
      fillColor: tt.color,
      fillOpacity: 0.78
    });

    const grp = groups[inc.group];
    const popup = `
      <div class="popup-title">${inc.location}</div>
      <div class="popup-meta">${inc.date} · ${inc.region}州 · 死者 ${inc.fatalities}</div>
      <div class="popup-tags">
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
// 4) CHARTS
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

// ---- Timeline (stacked bar by month / target type) ----
function buildTimeline() {
  const data = getFiltered();
  const months = [];
  for (let y = 2025, m = 5; ; ) {
    months.push(`${y}-${String(m).padStart(2,'0')}`);
    if (y === 2026 && m === 4) break;
    m++; if (m > 12) { m = 1; y++; }
  }

  const types = Object.keys(targetTypes);
  const datasets = types.map(t => ({
    label: targetTypes[t].label,
    backgroundColor: targetTypes[t].color,
    borderRadius: 2,
    barPercentage: 0.75,
    data: months.map(month =>
      data.filter(i => i.date.startsWith(month) && i.targetType === t).length
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
        legend: { display: false },
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
              return lab.slice(2); // YY-MM
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

// ---- Target type breakdown (doughnut) ----
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

// ---- Group activity (horizontal bar) ----
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
        label: 'インシデント数',
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
  const max = Math.max(...values);
  const colors = values.map(v => {
    const t = v / max;
    // gradient from accent-2 to accent
    return `rgba(230, 57, 70, ${0.35 + t * 0.55})`;
  });

  if (regionChart) regionChart.destroy();
  regionChart = new Chart(document.getElementById('regionChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'インシデント数',
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
// 5) TABLE
// ----------------------------------------------------
function renderTable() {
  const data = getFiltered().slice().sort((a, b) => b.date.localeCompare(a.date));
  const tbody = document.querySelector('#incident-table tbody');
  tbody.innerHTML = data.map(i => {
    const tt = targetTypes[i.targetType];
    const grp = groups[i.group];
    return `
      <tr>
        <td class="td-date">${i.date}</td>
        <td class="td-loc">${i.location}<div style="color:#6b7280;font-family:var(--font-mono);font-size:10.5px;margin-top:2px">${i.region}</div></td>
        <td><span class="tag" style="background:${tt.color}25;color:${tt.color};border:1px solid ${tt.color}55">${tt.label}</span></td>
        <td><span class="tag" style="background:${grp.color}25;color:${grp.color};border:1px solid ${grp.color}55">${grp.label}</span></td>
        <td class="td-fat">${i.fatalities || '—'}</td>
        <td class="td-summary">${i.summary}</td>
        <td class="td-source"><a href="${i.sourceUrl}" target="_blank" rel="noopener">${i.source} ↗</a></td>
      </tr>
    `;
  }).join('');
  document.getElementById('table-count').textContent = `${data.length} 件`;
}

// ----------------------------------------------------
// 6) UPDATE ORCHESTRATOR
// ----------------------------------------------------
function updateAll() {
  syncChipStates();
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
  renderKPIs();
  renderFilterChips();
  initMap();
  updateAll();
});
