/* ============================================================
   MALI THREAT MONITOR — LONG RANGE (14 years) view
   ============================================================ */

// ----------------------------------------------------
// 0) Tab switching
// ----------------------------------------------------
(function setupViewTabs() {
  const subEl = () => document.getElementById('brand-sub');
  const SUB_TXT = {
    "13m": "May 2025 — Jun 2026 / 13-month timeline analysis",
    "14y": "Jan 2012 — Jun 2026 / 14-year macro analysis"
  };
  document.querySelectorAll('[data-view-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.viewTab;
      document.body.setAttribute('data-view', v);
      document.querySelectorAll('.view-tab').forEach(b =>
        b.classList.toggle('active', b === btn));
      if (subEl()) subEl().textContent = SUB_TXT[v];
      // When charts are initialized while display:none, their dimensions
      // become 0, so we resize Chart.js on tab switch.
      if (v === '14y' && window._longTimelineChart) {
        window._longTimelineChart.resize();
      }
    });
  });
})();

// ----------------------------------------------------
// 1) LONG KPI ROW
// ----------------------------------------------------
function renderLongKPIs() {
  const totalEvents = yearlyData.reduce((s, d) => s + d.events, 0);
  const totalFat    = yearlyData.reduce((s, d) => s + d.fatalities, 0);
  const totalCiv    = yearlyData.reduce((s, d) => s + d.civilianFatalities, 0);
  const peak = yearlyData.reduce((m, d) => d.fatalities > m.fatalities ? d : m, yearlyData[0]);
  const activeActors = Object.values(actors).filter(a => a.active.end >= 2025).length;

  const html = `
    <div class="kpi">
      <div class="kpi-label">Total Events (14 Years)</div>
      <div class="kpi-value">${totalEvents.toLocaleString()}</div>
      <div class="kpi-sub">2012-01 → 2026-06 (annual aggregate)</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Estimated Total Fatalities</div>
      <div class="kpi-value alert">${totalFat.toLocaleString()}+</div>
      <div class="kpi-sub">Civilians ~${totalCiv.toLocaleString()}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Worst Year</div>
      <div class="kpi-value warn">${peak.year}</div>
      <div class="kpi-sub">${peak.fatalities.toLocaleString()} killed (${peak.phase})</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">8 Phases</div>
      <div class="kpi-value">PA→PH</div>
      <div class="kpi-sub">Uprising → Capital encirclement</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Currently Active Actors</div>
      <div class="kpi-value">${activeActors}</div>
      <div class="kpi-sub">JNIM · FLA · FAMa · ISGS, etc.</div>
    </div>
  `;
  document.getElementById('long-kpi-row').innerHTML = html;
}

// ----------------------------------------------------
// 2) LONG PHASE TRACK (8 pills + ALL)
// ----------------------------------------------------
function renderLongPhaseTrack() {
  const track = document.getElementById('long-phase-track');

  const items = [
    { key: null, label: "All 14 Years", range: "2012 → 2026", color: "#9aa1ad",
      events: yearlyData.reduce((s, d) => s + d.events, 0) }
  ];
  longPhaseKeys.forEach(k => {
    const p = longPhases[k];
    const events = yearlyData.filter(d => d.phase === k).reduce((s, d) => s + d.events, 0);
    items.push({ key: k, label: p.label, range: p.range, color: p.color, events });
  });

  track.innerHTML = items.map(it => `
    <button class="phase-pill" data-long-phase="${it.key === null ? 'ALL' : it.key}"
            style="--pill-color:${it.color}">
      <div class="phase-pill-head">
        <span class="phase-pill-dot" style="background:${it.color}"></span>
        <span class="phase-pill-label">${it.label}</span>
        <span class="phase-pill-count">${it.events.toLocaleString()}</span>
      </div>
      <div class="phase-pill-range">${it.range}</div>
    </button>
  `).join('');

  // Click to scroll to milestones for the corresponding phase
  track.querySelectorAll('[data-long-phase]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.longPhase;
      if (key === 'ALL') {
        document.getElementById('long-kpi-row').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const target = document.querySelector(`#milestones-list [data-phase="${key}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

// ----------------------------------------------------
// 3) ANNUAL TIMELINE CHART (events + fatalities)
// ----------------------------------------------------
function buildLongTimelineChart() {
  const ctx = document.getElementById('longTimelineChart').getContext('2d');
  const labels = yearlyData.map(d => d.year);
  const eventBg = yearlyData.map(d => longPhases[d.phase].color);

  if (window._longTimelineChart) window._longTimelineChart.destroy();

  window._longTimelineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Events',
          data: yearlyData.map(d => d.events),
          backgroundColor: eventBg,
          borderColor: eventBg,
          borderWidth: 1,
          yAxisID: 'y',
          order: 2
        },
        {
          label: 'Fatalities',
          data: yearlyData.map(d => d.fatalities),
          type: 'line',
          borderColor: '#e63946',
          backgroundColor: 'rgba(230,57,70,0.12)',
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 4,
          pointBackgroundColor: '#e63946',
          yAxisID: 'y1',
          order: 1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#9aa1ad', font: { size: 11, family: 'Inter' } } },
        tooltip: {
          callbacks: {
            afterBody: (items) => {
              const row = yearlyData[items[0].dataIndex];
              return [
                `Phase: ${longPhases[row.phase].label}`,
                `Lead actor: ${row.dominantActor}`,
                `Civilian fatalities: ${row.civilianFatalities}`,
                `Note: ${row.notable}${row.partial ? ' (half year)' : ''}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9aa1ad', font: { family: 'JetBrains Mono', size: 10 } },
          grid:  { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          beginAtZero: true,
          position: 'left',
          title: { display: true, text: 'Events', color: '#9aa1ad', font: { size: 10 } },
          ticks: { color: '#9aa1ad', font: { family: 'JetBrains Mono', size: 10 } },
          grid:  { color: 'rgba(255,255,255,0.05)' }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          title: { display: true, text: 'Fatalities', color: '#e63946', font: { size: 10 } },
          ticks: { color: '#e63946', font: { family: 'JetBrains Mono', size: 10 } },
          grid:  { drawOnChartArea: false }
        }
      }
    }
  });
}

// ----------------------------------------------------
// 4) PHASE STRIP (8 phases as proportional horizontal bar)
// ----------------------------------------------------
function renderPhaseStrip() {
  const strip = document.getElementById('phase-strip');
  // Years per phase (PA = 1 year, PB = 2 years, etc.)
  const phaseYears = longPhaseKeys.map(k => ({
    key: k,
    years: yearlyData.filter(d => d.phase === k).length,
    phase: longPhases[k]
  }));
  const totalYears = phaseYears.reduce((s, p) => s + p.years, 0);

  strip.innerHTML = phaseYears.map(p => {
    const pct = (p.years / totalYears * 100).toFixed(2);
    return `
      <div class="phase-strip-segment" style="background:${p.phase.color};flex:${p.years} 0 0;width:${pct}%"
           title="${p.phase.label} / ${p.phase.range}">
        <div class="strip-key">${p.key}</div>
        <div class="strip-years">${p.years} yr</div>
      </div>
    `;
  }).join('');

  // Description cards for each phase below the strip
  const cards = document.createElement('div');
  cards.className = 'phase-strip-cards';
  cards.innerHTML = longPhaseKeys.map(k => {
    const p = longPhases[k];
    return `
      <div class="phase-strip-card" style="border-left-color:${p.color}">
        <div class="psc-head">
          <span class="psc-key" style="background:${p.color}">${k}</span>
          <span class="psc-label">${p.label.replace(/^P[A-H]\s/, '')}</span>
        </div>
        <div class="psc-range">${p.range}</div>
        <div class="psc-summary">${p.summary}</div>
      </div>
    `;
  }).join('');
  strip.parentNode.appendChild(cards);
}

// ----------------------------------------------------
// 5) ACTOR GANTT (12 actors × 14 years)
// ----------------------------------------------------
function renderActorGantt() {
  const cont = document.getElementById('actor-gantt');
  const years = [];
  for (let y = 2012; y <= 2026; y++) years.push(y);
  const totalSpan = years.length - 1; // 14 units

  // Header row
  const head = `
    <div class="ag-row ag-head">
      <div class="ag-label"></div>
      <div class="ag-track ag-track-head">
        ${years.map(y => `<div class="ag-year-tick">${y}</div>`).join('')}
      </div>
    </div>
  `;

  const rows = Object.entries(actors).map(([key, a]) => {
    const start = a.active.start;
    const end   = a.active.end;
    const leftPct  = ((start - 2012) / totalSpan) * 100;
    const widthPct = ((end - start) / totalSpan) * 100;
    const peakPct  = ((a.peak - 2012) / totalSpan) * 100;
    return `
      <div class="ag-row">
        <div class="ag-label">
          <span class="ag-dot" style="background:${a.color}"></span>
          <span class="ag-name">${a.label}</span>
        </div>
        <div class="ag-track">
          ${years.map(() => `<div class="ag-cell"></div>`).join('')}
          <div class="ag-bar" style="background:${a.color};left:${leftPct}%;width:${widthPct}%"
               title="${a.label} / ${Math.floor(start)}-${Math.floor(end)} / peak ${a.peak}"></div>
          <div class="ag-peak" style="left:${peakPct}%" title="Peak year: ${a.peak}"></div>
        </div>
      </div>
    `;
  }).join('');

  cont.innerHTML = head + rows;
}

// ----------------------------------------------------
// 6) REGION × YEAR HEATMAP
// ----------------------------------------------------
function renderRegionYearHeatmap() {
  const cont = document.getElementById('region-year-heatmap');
  const years = [];
  for (let y = 2012; y <= 2026; y++) years.push(y);

  // Compute max value across the whole matrix
  let maxVal = 0;
  regions14yr.forEach(r => regionYearMatrix[r].forEach(v => { if (v > maxVal) maxVal = v; }));

  const colorFor = (v) => {
    if (v === 0) return 'transparent';
    const t = Math.min(1, Math.sqrt(v / maxVal));
    // dark teal → red gradient
    const r = Math.round( 35 + (230 - 35)  * t);
    const g = Math.round( 70 + ( 57 - 70)  * t);
    const b = Math.round( 90 + ( 70 - 90)  * t);
    return `rgb(${r},${g},${b})`;
  };

  const headRow = `
    <tr>
      <th class="region-th">Region \\ Year</th>
      ${years.map(y => {
        const ph = phaseForYear(y);
        const color = ph ? longPhases[ph].color : '#666';
        return `<th class="year-th" style="border-bottom: 2px solid ${color}">
          <div class="yt-year">${y}</div>
          <div class="yt-phase" style="color:${color}">${ph || ''}</div>
        </th>`;
      }).join('')}
    </tr>
  `;

  const bodyRows = regions14yr.map(region => {
    const row = regionYearMatrix[region];
    const cells = row.map((v, idx) => {
      const bg = colorFor(v);
      const cls = v === 0 ? 'heatmap-cell zero' : 'heatmap-cell';
      return `<td class="${cls}" style="background:${bg}"
                title="${region} / ${years[idx]} / ~${v} events">${v || '·'}</td>`;
    }).join('');
    return `<tr><td class="region-name">${region}</td>${cells}</tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="heatmap-table region-year-table">
      <thead>${headRow}</thead>
      <tbody>${bodyRows}</tbody>
    </table>
    <div class="hm-legend">
      <span class="hm-leg-label">0</span>
      <div class="hm-leg-bar"></div>
      <span class="hm-leg-label">${maxVal}+</span>
    </div>
  `;
}

// ----------------------------------------------------
// 7) MILESTONES LIST (grouped by phase)
// ----------------------------------------------------
function renderMilestonesList() {
  const cont = document.getElementById('milestones-list');
  // Group by phase
  const byPhase = {};
  longPhaseKeys.forEach(k => { byPhase[k] = []; });
  milestones.forEach(m => { if (byPhase[m.phase]) byPhase[m.phase].push(m); });

  const typeLabel = {
    uprising: "Uprising", coup: "Coup", intervention: "Intervention", deployment: "Deployment",
    peace: "Peace", formation: "Formation", massacre: "Massacre", withdrawal: "Withdrawal",
    milestone: "Milestone", tactic: "Tactical shift", attack: "Attack"
  };

  cont.innerHTML = longPhaseKeys.map(k => {
    const list = byPhase[k];
    if (list.length === 0) return '';
    const p = longPhases[k];
    return `
      <div class="ml-group" data-phase="${k}">
        <div class="ml-group-head" style="border-left-color:${p.color}">
          <span class="ml-group-key" style="background:${p.color}">${k}</span>
          <span class="ml-group-label">${p.label.replace(/^P[A-H]\s/, '')}</span>
          <span class="ml-group-range">${p.range}</span>
        </div>
        <div class="ml-items">
          ${list.map(m => `
            <div class="ml-item">
              <div class="ml-date">${m.date}</div>
              <div class="ml-body">
                <div class="ml-title">
                  <span class="ml-type" style="background:${p.color}22;color:${p.color}">${typeLabel[m.type] || m.type}</span>
                  ${m.title}
                </div>
                <div class="ml-desc">${m.description}</div>
                <a class="ml-source" href="${m.source}" target="_blank" rel="noopener">Source ↗</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ----------------------------------------------------
// INIT
// ----------------------------------------------------
function initLongView() {
  renderLongKPIs();
  renderLongPhaseTrack();
  buildLongTimelineChart();
  renderPhaseStrip();
  renderActorGantt();
  renderRegionYearHeatmap();
  renderMilestonesList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLongView);
} else {
  initLongView();
}
