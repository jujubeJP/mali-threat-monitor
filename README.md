# Mali Threat Monitor 2025–2026

マリ共和国における直近12ヶ月（2025年5月〜2026年4月）のテロ・誘拐・襲撃事案を地図とチャートで可視化するインタラクティブ・ダッシュボード。

## 公開URL

- メインダッシュボード（12ヶ月分析）: <https://jujubejp.github.io/mali-threat-monitor/>
- バマコ治安リアルタイム地図（2026/04/27〜）: <https://jujubejp.github.io/mali-threat-monitor/bamako-dashboard/>

## 概要

- 30件の主要インシデント（バマコ・カティ・モプティ・トンブクトゥ・ガオ・キダル・セグー・カイ・シカソ等）を収録
- 標的タイプ7分類（空港・軍施設・燃料輸送トラック・誘拐・封鎖・民間人・都市複合）
- 武装グループ4分類（JNIM／ISGS／FLA／JNIM+FLA連携）
- ダーク基調のCARTO地図（Leaflet）に死者数比例マーカー表示
- 月別積み上げ棒グラフ／標的構成ドーナツ／グループ活動量／州別集計の4チャート連動
- フィルターチップで地図とすべてのチャートを同時に絞り込み

## 主要な分析パターン

1. **燃料輸送車への体系的攻撃** — JNIMが2025年9月以降、セネガル・コートジボワール・ギニアからの陸送タンクローリー300台以上を破壊し、内陸国マリの供給路を遮断
2. **外国人を狙った身代金誘拐** — 2025年5–10月に22–26名の外国人が拉致（過去最多）。インド・中国・UAE国籍者が標的
3. **軍基地への大規模強襲の常態化** — Dioura（41名）・Boulikessi（100名）・Timbuktu（60名超）・Tessit（90名）と連続発生
4. **JNIM-FLA連携と首都への前例なき攻撃** — 2026年4月25日、両組織が初の協調攻撃。FLAがキダル制圧、ロシア・アフリカ軍団が撤退

## データソース

公開ソース（OSINT）に基づく。各インシデントには出典リンクを付与。

- [ACLED](https://acleddata.com/) — Armed Conflict Location & Event Data Project
- [Bellingcat](https://www.bellingcat.com/news/2025/12/03/mali-under-siege-tracking-the-fuel-blockade-crippling-bamako/) — 衛星画像分析
- [Al Jazeera](https://www.aljazeera.com/news/2026/4/25/mali-army-says-armed-groups-launch-nationwide-attacks-gunfire-near-airport)
- [Wikipedia: Mali fuel blockade](https://en.wikipedia.org/wiki/Mali_fuel_blockade)
- [Critical Threats Project](https://www.criticalthreats.org/analysis/salafi-jihadi-areas-of-operation-in-west-africa-interactive-map-and-campaign-analysis)
- [Soufan Center](https://thesoufancenter.org/intelbrief-2025-june-5/)
- [Global Centre for R2P](https://www.globalr2p.org/countries/mali/)
- [African Security Analysis](https://www.africansecurityanalysis.org/)

## 技術スタック

- 静的HTML/CSS/JS（フレームワーク非使用）
- [Leaflet 1.9.4](https://leafletjs.com/) + CARTO Dark タイル
- [Chart.js 4.4.1](https://www.chartjs.org/)
- フォント: Inter / Noto Sans JP / JetBrains Mono

## ローカル起動

```bash
git clone https://github.com/jujubeJP/mali-threat-monitor.git
cd mali-threat-monitor
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## ファイル構成

```
mali-threat-monitor/
├── index.html              # メインダッシュボードのレイアウト
├── style.css               # ダーク基調のスタイル定義
├── app.js                  # 地図・チャート・テーブル・フィルター連動ロジック
├── data.js                 # インシデントデータ・都市座標・分類定義
├── bamako-dashboard/       # バマコ局所版（時間軸スライダー付き）
│   ├── index.html          # 攻撃・デモ・外出禁止令・封鎖を時系列表示
│   ├── app.js              # Leafletマーカー・タイムライン制御
│   └── data.js             # 主要拠点6件＋イベント12件
└── README.md
```

## バマコ局所ダッシュボードについて

2026年4月25日のJNIM＋FLA連合による協調攻撃以降のバマコ周辺事象を時系列で可視化。空港・カティ軍事基地・フランス文化センター・大統領府などの拠点を地図上にマークし、攻撃／デモ／外出禁止令／封鎖の各イベントを脈動マーカーで重ね、下部のスライダーで4/27〜4/30の進行を再生できます。

## 注意事項

本ダッシュボードは公開ソースに基づくレビュー目的の分析であり、座標・死傷者数は報道時点の推定値を含みます。学術・研究用途を想定しており、政策判断や実務的な治安アセスメントに用いる際は一次資料および専門機関の最新評価を必ず併せて参照してください。

## ライセンス

MIT License — データの引用元の権利は各原典に帰属します。
