// Republic of Mali — Security Incident Dataset (May 2025 – early June 2026)
// Sources: ACLED, Wikipedia, Al Jazeera, BBC, Bellingcat, ICCT, Soufan Center,
// BISI, Africa Defense Forum, dialogueinitiatives.org, Critical Threats,
// Global Centre for R2P, Reuters, africanews, hollister situation report

// Timeline phase definitions
// P1: Military Base Assault Phase     (May–Aug 2025)       — Large-scale base assaults, northern-focused
// P2: Economic Blockade Phase         (Sep 2025–Mar 2026)  — Fuel supply route interdiction, western expansion
// P3: Coordinated Capital Strike Phase (April 2026)        — JNIM+FLA coordination, fall of Kidal
// P4: Encirclement / Northern Collapse Phase (May–Jun 2026) — Bamako blockade tightened, northern withdrawal complete

const phases = {
  P1: { label: "P1 Military Base Assault",            range: "May-Aug 2025",         color: "#d62828" },
  P2: { label: "P2 Economic Blockade",                range: "Sep 2025 - Mar 2026",  color: "#f77f00" },
  P3: { label: "P3 Coordinated Capital Strike",       range: "April 2026",           color: "#7209b7" },
  P4: { label: "P4 Encirclement / Northern Collapse", range: "May-Jun 2026",         color: "#2a9d8f" }
};

const incidents = [
  // =================== P1: Military Base Assault Phase (May–Aug 2025) ===================
  {
    id: 1, phase: "P1",
    date: "2025-05-23",
    location: "Dioura", region: "Mopti",
    lat: 14.917, lng: -3.0,
    targetType: "military_base", group: "JNIM",
    fatalities: 41,
    summary: "JNIM launched a raid on the military base at Dioura, killing 41 Malian soldiers. Weapons and vehicles were seized.",
    source: "Wikipedia / RFI",
    sourceUrl: "https://en.wikipedia.org/wiki/2025_Dioura_attack"
  },
  {
    id: 2, phase: "P1",
    date: "2025-06-01",
    location: "Boulikessi", region: "Mopti",
    lat: 14.617, lng: -1.567,
    targetType: "military_base", group: "JNIM",
    fatalities: 100,
    summary: "JNIM overran the military base near the Burkina Faso border, killing approximately 100 Malian soldiers and capturing 22 others; 174 AK-74 rifles were seized. This was the single largest Malian military loss of 2025.",
    source: "Wikipedia / Soufan Center",
    sourceUrl: "https://en.wikipedia.org/wiki/Battle_of_Boulikessi_(2025)"
  },
  {
    id: 3, phase: "P1",
    date: "2025-06-02",
    location: "Timbuktu", region: "Timbuktu",
    lat: 16.7666, lng: -3.0026,
    targetType: "airport", group: "JNIM",
    fatalities: 60,
    summary: "A VBIED attack targeted the Timbuktu airport, which serves as a Malian Armed Forces and Wagner Group base; three checkpoints north and east of the city were struck simultaneously. More than 60 Malian soldiers were killed.",
    source: "Wikipedia / AFP",
    sourceUrl: "https://en.wikipedia.org/wiki/2025_Timbuktu_attack"
  },
  {
    id: 4, phase: "P1",
    date: "2025-06-04",
    location: "Tessit", region: "Gao",
    lat: 15.077, lng: 0.766,
    targetType: "military_base", group: "ISGS",
    fatalities: 90,
    summary: "Islamic State in the Greater Sahara (ISGS) attacked the military base at Tessit, killing 40 Malian soldiers along with approximately 50 GATIA fighters and civilians. Weapons and vehicles were looted.",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/2025_Tessit_attack"
  },
  {
    id: 5, phase: "P1",
    date: "2025-07-01",
    location: "Kayes", region: "Kayes",
    lat: 14.4469, lng: -11.4456,
    targetType: "city_multiple", group: "JNIM",
    fatalities: 15,
    summary: "Katiba Macina (a JNIM affiliate) simultaneously attacked eight locations in the west, including the first-ever attack on the regional capital Kayes and the closest strike to date on the Diboli border crossing with Senegal. Three Indian engineers were abducted.",
    source: "Critical Threats / African Security Analysis",
    sourceUrl: "https://www.criticalthreats.org/analysis/salafi-jihadi-areas-of-operation-in-west-africa-interactive-map-and-campaign-analysis"
  },
  {
    id: 6, phase: "P1",
    date: "2025-07-01",
    location: "Nioro du Sahel", region: "Kayes",
    lat: 15.2275, lng: -9.5847,
    targetType: "city_multiple", group: "JNIM",
    fatalities: 5,
    summary: "JNIM carried out simultaneous attacks on Nioro, Nyamina, Sandare, Diboli, and other towns across Kayes region, marking a full escalation of the western encirclement strategy.",
    source: "Critical Threats",
    sourceUrl: "https://www.criticalthreats.org/analysis/salafi-jihadi-areas-of-operation-in-west-africa-interactive-map-and-campaign-analysis"
  },
  {
    id: 7, phase: "P1",
    date: "2025-07-01",
    location: "Sandare", region: "Kayes",
    lat: 14.422, lng: -10.343,
    targetType: "kidnapping", group: "JNIM",
    fatalities: 0,
    summary: "Militants attacked a cement factory in Kayes region and abducted three Indian engineers. The incident is part of a broader 'economic warfare' strategy targeting foreign workers.",
    source: "African Security Analysis",
    sourceUrl: "https://www.africansecurityanalysis.org/updates/kidnapping-incident-in-kobri-mali-on-november-6-2025"
  },
  {
    id: 8, phase: "P1",
    date: "2025-08-19",
    location: "Farabougou", region: "Ségou",
    lat: 14.05, lng: -6.55,
    targetType: "military_base", group: "JNIM",
    fatalities: 21,
    summary: "JNIM stormed and occupied the military garrison and surrounding village of Farabougou, seizing 15 vehicles and more than 50 weapons. JNIM subsequently assumed de facto control of the town.",
    source: "Ujasusi Blog / SITE Intelligence",
    sourceUrl: "https://www.ujasusi.com/p/mali-army-jnim-attacks-august-2025-intelligence-brief"
  },
  {
    id: 9, phase: "P1",
    date: "2025-08-19",
    location: "Biriki-Wéré", region: "Ségou",
    lat: 14.12, lng: -6.42,
    targetType: "military_base", group: "JNIM",
    fatalities: 0,
    summary: "A coordinated attack was launched against the military position at Biriki-Wéré in parallel with the Farabougou assault.",
    source: "Ujasusi Blog",
    sourceUrl: "https://www.ujasusi.com/p/mali-army-jnim-attacks-august-2025-intelligence-brief"
  },

  // =================== P2: Economic Blockade Phase (Sep 2025 – Mar 2026) ===================
  {
    id: 10, phase: "P2",
    date: "2025-09-03",
    location: "Bamako", region: "Bamako",
    lat: 12.6392, lng: -8.0029,
    targetType: "blockade", group: "JNIM",
    fatalities: 0,
    summary: "JNIM spokesman al-Bambari officially declared a fuel blockade, designating fuel tanker convoys travelling overland from Senegal, Côte d'Ivoire, and Guinea to landlocked Mali as primary targets. This marked the start of the Bamako encirclement strategy.",
    source: "Wikipedia / Al Jazeera",
    sourceUrl: "https://en.wikipedia.org/wiki/Mali_fuel_blockade"
  },
  {
    id: 11, phase: "P2",
    date: "2025-09-14",
    location: "Lakamane (Kayes region)", region: "Kayes",
    lat: 14.55455, lng: -9.98426,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 1,
    summary: "A fuel convoy from Senegal was ambushed between Kaniara and Lakamane; tanker trucks were blown up and one Malian military vehicle and one soldier were destroyed. Bellingcat geolocated the site using satellite imagery.",
    source: "Bellingcat",
    sourceUrl: "https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/"
  },
  {
    id: 12, phase: "P2",
    date: "2025-09-19",
    location: "Neguela-Soribougou (Koulikoro)", region: "Koulikoro",
    lat: 12.90289, lng: -8.56459,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 0,
    summary: "A fuel convoy was ambushed 70 km northwest of Bamako; nine tanker trucks were destroyed by fire. The incident was confirmed via NASA FIRMS and Sentinel-2 satellite imagery.",
    source: "Bellingcat / NASA FIRMS",
    sourceUrl: "https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/"
  },
  {
    id: 13, phase: "P2",
    date: "2025-09-15",
    location: "Bamako (south, ranching area)", region: "Bamako",
    lat: 12.45, lng: -8.05,
    targetType: "kidnapping", group: "JNIM",
    fatalities: 0,
    summary: "Militants raided a farm owned by a 78-year-old Dubai royal and abducted the owner, also destroying a private aircraft hangar on the property. The UAE reportedly paid over $20 million in ransom.",
    source: "Africa Defense Forum / Wall Street Journal",
    sourceUrl: "https://adf-magazine.com/2025/12/jnim-targets-wealthy-foreigners-for-ransoms/"
  },
  {
    id: 14, phase: "P2",
    date: "2025-10-17",
    location: "Kolondieba-Kadiana", region: "Sikasso",
    lat: 10.82640, lng: -6.67186,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 0,
    summary: "Fuel transport vehicles were attacked between Kolondieba and Kadiana; more than 50 tanker trucks were burned. Motorcycle-mounted fighters were identified in video footage of the attack.",
    source: "Bellingcat",
    sourceUrl: "https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/"
  },
  {
    id: 15, phase: "P2",
    date: "2025-10-21",
    location: "Sikasso", region: "Sikasso",
    lat: 11.17092, lng: -5.62559,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 1,
    summary: "More than 40 fuel transport vehicles were destroyed near Sikasso; one armed body was recovered at the scene.",
    source: "Bellingcat",
    sourceUrl: "https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/"
  },
  {
    id: 16, phase: "P2",
    date: "2025-10-28",
    location: "Neguela-Soribougou (2nd)", region: "Koulikoro",
    lat: 12.90847, lng: -8.60058,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 0,
    summary: "A second fuel convoy ambush struck just north of the September attack site, demonstrating a recurring tactical pattern on this route.",
    source: "Bellingcat",
    sourceUrl: "https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/"
  },
  {
    id: 17, phase: "P2",
    date: "2025-11-06",
    location: "Zegoua-Sikasso (Fachoribougou)", region: "Sikasso",
    lat: 11.12997, lng: -5.60889,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 0,
    summary: "A convoy entering from the Côte d'Ivoire border was attacked; at least nine tanker trucks were burned at Fachoribougou.",
    source: "Bellingcat",
    sourceUrl: "https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/"
  },
  {
    id: 18, phase: "P2",
    date: "2025-11-06",
    location: "Kobri (Kayes region)", region: "Kayes",
    lat: 14.30, lng: -11.20,
    targetType: "kidnapping", group: "JNIM",
    fatalities: 0,
    summary: "Five Indian nationals employed in the energy sector were abducted near the Senegalese border. The targeting of foreign workers as part of an 'economic warfare' campaign continued.",
    source: "African Security Analysis",
    sourceUrl: "https://www.africansecurityanalysis.org/updates/kidnapping-incident-in-kobri-mali-on-november-6-2025"
  },
  {
    id: 19, phase: "P2",
    date: "2025-11-01",
    location: "Eastern Mali (Niger corridor)", region: "Gao",
    lat: 16.27, lng: 0.03,
    targetType: "blockade", group: "JNIM",
    fatalities: 0,
    summary: "JNIM extended the blockade to eastern supply routes via Niger, effectively cutting off an estimated 95% of Mali's petroleum imports.",
    source: "Critical Threats",
    sourceUrl: "https://www.criticalthreats.org/analysis/salafi-jihadi-areas-of-operation-in-west-africa-interactive-map-and-campaign-analysis"
  },
  {
    id: 20, phase: "P2",
    date: "2025-12-15",
    location: "Ségou region (curfew zone)", region: "Ségou",
    lat: 13.4317, lng: -6.2157,
    targetType: "civilian", group: "JNIM",
    fatalities: 8,
    summary: "According to OCHA, IED-related humanitarian access constraints in Ségou, Sikasso, and Timbuktu increased by 155% month-on-month. Civilian casualties continued to accumulate.",
    source: "Global Centre for R2P / OCHA",
    sourceUrl: "https://www.globalr2p.org/countries/mali/"
  },
  {
    id: 21, phase: "P2",
    date: "2026-01-15",
    location: "Bamako (siege ongoing)", region: "Bamako",
    lat: 12.6392, lng: -8.0029,
    targetType: "blockade", group: "JNIM",
    fatalities: 0,
    summary: "An ICT report documented the ongoing JNIM siege of Bamako, describing critical shortages of fuel and food and the closure of schools and hospitals.",
    source: "ICT (International Institute for Counter-Terrorism)",
    sourceUrl: "https://ict.org.il/conquest-of-mali-jnim/"
  },
  {
    id: 22, phase: "P2",
    date: "2026-02-10",
    location: "Mopti / Sévaré", region: "Mopti",
    lat: 14.4843, lng: -4.0185,
    targetType: "civilian", group: "JNIM",
    fatalities: 12,
    summary: "Abductions and forced collection of zakat (Islamic tax) continued in central Mali, with Ménaka also affected.",
    source: "Global Centre for R2P",
    sourceUrl: "https://www.globalr2p.org/countries/mali/"
  },
  {
    id: 23, phase: "P2",
    date: "2026-03-15",
    location: "Southwest Mali (new spread)", region: "Sikasso",
    lat: 11.317, lng: -5.667,
    targetType: "civilian", group: "JNIM",
    fatalities: 6,
    summary: "Violence expanded into the southwest. OCHA recorded 3,737 security incidents across the central Sahel between January and December 2025, resulting in 9,362 deaths.",
    source: "Global Centre for R2P / OCHA",
    sourceUrl: "https://www.globalr2p.org/countries/mali/"
  },

  // =================== P3: Coordinated Capital Strike Phase (April 2026) ===================
  {
    id: 24, phase: "P3",
    date: "2026-04-25",
    location: "Kati / Bamako", region: "Bamako",
    lat: 12.7411, lng: -8.0708,
    targetType: "assassination", group: "JNIM+FLA",
    fatalities: 16,
    summary: "Around 05:20, two explosions and a firefight erupted at the main Kati military base; a VBIED attack killed Malian Defence Minister General Sadio Camara. Fighting continued in the Mamaribougou district, with Africa Corps mercenaries engaging the attackers.",
    source: "Wikipedia / Al Jazeera",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: 25, phase: "P3",
    date: "2026-04-25",
    location: "Modibo Keita International Airport", region: "Bamako",
    lat: 12.5335, lng: -7.9499,
    targetType: "airport", group: "JNIM+FLA",
    fatalities: 0,
    summary: "Heavy gunfire and explosions were reported near Bamako's international airport, causing all flights to be cancelled. Three helicopters conducted surveillance sorties over the area, and the Africa Corps base near the airport was targeted.",
    source: "Al Jazeera / NPR",
    sourceUrl: "https://www.aljazeera.com/news/2026/4/25/mali-army-says-armed-groups-launch-nationwide-attacks-gunfire-near-airport"
  },
  {
    id: 26, phase: "P3",
    date: "2026-04-25",
    location: "Kidal", region: "Kidal",
    lat: 18.4411, lng: 1.4078,
    targetType: "city_multiple", group: "FLA",
    fatalities: 0,
    summary: "The Front for the Liberation of Azawad (FLA) seized most of Kidal, with footage confirming FLA fighters inside the governor's residence; Malian and Russian forces retreated to the former MINUSMA base before withdrawing under a negotiated Africa Corps safe-passage agreement. This was the first loss of Kidal since the Malian army recaptured it in November 2023.",
    source: "Wikipedia / Al Jazeera",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: 27, phase: "P3",
    date: "2026-04-25",
    location: "Gao", region: "Gao",
    lat: 16.2667, lng: -0.05,
    targetType: "city_multiple", group: "JNIM+FLA",
    fatalities: 0,
    summary: "Clashes erupted in Gao city, with FLA fighters seizing parts of the urban area. A Malian Air Force Mi-35 helicopter (Africa Corps-affiliated) was shot down, killing all crew and the attached fire support team.",
    source: "Wikipedia / Al Jazeera",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: 28, phase: "P3",
    date: "2026-04-25",
    location: "Sévaré", region: "Mopti",
    lat: 14.5333, lng: -4.1,
    targetType: "military_base", group: "JNIM",
    fatalities: 0,
    summary: "JNIM assaulted the Malian Army garrison and air base at Sévaré, near Mopti. JNIM released a propaganda video of the attack on June 6.",
    source: "Africanews / Wikipedia",
    sourceUrl: "https://www.africanews.com/2026/06/06/al-qaeda-linked-armed-group-jnim-releases-propaganda-video-of-mali-attack/"
  },
  {
    id: 29, phase: "P3",
    date: "2026-04-25",
    location: "Mopti", region: "Mopti",
    lat: 14.4843, lng: -4.0185,
    targetType: "city_multiple", group: "JNIM",
    fatalities: 0,
    summary: "JNIM launched coordinated attacks against military installations in Mopti, destabilising government control across central Mali.",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: 30, phase: "P3",
    date: "2026-04-25",
    location: "Senou (Bamako south)", region: "Bamako",
    lat: 12.55, lng: -7.95,
    targetType: "military_base", group: "JNIM",
    fatalities: 0,
    summary: "JNIM attacked the Senou military facility adjacent to the airport as part of an unprecedented coordinated assault on the Bamako perimeter.",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: 31, phase: "P3",
    date: "2026-04-28",
    location: "Bamako (perimeter)", region: "Bamako",
    lat: 12.6392, lng: -8.0029,
    targetType: "blockade", group: "JNIM",
    fatalities: 0,
    summary: "JNIM formally declared a full encirclement blockade of Bamako, progressively cutting all six major arterial roads into the capital.",
    source: "Soufan Center",
    sourceUrl: "https://thesoufancenter.org/intelbrief-2026-may-12/"
  },

  // =================== P4: Encirclement / Northern Collapse Phase (May–Jun 2026) ===================
  {
    id: 32, phase: "P4",
    date: "2026-05-01",
    location: "Tessalit", region: "Kidal",
    lat: 20.1986, lng: 1.0114,
    targetType: "withdrawal", group: "FLA",
    fatalities: 0,
    summary: "Africa Corps withdrew from Tessalit; FLA took control under a safe-passage guarantee brokered by Algeria. This marked the beginning of a domino sequence of northern withdrawals.",
    source: "Hollister Situation Report",
    sourceUrl: "https://www.michael-hollister.com/2026/05/29/update-mali-situation-report-29-may-2026/"
  },
  {
    id: 33, phase: "P4",
    date: "2026-05-03",
    location: "Aguelhok / Agelok", region: "Kidal",
    lat: 19.4406, lng: 0.8458,
    targetType: "withdrawal", group: "FLA",
    fatalities: 0,
    summary: "Withdrawal from both Aguelhok and Agelok bases was completed, effectively eliminating the Africa Corps presence in northern Mali.",
    source: "Hollister Situation Report",
    sourceUrl: "https://www.michael-hollister.com/2026/05/29/update-mali-situation-report-29-may-2026/"
  },
  {
    id: 34, phase: "P4",
    date: "2026-05-06",
    location: "Bamako-Bougouni road", region: "Sikasso",
    lat: 11.4167, lng: -7.4833,
    targetType: "fuel_tanker", group: "JNIM",
    fatalities: 3,
    summary: "JNIM set fire to civilian truck convoys without military escort, targeting fruit shipments destined for Bamako markets. Bread and rice prices in Bamako and Mopti doubled, and transport costs tripled; by May 15, Amnesty International reported that three of the six major roads into the capital were blocked.",
    source: "Soufan Center / Amnesty International",
    sourceUrl: "https://thesoufancenter.org/intelbrief-2026-may-12/"
  },
  {
    id: 35, phase: "P4",
    date: "2026-05-06",
    location: "Kenieroba Prison", region: "Koulikoro",
    lat: 12.0167, lng: -8.5,
    targetType: "prison_break", group: "JNIM",
    fatalities: 0,
    summary: "JNIM attacked the Kenieroba central prison in southern Mali, which holds approximately 2,500 inmates including a significant number of JNIM fighters. The attack is assessed as a prisoner-release operation.",
    source: "Hollister Situation Report",
    sourceUrl: "https://www.michael-hollister.com/2026/05/29/update-mali-situation-report-29-may-2026/"
  },
  {
    id: 36, phase: "P4",
    date: "2026-05-10",
    location: "Mopti region (Bandiagara)", region: "Mopti",
    lat: 14.3503, lng: -3.6103,
    targetType: "militia_conflict", group: "JNIM",
    fatalities: 25,
    summary: "JNIM launched a major offensive against Dozo militias (the Dan Na Ambassagou movement) across the Bandiagara, Bankass, and Djenne circles. The heaviest casualties occurred in Gomossagou, Kori Kori, Dougara, Kourounde, and Bougoulade, and multiple local leaders were assassinated.",
    source: "ACLED Africa Overview June 2026",
    sourceUrl: "https://acleddata.com/update/africa-overview-june-2026"
  },
  {
    id: 37, phase: "P4",
    date: "2026-05-12",
    location: "Bankass (disarmament)", region: "Mopti",
    lat: 14.0833, lng: -3.5167,
    targetType: "civilian", group: "JNIM",
    fatalities: 0,
    summary: "JNIM launched a 'disarmament campaign' in which 12 villages in the Bankass circle handed over their weapons, effectively establishing JNIM governance across the area.",
    source: "ACLED",
    sourceUrl: "https://acleddata.com/update/africa-overview-june-2026"
  },
  {
    id: 38, phase: "P4",
    date: "2026-05-15",
    location: "Intahaka gold mine", region: "Gao",
    lat: 16.45, lng: -0.3,
    targetType: "withdrawal", group: "FLA",
    fatalities: 0,
    summary: "The strategically important Intahaka gold mine was transferred from Malian and Russian forces to FLA as part of the broader withdrawal agreement, representing a significant loss of revenue from the north.",
    source: "Hollister Situation Report",
    sourceUrl: "https://www.michael-hollister.com/2026/05/29/update-mali-situation-report-29-may-2026/"
  },
  {
    id: 39, phase: "P4",
    date: "2026-05-20",
    location: "Gomossagou", region: "Mopti",
    lat: 14.05, lng: -3.45,
    targetType: "militia_conflict", group: "JNIM",
    fatalities: 18,
    summary: "An armed assault on Dozo militias destroyed two settlements. This attack recorded the highest death toll of any single incident in the P4 phase.",
    source: "ACLED",
    sourceUrl: "https://acleddata.com/update/africa-overview-june-2026"
  },
  {
    id: 40, phase: "P4",
    date: "2026-05-25",
    location: "Ségou region", region: "Ségou",
    lat: 13.4317, lng: -6.2157,
    targetType: "militia_conflict", group: "JNIM",
    fatalities: 9,
    summary: "JNIM extended its anti-Dozo militia campaign into Ségou region, with the violence driven by disputes over village checkpoints and freedom of movement.",
    source: "ACLED",
    sourceUrl: "https://acleddata.com/update/africa-overview-june-2026"
  },
  {
    id: 41, phase: "P4",
    date: "2026-06-01",
    location: "Bamako-Kayes road (west of Bamako)", region: "Koulikoro",
    lat: 12.65, lng: -8.55,
    targetType: "civilian", group: "JNIM",
    fatalities: 8,
    summary: "A bus struck a JNIM-planted landmine on the Bamako–Kayes highway, killing 8 people and wounding 42; Africa Corps reported at least 5 dead and more than 10 wounded. The incident marked an escalation in blockade tactics.",
    source: "Reuters / Internazionale",
    sourceUrl: "https://www.internazionale.it/ultime-notizie-reuters/2026/06/02/eight-people-killed-in-mali-after-bus-hits-land-mine-says-union-official"
  },
  {
    id: 42, phase: "P4",
    date: "2026-06-05",
    location: "Bamako (motorcycle ban)", region: "Bamako",
    lat: 12.6392, lng: -8.0029,
    targetType: "blockade", group: "JNIM",
    fatalities: 0,
    summary: "The Malian junta placed a $3.5 million bounty on JNIM leader Iyad Ag Ghaly and added six individuals including FLA figures to a wanted list. On the same day, the junta banned the import and sale of motorcycles for one year to curtail militant mobility.",
    source: "BBC",
    sourceUrl: "https://www.bbc.com/pidgin/articles/c4g8l516n80o"
  }
];

// Reference coordinates for major cities
const majorCities = [
  { name: "Bamako",    lat: 12.6392, lng: -8.0029, role: "Capital" },
  { name: "Kati",     lat: 12.7411, lng: -8.0708, role: "Major military base" },
  { name: "Ségou",    lat: 13.4317, lng: -6.2157, role: "Central major city" },
  { name: "Mopti",    lat: 14.4843, lng: -4.0185, role: "Central trading city" },
  { name: "Timbuktu", lat: 16.7666, lng: -3.0026, role: "Northern historic city" },
  { name: "Gao",      lat: 16.2667, lng: -0.05,   role: "Northeastern major city" },
  { name: "Kidal",    lat: 18.4411, lng:  1.4078, role: "Far-northern regional capital (FLA-controlled)" },
  { name: "Tessalit", lat: 20.1986, lng:  1.0114, role: "Far-northern base (FLA-controlled)" },
  { name: "Kayes",    lat: 14.4469, lng: -11.4456, role: "Western gold-mining region" },
  { name: "Sikasso",  lat: 11.317,  lng: -5.667,  role: "Southern border city" }
];

// Target type definitions
const targetTypes = {
  airport:          { label: "Airport",              color: "#e63946" },
  military_base:    { label: "Military Base",        color: "#d62828" },
  fuel_tanker:      { label: "Fuel Convoy",          color: "#f77f00" },
  kidnapping:       { label: "Kidnapping",           color: "#9d4edd" },
  blockade:         { label: "Blockade",             color: "#6c757d" },
  civilian:         { label: "Civilians",            color: "#fcbf49" },
  city_multiple:    { label: "Multi-Site City Attack", color: "#bc4749" },
  assassination:    { label: "VIP Assassination",   color: "#ff006e" },
  withdrawal:       { label: "Withdrawal / Abandonment", color: "#2a9d8f" },
  militia_conflict: { label: "Militia Clash",        color: "#e85d75" },
  prison_break:     { label: "Prison Attack",        color: "#8338ec" }
};

// Armed groups
const groups = {
  "JNIM":     { label: "JNIM (al-Qaeda-linked)",       color: "#264653" },
  "ISGS":     { label: "ISGS (Islamic State-linked)",  color: "#e76f51" },
  "FLA":      { label: "FLA (Tuareg separatist)",      color: "#2a9d8f" },
  "JNIM+FLA": { label: "JNIM+FLA (joint operation)",   color: "#7209b7" }
};
