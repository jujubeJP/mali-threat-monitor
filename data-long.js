/* ============================================================
   MALI THREAT MONITOR - LONG RANGE DATA (2012-2026, 14 years)
   ------------------------------------------------------------
   出典:
   - ACLED (https://acleddata.com) — マリ・カバレッジ1997-現在
   - ACLED Year in Review 2022 / Conflict Watchlist 2023, 2026
   - ACLED Africa Overview (各月版)
   - OECD: Military coups, jihadism and insecurity in the Central Sahel (2024)
   - UN MINUSMA / Human Rights Watch / ISS Africa
   - The New Humanitarian Mali timeline
   - ICCT, Soufan Center, CSIS, BISI
   
   注: 年次の事件件数・死者数は ACLED 等公表値の整数化推計です。
       ACLED 自身、データは継続的に更新される "living dataset" であり、
       過去年の値も訂正が入る可能性があります。
       本データは「マクロな構造変化を読み取る」用途に最適化。
   ============================================================ */

// ----------------------------------------------------
// 8 フェーズ分類（2012年1月〜現在）
// ----------------------------------------------------
const longPhases = {
  PA: {
    key: "PA",
    label: "PA 蜂起・北部独立宣言",
    range: "2012年1月 – 2012年12月",
    color: "#1d3557",
    summary: "MNLAの蜂起 → 3月クーデター → 4月Azawad独立宣言 → イスラム主義勢力（Ansar Dine, AQIM）が北部を制圧。トゥアレグ分離主義と聖戦主義の合流。"
  },
  PB: {
    key: "PB",
    label: "PB フランス介入・北部奪還",
    range: "2013年1月 – 2014年12月",
    color: "#457b9d",
    summary: "フランスServal作戦が1月開始、3週間でGao・Timbuktu・Kidalを奪還。Serval → Barkhane（2014年8月）に移行。MINUSMA展開。2014年Kidalで反政府勢力が再台頭。"
  },
  PC: {
    key: "PC",
    label: "PC アルジェ和平・低強度継続",
    range: "2015年1月 – 2016年12月",
    color: "#a8dadc",
    summary: "2015年6月アルジェ和平合意。しかし JNIMの前身（Ansar Dine, Katiba Macina等）が中部Mopti地域へ拡散。低強度の継続的襲撃が中部に定着。"
  },
  PD: {
    key: "PD",
    label: "PD JNIM結成・暴力急増",
    range: "2017年1月 – 2019年12月",
    color: "#e9c46a",
    summary: "2017年3月JNIM結成（AQIM・Ansar Dine・Katiba Macina・al-Mourabitoun連合）。中部の民族間暴力が爆発、Dogon-Fulani民兵衝突。2019年Ogossagou虐殺（160人）。年間死者数は2016年比約6倍に。"
  },
  PE: {
    key: "PE",
    label: "PE 二重クーデター・移行政府",
    range: "2020年1月 – 2021年11月",
    color: "#f4a261",
    summary: "2020年8月Goïtaクーデター、2021年5月再クーデター。フランスとの関係悪化、CEDEAOによる制裁。ISGSとJNIMの抗争激化、JNIMが優勢に。"
  },
  PF: {
    key: "PF",
    label: "PF Wagner期・最高水準",
    range: "2021年12月 – 2023年12月",
    color: "#e76f51",
    summary: "2021年12月Wagner Group到着、FAMa+Wagnerによる対民間人作戦が大規模化。2022年Moura虐殺（500人超）。死者数は史上最悪。2023年MINUSMA撤退、Kidal政府側奪還。"
  },
  PG: {
    key: "PG",
    label: "PG 和平崩壊・JNIM拡大",
    range: "2024年1月 – 2025年8月",
    color: "#d62828",
    summary: "2024年1月マリ政府がアルジェ和平を破棄。JNIMが軍駐屯地への正面攻撃を再開（Boulikessi, Tessit）。2025年6月Wagnerが撤退宣言、後継のAfrica Corpsへ。中部攻撃から軍基地攻撃への戦術回帰。"
  },
  PH: {
    key: "PH",
    label: "PH 包囲・首都圧迫",
    range: "2025年9月 – 2026年6月",
    color: "#7209b7",
    summary: "2025年9月JNIMによる燃料封鎖開始（Bamakoへのタンクローリー襲撃）。2026年4月25日JNIM+FLA連携首都攻撃、国防相暗殺、Kidal陥落。5-6月北部撤退、Mopti大攻勢、首都包囲段階へ。"
  }
};

const longPhaseKeys = ["PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH"];

// ----------------------------------------------------
// 年次集計データ（事件数・死者数推計）
// 注: ACLED年次集計（Year in Review, Conflict Index, Watchlist 等の公表値）に基づく整数化推計
// ----------------------------------------------------
const yearlyData = [
  // year, events, fatalities, phase, civilianFatalities, dominantActor, notable
  { year: 2012, events: 410,  fatalities: 920,   phase: "PA", civilianFatalities: 350,  dominantActor: "MNLA/Ansar Dine/AQIM", notable: "MNLA蜂起・北部独立宣言・3月クーデター" },
  { year: 2013, events: 350,  fatalities: 750,   phase: "PB", civilianFatalities: 220,  dominantActor: "Ansar Dine/AQIM",        notable: "フランスServal作戦・北部奪還" },
  { year: 2014, events: 270,  fatalities: 480,   phase: "PB", civilianFatalities: 140,  dominantActor: "MNLA/Ansar Dine",        notable: "Kidalで反政府勢力再台頭・Barkhane移行" },
  { year: 2015, events: 320,  fatalities: 440,   phase: "PC", civilianFatalities: 160,  dominantActor: "Katiba Macina/Ansar Dine", notable: "6月アルジェ和平合意・Mopti拡散開始" },
  { year: 2016, events: 380,  fatalities: 520,   phase: "PC", civilianFatalities: 200,  dominantActor: "Katiba Macina",          notable: "中部での襲撃定着" },
  { year: 2017, events: 540,  fatalities: 950,   phase: "PD", civilianFatalities: 360,  dominantActor: "JNIM",                   notable: "3月JNIM結成・連合形成" },
  { year: 2018, events: 730,  fatalities: 1450,  phase: "PD", civilianFatalities: 540,  dominantActor: "JNIM/ISGS",              notable: "Dogon-Fulani民族間暴力激化" },
  { year: 2019, events: 1050, fatalities: 2350,  phase: "PD", civilianFatalities: 980,  dominantActor: "JNIM/Dogon民兵",          notable: "Ogossagou虐殺（160人）・民兵抗争頂点" },
  { year: 2020, events: 1180, fatalities: 2410,  phase: "PE", civilianFatalities: 870,  dominantActor: "JNIM/ISGS",              notable: "8月Goïtaクーデター" },
  { year: 2021, events: 1320, fatalities: 2580,  phase: "PE", civilianFatalities: 1010, dominantActor: "JNIM/ISGS",              notable: "5月再クーデター・12月Wagner到着" },
  { year: 2022, events: 1740, fatalities: 4910,  phase: "PF", civilianFatalities: 2640, dominantActor: "FAMa+Wagner/JNIM",       notable: "Moura虐殺（500+人）・史上最悪年" },
  { year: 2023, events: 1880, fatalities: 6320,  phase: "PF", civilianFatalities: 2890, dominantActor: "FAMa+Wagner/JNIM",       notable: "MINUSMA撤退・Kidal政府側奪還" },
  { year: 2024, events: 1610, fatalities: 5240,  phase: "PG", civilianFatalities: 2200, dominantActor: "JNIM/FAMa+Wagner",       notable: "1月アルジェ和平破棄・JNIM軍基地攻撃再開" },
  { year: 2025, events: 1520, fatalities: 4180,  phase: "PG", civilianFatalities: 1640, dominantActor: "JNIM/FLA",               notable: "6月Wagner撤退宣言・9月燃料封鎖開始" },
  { year: 2026, events: 680,  fatalities: 2240,  phase: "PH", civilianFatalities: 720,  dominantActor: "JNIM+FLA連携",            notable: "4月連携首都攻撃・5-6月北部喪失（半年分）", partial: true }
];

// ----------------------------------------------------
// 主要マイルストーン年表（戦略転換点）
// ----------------------------------------------------
const milestones = [
  { date: "2012-01", phase: "PA", type: "uprising",   title: "MNLA蜂起", description: "1月17日、トゥアレグ系MNLAがMénakaを攻撃、北部解放戦争開始", source: "https://www.thenewhumanitarian.org/report/95252/mali-timeline-northern-conflict" },
  { date: "2012-03", phase: "PA", type: "coup",       title: "サノゴ大尉クーデター", description: "3月21日、北部対応の失敗を理由にトゥーレ政権転覆", source: "https://en.wikipedia.org/wiki/Mali_War" },
  { date: "2012-04", phase: "PA", type: "milestone",  title: "Azawad独立宣言", description: "4月6日、MNLAが北部Azawad独立を宣言（国際社会未承認）", source: "https://pksoi.armywarcollege.edu/index.php/minusma-timeline-since-2007-conflict-in-mali/" },
  { date: "2012-06", phase: "PA", type: "milestone",  title: "Ansar Dine支配確立", description: "6-7月、Ansar DineとAQIMがMNLAを駆逐、Timbuktu/Gao/Kidal制圧", source: "https://pksoi.armywarcollege.edu/index.php/minusma-timeline-since-2007-conflict-in-mali/" },
  { date: "2013-01", phase: "PB", type: "intervention", title: "Serval作戦開始", description: "1月11日フランスがServal作戦を発動、Gao/Timbuktu/Kidalを3週間で奪還", source: "https://www.csis.org/programs/warfare-irregular-threats-and-terrorism-program/jamaat-nasr-al-islam-wal-muslimin-jnim" },
  { date: "2013-04", phase: "PB", type: "deployment", title: "MINUSMA設立", description: "国連安保理がMINUSMA派遣を決定、7月から本格展開", source: "https://news.un.org/en/story/2023/12/1145207" },
  { date: "2014-08", phase: "PB", type: "milestone",  title: "Barkhane作戦移行", description: "Serval終了・サヘル広域のBarkhane作戦に拡大（5,100人規模）", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2015-06", phase: "PC", type: "peace",      title: "アルジェ和平合意", description: "6月20日、政府・トゥアレグ系CMA・親政府民兵が和平合意に署名", source: "https://en.wikipedia.org/wiki/Algiers_Accords_(2015)" },
  { date: "2017-03", phase: "PD", type: "formation",  title: "JNIM結成", description: "3月、AQIM/Ansar Dine/Katiba Macina/al-Mourabitoun が連合してJNIM形成", source: "https://www.aljazeera.com/news/2025/11/6/is-mali-about-to-fall-to-al-qaeda-affiliate-jnim" },
  { date: "2019-03", phase: "PD", type: "massacre",   title: "Ogossagou虐殺", description: "3月23日、Dogon民兵がFulaniの村Ogossagouを襲撃、約160名死亡", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2020-08", phase: "PE", type: "coup",       title: "Goïtaクーデター", description: "8月18日、Assimi Goïta大佐がKeïta大統領を転覆、CNSP樹立", source: "https://en.wikipedia.org/wiki/2020_Malian_coup_d'%C3%A9tat" },
  { date: "2021-05", phase: "PE", type: "coup",       title: "二度目のクーデター", description: "5月24日、Goïtaが移行政府首脳を排除、自ら大統領就任", source: "https://issafrica.org/iss-today/a-new-coup-derails-malis-transition" },
  { date: "2021-12", phase: "PF", type: "deployment", title: "Wagner Group到着", description: "12月、ロシアWagner Group約1,000名がマリ展開開始", source: "https://www.csis.org/analysis/tracking-arrival-russias-wagner-group-mali" },
  { date: "2022-03", phase: "PF", type: "massacre",   title: "Moura虐殺", description: "3月27-31日、FAMa+Wagner がMoura村で500+名殺害（HRW調査）", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2022-08", phase: "PF", type: "withdrawal", title: "Barkhane撤退完了", description: "8月15日、フランスがマリからの軍撤退を完了", source: "https://acleddata.com/region/conflict-sahel" },
  { date: "2023-08", phase: "PF", type: "milestone",  title: "CMA再武装・北部戦線復活", description: "8月、Ber基地引き継ぎを巡りCSP-PSDとFAMa+Wagnerが衝突", source: "https://en.wikipedia.org/wiki/Algiers_Accords_(2015)" },
  { date: "2023-11", phase: "PF", type: "milestone",  title: "Kidal政府側奪還", description: "11月14日、FAMa+Wagner がドローン攻撃支援でKidal奪還", source: "https://www.hrw.org/news/2024/01/26/malis-peace-deal-ends" },
  { date: "2023-12", phase: "PF", type: "withdrawal", title: "MINUSMA撤退完了", description: "12月31日、10年に及ぶMINUSMA派遣完全終了", source: "https://news.un.org/en/story/2023/12/1145207" },
  { date: "2024-01", phase: "PG", type: "milestone",  title: "アルジェ和平破棄", description: "1月25日、マリ政府がアルジェ和平合意の終了を一方的に発表", source: "https://www.hrw.org/news/2024/01/26/malis-peace-deal-ends" },
  { date: "2025-06", phase: "PG", type: "withdrawal", title: "Wagner撤退宣言", description: "6月6日、Wagnerが「任務完了」と称してマリ撤退、Africa Corpsに引き継ぎ", source: "https://en.wikipedia.org/wiki/Wagner_Group_activities_in_Africa" },
  { date: "2025-09", phase: "PH", type: "tactic",     title: "JNIM燃料封鎖開始", description: "9月、JNIMがBamakoへのタンクローリーを大規模襲撃開始", source: "https://www.aljazeera.com/news/2025/11/6/is-mali-about-to-fall-to-al-qaeda-affiliate-jnim" },
  { date: "2026-04", phase: "PH", type: "attack",     title: "4月25日連携首都攻撃", description: "JNIM+FLA連携、カマラ国防相暗殺、Kidal陥落", source: "https://icct.nl/publication/mali-what-were-reasons-and-consequences-25-april-attacks" },
  { date: "2026-06", phase: "PH", type: "milestone",  title: "Mopti大攻勢・北部喪失", description: "Tessalit/Aguelhok撤退、Mopti大攻勢、首都包囲段階", source: "https://acleddata.com/update/africa-overview-june-2026" }
];

// ----------------------------------------------------
// 主体・俳優の活動年表（誰がいつ主役だったか）
// ----------------------------------------------------
const actors = {
  MNLA:        { label: "MNLA（トゥアレグ分離）",    color: "#06d6a0", active: { start: 2012, end: 2014 }, peak: 2012 },
  AnsarDine:   { label: "Ansar Dine",                color: "#9d4edd", active: { start: 2012, end: 2017 }, peak: 2012 },
  AQIM:        { label: "AQIM（サハラ）",            color: "#118ab2", active: { start: 2012, end: 2017 }, peak: 2013 },
  JNIM:        { label: "JNIM（al-Qaeda系）",        color: "#e63946", active: { start: 2017, end: 2026 }, peak: 2026 },
  ISGS:        { label: "ISGS / IS Sahel",           color: "#ff7700", active: { start: 2015, end: 2026 }, peak: 2022 },
  France:      { label: "フランス軍（Serval/Barkhane）", color: "#264653", active: { start: 2013, end: 2022 }, peak: 2014 },
  MINUSMA:     { label: "MINUSMA",                   color: "#52b788", active: { start: 2013, end: 2023 }, peak: 2017 },
  FAMa:        { label: "FAMa（マリ国軍）",          color: "#fcbf49", active: { start: 2012, end: 2026 }, peak: 2023 },
  Wagner:      { label: "Wagner Group",              color: "#8d99ae", active: { start: 2021.95, end: 2025.5 }, peak: 2023 },
  AfricaCorps: { label: "Africa Corps（後継）",      color: "#6c757d", active: { start: 2025.5, end: 2026 }, peak: 2026 },
  FLA:         { label: "FLA（トゥアレグ分離・新）", color: "#2a9d8f", active: { start: 2024, end: 2026 }, peak: 2026 },
  CMA:         { label: "CMA / CSP-PSD",             color: "#43aa8b", active: { start: 2014, end: 2024 }, peak: 2023 }
};

// ----------------------------------------------------
// 地域 × 年 ヒートマップ用集計（主要9州）
// 各値は推計事件数
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
// 年→フェーズ早見表
// ----------------------------------------------------
function phaseForYear(year) {
  const row = yearlyData.find(d => d.year === year);
  return row ? row.phase : null;
}
