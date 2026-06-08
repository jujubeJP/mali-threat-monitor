/* ============================================================
   MALI THREAT MONITOR - LONG RANGE DATA (2012-2026, 14 years)
   ------------------------------------------------------------
   Sources:
   - ACLED (https://acleddata.com) — Mali coverage 1997-present
   - ACLED Year in Review 2022 / Conflict Watchlist 2023, 2026
   - ACLED Africa Overview (monthly editions)
   - OECD: Military coups, jihadism and insecurity in the Central Sahel (2024)
   - UN MINUSMA / Human Rights Watch / ISS Africa
   - The New Humanitarian Mali timeline
   - ICCT, Soufan Center, CSIS, BISI
   
   Note: Annual incident and fatality counts are rounded estimates based on
       published ACLED figures. ACLED itself notes that data is a continuously
       updated "living dataset" and past figures may be revised.
       This data is optimized for reading macro structural changes.
   ============================================================ */

// ----------------------------------------------------
// 8 Phase classification (January 2012 – present)
// ----------------------------------------------------
const longPhases = {
  PA: {
    key: "PA",
    label: "PA Uprising / Northern Independence",
    range: "Jan-Dec 2012",
    color: "#1d3557",
    summary: "MNLA uprising → March coup → April Azawad independence declaration → Islamist forces (Ansar Dine, AQIM) seize the north. Convergence of Tuareg separatism and jihadism."
  },
  PB: {
    key: "PB",
    label: "PB French Intervention / Northern Recapture",
    range: "Jan 2013 - Dec 2014",
    color: "#457b9d",
    summary: "France launches Operation Serval in January, recapturing Gao, Timbuktu, and Kidal within three weeks. Serval transitions to Operation Barkhane (August 2014). MINUSMA deployed. Anti-government forces resurge in Kidal in 2014."
  },
  PC: {
    key: "PC",
    label: "PC Algiers Accord / Low-intensity Continuation",
    range: "Jan 2015 - Dec 2016",
    color: "#a8dadc",
    summary: "Algiers Peace Accord signed in June 2015. However, JNIM precursors (Ansar Dine, Katiba Macina, etc.) spread into the central Mopti region. Low-intensity persistent attacks become entrenched in the center."
  },
  PD: {
    key: "PD",
    label: "PD JNIM Formation / Violence Surge",
    range: "Jan 2017 - Dec 2019",
    color: "#e9c46a",
    summary: "JNIM formed in March 2017 (coalition of AQIM, Ansar Dine, Katiba Macina, al-Mourabitoun). Intercommunal violence explodes in the center; Dogon-Fulani militia clashes. Ogossagou massacre in 2019 (160 killed). Annual fatalities roughly six times 2016 levels."
  },
  PE: {
    key: "PE",
    label: "PE Twin Coups / Transitional Government",
    range: "Jan 2020 - Nov 2021",
    color: "#f4a261",
    summary: "Goïta coup in August 2020, second coup in May 2021. Deteriorating relations with France; ECOWAS sanctions imposed. ISGS–JNIM rivalry intensifies, with JNIM gaining the upper hand."
  },
  PF: {
    key: "PF",
    label: "PF Wagner Era / All-time High",
    range: "Dec 2021 - Dec 2023",
    color: "#e76f51",
    summary: "Wagner Group arrives in December 2021; FAMa+Wagner operations against civilians escalate in scale. Moura massacre in 2022 (500+ killed). Fatality counts reach historic highs. MINUSMA withdraws in 2023; Kidal retaken by government forces."
  },
  PG: {
    key: "PG",
    label: "PG Peace Collapse / JNIM Expansion",
    range: "Jan 2024 - Aug 2025",
    color: "#d62828",
    summary: "Mali government unilaterally terminates the Algiers Accord in January 2024. JNIM resumes frontal assaults on military garrisons (Boulikessi, Tessit). Wagner announces withdrawal in June 2025, handing over to successor Africa Corps. Tactical shift from central civilian attacks back to military-base assaults."
  },
  PH: {
    key: "PH",
    label: "PH Encirclement / Capital Pressure",
    range: "Sep 2025 - Jun 2026",
    color: "#7209b7",
    summary: "JNIM begins fuel blockade in September 2025 (large-scale tanker truck attacks on routes to Bamako). On 25 April 2026, coordinated JNIM+FLA assault on the capital; Defense Minister assassinated; Kidal falls. May–June: northern withdrawals, major Mopti offensive, capital encirclement phase begins."
  }
};

const longPhaseKeys = ["PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH"];

// ----------------------------------------------------
// Annual aggregate data (estimated incident and fatality counts)
// Note: Rounded estimates based on ACLED annual aggregates
//       (Year in Review, Conflict Index, Watchlist, and other published figures)
// ----------------------------------------------------
const yearlyData = [
  // year, events, fatalities, phase, civilianFatalities, dominantActor, notable
  { year: 2012, events: 410,  fatalities: 920,   phase: "PA", civilianFatalities: 350,  dominantActor: "MNLA/Ansar Dine/AQIM", notable: "MNLA uprising, northern independence declaration, March coup" },
  { year: 2013, events: 350,  fatalities: 750,   phase: "PB", civilianFatalities: 220,  dominantActor: "Ansar Dine/AQIM",        notable: "French Operation Serval, northern recapture" },
  { year: 2014, events: 270,  fatalities: 480,   phase: "PB", civilianFatalities: 140,  dominantActor: "MNLA/Ansar Dine",        notable: "Anti-government forces resurge in Kidal, transition to Barkhane" },
  { year: 2015, events: 320,  fatalities: 440,   phase: "PC", civilianFatalities: 160,  dominantActor: "Katiba Macina/Ansar Dine", notable: "Algiers Peace Accord signed in June, Mopti spread begins" },
  { year: 2016, events: 380,  fatalities: 520,   phase: "PC", civilianFatalities: 200,  dominantActor: "Katiba Macina",          notable: "Attacks become entrenched in the center" },
  { year: 2017, events: 540,  fatalities: 950,   phase: "PD", civilianFatalities: 360,  dominantActor: "JNIM",                   notable: "JNIM formed in March, coalition established" },
  { year: 2018, events: 730,  fatalities: 1450,  phase: "PD", civilianFatalities: 540,  dominantActor: "JNIM/ISGS",              notable: "Dogon-Fulani intercommunal violence intensifies" },
  { year: 2019, events: 1050, fatalities: 2350,  phase: "PD", civilianFatalities: 980,  dominantActor: "JNIM/Dogon militias",    notable: "Ogossagou massacre (160 killed), militia conflict peaks" },
  { year: 2020, events: 1180, fatalities: 2410,  phase: "PE", civilianFatalities: 870,  dominantActor: "JNIM/ISGS",              notable: "Goïta coup in August" },
  { year: 2021, events: 1320, fatalities: 2580,  phase: "PE", civilianFatalities: 1010, dominantActor: "JNIM/ISGS",              notable: "Second coup in May, Wagner arrives in December" },
  { year: 2022, events: 1740, fatalities: 4910,  phase: "PF", civilianFatalities: 2640, dominantActor: "FAMa+Wagner/JNIM",       notable: "Moura massacre (500+ killed), worst year on record" },
  { year: 2023, events: 1880, fatalities: 6320,  phase: "PF", civilianFatalities: 2890, dominantActor: "FAMa+Wagner/JNIM",       notable: "MINUSMA withdraws, Kidal retaken by government forces" },
  { year: 2024, events: 1610, fatalities: 5240,  phase: "PG", civilianFatalities: 2200, dominantActor: "JNIM/FAMa+Wagner",       notable: "Algiers Accord terminated in January, JNIM resumes military-base assaults" },
  { year: 2025, events: 1520, fatalities: 4180,  phase: "PG", civilianFatalities: 1640, dominantActor: "JNIM/FLA",               notable: "Wagner withdrawal announced in June, fuel blockade begins in September" },
  { year: 2026, events: 680,  fatalities: 2240,  phase: "PH", civilianFatalities: 720,  dominantActor: "JNIM+FLA coordinated",   notable: "Coordinated capital assault in April, northern losses May–June (partial year)", partial: true }
];

// ----------------------------------------------------
// Key milestones timeline (strategic turning points)
// ----------------------------------------------------
const milestones = [
  { date: "2012-01", phase: "PA", type: "uprising",   title: "MNLA Uprising", description: "On 17 January, Tuareg MNLA attacks Ménaka, launching the northern liberation war", source: "https://www.thenewhumanitarian.org/report/95252/mali-timeline-northern-conflict" },
  { date: "2012-03", phase: "PA", type: "coup",       title: "Captain Sanogo Coup", description: "On 21 March, the Touré government is overthrown citing failures in the northern response", source: "https://en.wikipedia.org/wiki/Mali_War" },
  { date: "2012-04", phase: "PA", type: "milestone",  title: "Azawad Independence Declaration", description: "On 6 April, MNLA declares independence of northern Azawad (not recognized by the international community)", source: "https://pksoi.armywarcollege.edu/index.php/minusma-timeline-since-2007-conflict-in-mali/" },
  { date: "2012-06", phase: "PA", type: "milestone",  title: "Ansar Dine Control Established", description: "June–July: Ansar Dine and AQIM expel MNLA, seizing Timbuktu, Gao, and Kidal", source: "https://pksoi.armywarcollege.edu/index.php/minusma-timeline-since-2007-conflict-in-mali/" },
  { date: "2013-01", phase: "PB", type: "intervention", title: "Operation Serval Launched", description: "France launches Operation Serval on 11 January, recapturing Gao, Timbuktu, and Kidal within three weeks", source: "https://www.csis.org/programs/warfare-irregular-threats-and-terrorism-program/jamaat-nasr-al-islam-wal-muslimin-jnim" },
  { date: "2013-04", phase: "PB", type: "deployment", title: "MINUSMA Established", description: "UN Security Council authorizes MINUSMA deployment; full operations begin in July", source: "https://news.un.org/en/story/2023/12/1145207" },
  { date: "2014-08", phase: "PB", type: "milestone",  title: "Transition to Operation Barkhane", description: "Serval ends; expands into the Sahel-wide Operation Barkhane (5,100 personnel)", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2015-06", phase: "PC", type: "peace",      title: "Algiers Peace Accord", description: "On 20 June, the government, Tuareg CMA, and pro-government militias sign the peace accord", source: "https://en.wikipedia.org/wiki/Algiers_Accords_(2015)" },
  { date: "2017-03", phase: "PD", type: "formation",  title: "JNIM Formed", description: "In March, AQIM, Ansar Dine, Katiba Macina, and al-Mourabitoun unite to form JNIM", source: "https://www.aljazeera.com/news/2025/11/6/is-mali-about-to-fall-to-al-qaeda-affiliate-jnim" },
  { date: "2019-03", phase: "PD", type: "massacre",   title: "Ogossagou Massacre", description: "On 23 March, Dogon militiamen attack the Fulani village of Ogossagou, killing approximately 160 people", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2020-08", phase: "PE", type: "coup",       title: "Goïta Coup", description: "On 18 August, Colonel Assimi Goïta ousts President Keïta and establishes the CNSP", source: "https://en.wikipedia.org/wiki/2020_Malian_coup_d'%C3%A9tat" },
  { date: "2021-05", phase: "PE", type: "coup",       title: "Second Coup", description: "On 24 May, Goïta removes transitional government leaders and assumes the presidency himself", source: "https://issafrica.org/iss-today/a-new-coup-derails-malis-transition" },
  { date: "2021-12", phase: "PF", type: "deployment", title: "Wagner Group Arrives", description: "In December, approximately 1,000 Russian Wagner Group personnel begin deploying to Mali", source: "https://www.csis.org/analysis/tracking-arrival-russias-wagner-group-mali" },
  { date: "2022-03", phase: "PF", type: "massacre",   title: "Moura Massacre", description: "27–31 March: FAMa+Wagner kill 500+ people in the village of Moura (per HRW investigation)", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2022-08", phase: "PF", type: "withdrawal", title: "Barkhane Withdrawal Complete", description: "On 15 August, France completes its military withdrawal from Mali", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2023-08", phase: "PF", type: "milestone",  title: "CMA Rearms / Northern Front Revives", description: "In August, CSP-PSD and FAMa+Wagner clash over handover of the Ber base", source: "https://en.wikipedia.org/wiki/Algiers_Accords_(2015)" },
  { date: "2023-11", phase: "PF", type: "milestone",  title: "Kidal Retaken by Government Forces", description: "On 14 November, FAMa+Wagner retake Kidal with drone strike support", source: "https://www.hrw.org/news/2024/01/26/malis-peace-deal-ends" },
  { date: "2023-12", phase: "PF", type: "withdrawal", title: "MINUSMA Withdrawal Complete", description: "On 31 December, the decade-long MINUSMA mission fully concludes", source: "https://news.un.org/en/story/2023/12/1145207" },
  { date: "2024-01", phase: "PG", type: "milestone",  title: "Algiers Accord Terminated", description: "On 25 January, the Mali government unilaterally announces the end of the Algiers Peace Accord", source: "https://www.hrw.org/news/2024/01/26/malis-peace-deal-ends" },
  { date: "2025-06", phase: "PG", type: "withdrawal", title: "Wagner Withdrawal Announced", description: "On 6 June, Wagner declares 'mission complete' and withdraws from Mali, handing over to Africa Corps", source: "https://en.wikipedia.org/wiki/Wagner_Group_activities_in_Africa" },
  { date: "2025-09", phase: "PH", type: "tactic",     title: "JNIM Fuel Blockade Begins", description: "In September, JNIM launches large-scale attacks on tanker trucks supplying Bamako", source: "https://www.aljazeera.com/news/2025/11/6/is-mali-about-to-fall-to-al-qaeda-affiliate-jnim" },
  { date: "2026-04", phase: "PH", type: "attack",     title: "25 April Coordinated Capital Assault", description: "JNIM+FLA coordinated assault on Bamako; Defense Minister Camara assassinated; Kidal falls", source: "https://icct.nl/publication/mali-what-were-reasons-and-consequences-25-april-attacks" },
  { date: "2026-06", phase: "PH", type: "milestone",  title: "Major Mopti Offensive / Northern Losses", description: "Withdrawal from Tessalit/Aguelhok; major Mopti offensive; capital encirclement phase begins", source: "https://acleddata.com/update/africa-overview-june-2026" }
];

// ----------------------------------------------------
// Actor activity timeline (who was the dominant player and when)
// ----------------------------------------------------
const actors = {
  MNLA:        { label: "MNLA (Tuareg separatists)",          color: "#06d6a0", active: { start: 2012, end: 2014 }, peak: 2012 },
  AnsarDine:   { label: "Ansar Dine",                         color: "#9d4edd", active: { start: 2012, end: 2017 }, peak: 2012 },
  AQIM:        { label: "AQIM (Sahara)",                      color: "#118ab2", active: { start: 2012, end: 2017 }, peak: 2013 },
  JNIM:        { label: "JNIM (al-Qaeda affiliate)",          color: "#e63946", active: { start: 2017, end: 2026 }, peak: 2026 },
  ISGS:        { label: "ISGS / IS Sahel",                    color: "#ff7700", active: { start: 2015, end: 2026 }, peak: 2022 },
  France:      { label: "French Forces (Serval/Barkhane)",    color: "#264653", active: { start: 2013, end: 2022 }, peak: 2014 },
  MINUSMA:     { label: "MINUSMA",                            color: "#52b788", active: { start: 2013, end: 2023 }, peak: 2017 },
  FAMa:        { label: "FAMa (Malian Armed Forces)",         color: "#fcbf49", active: { start: 2012, end: 2026 }, peak: 2023 },
  Wagner:      { label: "Wagner Group",                       color: "#8d99ae", active: { start: 2021.95, end: 2025.5 }, peak: 2023 },
  AfricaCorps: { label: "Africa Corps (Wagner successor)",    color: "#6c757d", active: { start: 2025.5, end: 2026 }, peak: 2026 },
  FLA:         { label: "FLA (Tuareg separatists, new)",      color: "#2a9d8f", active: { start: 2024, end: 2026 }, peak: 2026 },
  CMA:         { label: "CMA / CSP-PSD",                      color: "#43aa8b", active: { start: 2014, end: 2024 }, peak: 2023 }
};

// ----------------------------------------------------
// Region × Year heatmap aggregates (9 major regions)
// Each value is an estimated incident count
// ----------------------------------------------------
const regionYearMatrix = {
  // region: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
  Mopti:     [10,  20,  35,  60,  90, 130, 220, 320, 350, 380, 470, 480, 410, 380, 180],
  Gao:       [110, 90,  60,  50,  55,  75,  95, 130, 170, 200, 250, 290, 230, 210,  90],
  Timbuktu:  [95,  85,  55,  45,  50,  60,  70, 100, 140, 170, 220, 260, 210, 180,  70],
  Kidal:     [85,  75,  45,  30,  35,  40,  45,  55,  60,  70,  90, 130,  90,  90,  60],
  Ménaka:    [25,  20,  15,  20,  30,  60,  85, 130, 150, 170, 280, 240, 180, 160,  60],
  Ségou:     [15,  20,  20,  25,  35,  55,  90, 120, 140, 150, 180, 200, 180, 170,  60],
  Sikasso:   [5,   5,   5,   8,  10,  15,  25,  35,  45,  60,  80,  90,  85,  90,  40],
  Koulikoro: [10,  10,  10,  12,  15,  20,  30,  45,  55,  65,  85, 110, 100, 110,  60],
  Bamako:    [25,  10,  8,   10,  12,  15,  20,  25,  35,  40,  50,  55,  50,  55,  60],
  Kayes:     [5,   5,   5,   5,   6,   8,  12,  20,  25,  40,  55,  65,  60,  70,  40]
};
const regions14yr = Object.keys(regionYearMatrix);

// ----------------------------------------------------
// Year → Phase lookup
// ----------------------------------------------------
function phaseForYear(year) {
  const row = yearlyData.find(d => d.year === year);
  return row ? row.phase : null;
}
