// バマコ治安データ（2026年4月25日 - 4月30日）
// 出典: Wikipedia, Al Jazeera, BBC, Le Monde, Africanews, US Embassy Bamako, GoC Travel等

const POIS = [
  {
    id: "poi-airport",
    name: "モディボ・ケイタ国際空港 (BKO)",
    nameEn: "Modibo Keita International Airport",
    type: "poi",
    subtype: "airport",
    lat: 12.5378,
    lng: -7.9432,
    desc: "バマコの中心部から南へ約15km。隣接する第101空軍基地はロシア「アフリカ軍団」の拠点でもあり、4月25日の攻撃の主要標的となった。",
    source: "https://en.wikipedia.org/wiki/Modibo_Keita_International_Airport"
  },
  {
    id: "poi-kati",
    name: "カティ軍事基地",
    nameEn: "Kati Military Base",
    type: "poi",
    subtype: "military",
    lat: 12.7441,
    lng: -8.0726,
    desc: "バマコ北西郊外に位置するマリ軍最大の基地。アシミ・ゴイタ大統領の官邸も置かれる。4月25日にカマラ国防相が車両爆弾攻撃で殺害された地点。",
    source: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: "poi-ifm",
    name: "マリ・フランス文化センター (IFM)",
    nameEn: "Institut français du Mali",
    type: "poi",
    subtype: "culture",
    lat: 12.6488,
    lng: -7.9875,
    desc: "バマコ中心部、独立大通り (Boulevard de l'Indépendance) に所在。マリの主要文化拠点であり、フランス・マリ関係悪化を受け2022年に一時閉鎖された経緯がある。",
    source: "https://fr.wikipedia.org/wiki/Institut_fran%C3%A7ais_du_Mali"
  },
  {
    id: "poi-center",
    name: "バマコ市中心部",
    nameEn: "Bamako City Center",
    type: "poi",
    subtype: "city",
    lat: 12.6392,
    lng: -8.0029,
    desc: "首都バマコの中心市街地。大統領府、各省庁、主要市場が集中する。",
    source: "https://en.wikipedia.org/wiki/Bamako"
  },
  {
    id: "poi-presidence",
    name: "大統領府 (Koulouba)",
    nameEn: "Presidential Palace - Koulouba",
    type: "poi",
    subtype: "government",
    lat: 12.6519,
    lng: -8.0289,
    desc: "クルーバの丘に立つマリ大統領官邸。ロシア国防省は4月25日の攻撃時、この施設が反乱軍に占拠されるのを防いだと主張。",
    source: "https://www.aljazeera.com/news/2026/4/28/malis-military-leader-goita-emerges-as-russia-declares-it-halted-coup"
  },
  {
    id: "poi-senou",
    name: "セヌー (Base 101)",
    nameEn: "Senou Air Base 101",
    type: "poi",
    subtype: "military",
    lat: 12.5350,
    lng: -7.9500,
    desc: "空港隣接のマリ空軍基地。4月25日にJNIM部隊との交戦が発生。",
    source: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  }
];

const EVENTS = [
  {
    id: "ev-curfew-initial",
    type: "curfew",
    title: "バマコ全域で外出禁止令発令",
    datetime: "2026-04-25T21:00:00",
    endtime: "2026-04-28T06:00:00",
    lat: 12.6392,
    lng: -8.0029,
    location: "バマコ全6コミューン",
    desc: "4月25日の協調攻撃を受け、バマコ知事アブドゥライ・クリバリが21:00〜06:00の外出禁止令を発令。当初72時間の措置として4月28日朝までと設定。",
    source: "West African Voice Network",
    sourceUrl: "https://www.wavn.org/mali-imposes-curfew-in-bamako-after-coordinated-attacks/"
  },
  {
    id: "ev-attack-airport-27",
    type: "attack",
    title: "空港付近で爆発音 - 軍車列接近時",
    datetime: "2026-04-27T20:30:00",
    lat: 12.5378,
    lng: -7.9432,
    location: "モディボ・ケイタ国際空港",
    desc: "夕刻、軍の車列が空港に接近した際に2回の爆発音が確認された。月曜深夜まで散発的な爆発が続く。",
    source: "Al Jazeera",
    sourceUrl: "https://www.aljazeera.com/news/2026/4/28/what-is-the-azawad-liberation-front-part-of-the-mali-attacks"
  },
  {
    id: "ev-attack-kati-27",
    type: "attack",
    title: "カティ駐屯地で散発的な戦闘継続",
    datetime: "2026-04-27T08:00:00",
    lat: 12.7441,
    lng: -8.0726,
    location: "カティ軍事基地",
    desc: "JNIM戦闘員が建設中の建物や周辺の丘陵地に潜伏し、マリ軍との交戦を継続。マリ軍は「完全な制圧」を主張するも実態は不透明。",
    source: "Le Monde",
    sourceUrl: "https://www.lemonde.fr/en/le-monde-africa/article/2026/04/27/mali-s-junta-more-vulnerable-than-ever-after-weekend-attacks_6752867_124.html"
  },
  {
    id: "ev-blockade-jnim",
    type: "blockade",
    title: "JNIMがバマコ「完全包囲」を宣言",
    datetime: "2026-04-28T12:00:00",
    lat: 12.6392,
    lng: -8.0029,
    location: "バマコ周辺幹線道路",
    desc: "JNIM報道官ビナ・ディアラがバンバラ語ビデオ声明で、バマコへ通じる全道路の封鎖を宣言。市内からの退出は許容するが、進入を試みる者は標的になると警告。隣接するカティにも同様の措置。",
    source: "Africanews",
    sourceUrl: "https://www.africanews.com/2026/04/29/blockade-threat-on-bamako-amid-juntas-assurance-of-control/"
  },
  {
    id: "ev-us-alert-28",
    type: "attack",
    title: "米大使館がテロ移動の可能性で警報",
    datetime: "2026-04-28T15:00:00",
    lat: 12.6392,
    lng: -8.0029,
    location: "バマコ全域",
    desc: "在マリ米国大使館が「バマコ市内におけるテロリストの移動の可能性」について警告を発出し、米国民に屋内退避を要請。",
    source: "US Embassy Mali",
    sourceUrl: "https://www.facebook.com/USEmbassyMali/posts/security-alert-bamako-mali-april-28-2026-possible-terrorist-movements-within-bam/1499266931544591/"
  },
  {
    id: "ev-demo-paris-29",
    type: "demo",
    title: "在パリ・マリ人ディアスポラが軍事政権支持の集会",
    datetime: "2026-04-29T14:00:00",
    lat: 12.6488,
    lng: -7.9875,
    location: "バマコ市内同調行動",
    desc: "パリでマリ人ディアスポラが軍事政権支持の集会を開催。バマコ市内でも同調する小規模な動きが報告された。",
    source: "Africanews",
    sourceUrl: "https://www.africanews.com/2026/04/29/blockade-threat-on-bamako-amid-juntas-assurance-of-control/"
  },
  {
    id: "ev-curfew-extension-29",
    type: "curfew",
    title: "外出禁止令を5月1日まで72時間延長",
    datetime: "2026-04-29T18:00:00",
    endtime: "2026-05-01T06:00:00",
    lat: 12.6392,
    lng: -8.0029,
    location: "バマコ全6コミューン",
    desc: "バマコ地区が21:00〜06:00の外出禁止令を5月1日まで72時間延長。マリ軍と国家警備隊による合同パトロールが、特にカティとモディボ・ケイタ国際空港周辺で強化された。",
    source: "US Embassy Bamako",
    sourceUrl: "https://ml.usembassy.gov/security-alert-extension-of-bamako-citywide-curfew-u-s-embassy-bamako-mali-april-29-2026/"
  },
  {
    id: "ev-attack-house-search",
    type: "attack",
    title: "戸別捜索作戦を全コミューンで展開",
    datetime: "2026-04-29T08:00:00",
    lat: 12.6519,
    lng: -8.0289,
    location: "バマコ全コミューン",
    desc: "潜伏細胞 (sleeper cells) のあぶり出しを目的とした戸別捜索を実施。市民の不安が高まる。",
    source: "African Perceptions",
    sourceUrl: "https://africanperceptions.org/en/2026/04/mali-tightens-security-measures-as-curfew-extended-and-northern-front-shifts/"
  },
  {
    id: "ev-lynching",
    type: "demo",
    title: "市民によるトゥアレグ系疑い者へのリンチ事案",
    datetime: "2026-04-28T10:00:00",
    lat: 12.6392,
    lng: -8.0029,
    location: "バマコ市内およびカティ",
    desc: "4月25日の攻撃後、JNIM戦闘員と疑われたトゥアレグ系市民への市民によるリンチ事案が複数報告される。これに対しJNIMは28日、報復として「全面包囲」を宣言。",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Mali_attacks"
  },
  {
    id: "ev-attack-airport-resume",
    type: "attack",
    title: "空港運用再開、便の遅延・欠航相次ぐ",
    datetime: "2026-04-27T06:00:00",
    lat: 12.5378,
    lng: -7.9432,
    location: "モディボ・ケイタ国際空港",
    desc: "4月26日に閉鎖されていた空港の運用が部分的に再開されるも、便の遅延・欠航が相次ぐ。一部航空会社はマリ便の運休を継続。",
    source: "NHE Travel",
    sourceUrl: "https://www.nhetravel.com/2026/04/27/mali-terrorism-level-4-terrorist-attacks-in-parts-of-the-country-curfew-implemented-mali-update-7/"
  },
  {
    id: "ev-goita-speech",
    type: "demo",
    title: "ゴイタ大統領、初の公開声明 - 「事態は制御下」",
    datetime: "2026-04-28T20:00:00",
    lat: 12.6519,
    lng: -8.0289,
    location: "大統領府 (Koulouba)",
    desc: "攻撃以降姿を見せていなかったアシミ・ゴイタ大統領がテレビ演説。「敵の計画は阻止された」「事態は制御下にある」と述べつつ「極めて深刻な瞬間」とも認める。国民に団結を呼びかけた。",
    source: "Africanews",
    sourceUrl: "https://www.africanews.com/2026/04/29/blockade-threat-on-bamako-amid-juntas-assurance-of-control/"
  },
  {
    id: "ev-checkpoints-airport-road",
    type: "blockade",
    title: "空港アクセス道路の検問所増設",
    datetime: "2026-04-27T10:00:00",
    lat: 12.5800,
    lng: -7.9700,
    location: "空港アクセス道路",
    desc: "マリ当局は空港へ通じる道路に複数の検問所を設置し、車両検査を強化。市民の通勤・物流に支障。",
    source: "BBC",
    sourceUrl: "https://www.bbc.com/news/articles/clyx7nnrkqdo"
  }
];
