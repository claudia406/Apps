# Bella Vista College Preparatory School 日本語版パンフレット

ABC Education Group発行の英語パンフレット「Bella Vista College Preparatory School」を、日本語版として作成したPowerPoint資料。

## 概要

アリゾナ州スコッツデールにある私立共学寄宮制(ボーディング)の大学進学準備校、Bella Vista College Preparatory Schoolの紹介資料。元の英語版パンフレット(全3ページ)のレイアウト・デザイン・写真を踏襲しつつ、本文を日本語に翻訳した。

## 主な機能

- 元のオレンジ×グレーを基調としたデザインを再現
- 元のパンフレットに掲載されている写真・ロゴ・米国地図はすべてそのまま収録(画質劣化なく再現可能だったため、省略した画像はなし)
- 学校名、コース名(例: MAT 254 Calculus and Analytic Geometry)、団体名(例: National Honors Society)など、無理に訳すと不自然になる固有名詞は英語表記のまま残し、必要に応じて日本語の補足を括弧で併記
- PowerPointファイルとして納品のため、Owner側で自由にテキスト編集・レイアウト調整が可能

## 内容構成(全3ページ)

1. ページ1: 学校名・所在地・出願資格・学校概要・特色・学校紹介・学校施設
2. ページ2: 上級コース一覧・進学実績(大学合格率100%、スポーツ奨学金実績)
3. ページ3: 課外活動(競技スポーツ・クラブ活動)・最近の受賞歴

## 使用方法

`Bella_Vista_College_Prep_JP.pptx` をPowerPoint(またはPowerPoint互換ソフト)で開いて編集・印刷・共有できる。

## 技術構成

- PowerPoint (.pptx) ファイル、`pptxgenjs` (Node.js) を用いて生成
- 画像は元PDFから抽出(一部JPEG2000形式だったためPNGに変換して格納)
- 生成スクリプト: `build.js`(再生成・再調整が必要な場合に利用)

## フォルダ構成

```
bella-vista-flyer-jp/
├── Bella_Vista_College_Prep_JP.pptx  # 完成版・日本語パンフレット
├── build.js                          # スライド生成スクリプト(pptxgenjs)
├── package.json / package-lock.json  # Node.js依存関係
├── images/                           # パンフレットで使用する画像(元PDFから抽出)
└── README.md
```

## 今後の改善候補

- 学校側の了承が得られれば、写真のうち顔が判別しやすいものにモザイク等の配慮を検討
- Word版が必要な場合は別途作成可能
