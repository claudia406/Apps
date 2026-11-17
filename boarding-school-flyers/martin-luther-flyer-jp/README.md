# Martin Luther High School 日本語版パンフレット

ABC Education Group / TIBSO発行の英語パンフレット「Martin Luther High School」を、日本語版として作成したPowerPoint資料。

## 概要

ウィスコンシン州グリーンデールにある私立共学寄宿制(ボーディング)のキリスト教系高校、Martin Luther High Schoolの紹介資料。元の英語版パンフレット(全3ページ)のレイアウト・デザイン・写真を踏襲しつつ、本文を日本語に翻訳した。

## 主な機能

- 元のTIBSO(The International Boarding School Organization)フォーマットの配色・レイアウトを再現
- 元のパンフレットに掲載されている学校ロゴ・米国地図・写真をすべて収録(画質劣化なく再現可能だったため、省略した画像はなし)
- AP科目名、クラブ名、大学名など、無理に訳すと不自然になる固有名詞は英語表記のまま残し、必要に応じて日本語の補足を括弧で併記
- PowerPointファイルとして納品のため、Owner側で自由にテキスト編集・レイアウト調整が可能

## 内容構成(全3ページ)

1. ページ1: 所在地・出願資格・学校概要・特色・学校紹介・学校施設
2. ページ2: コース(言語・AP科目・芸術)・進学実績
3. ページ3: 課外活動(スポーツ・クラブ)・その他の情報(寮について)

## 使用方法

`Martin_Luther_High_School_JP.pptx` をPowerPoint(またはPowerPoint互換ソフト)で開いて編集・印刷・共有できる。

## 技術構成

- PowerPoint (.pptx) ファイル、`pptxgenjs` (Node.js) を用いて生成
- レイアウト・デザインの共通ロジックは `boarding-school-flyers/templates/tibso-template.js` に切り出し、このフォルダの `build.js` はデータ定義のみを行う
- 画像は元PDFから抽出(JPEG2000形式のものはPNGに変換して格納)

## フォルダ構成

```
martin-luther-flyer-jp/
├── Martin_Luther_High_School_JP.pptx  # 完成版・日本語パンフレット
├── build.js                           # スライド生成スクリプト(データ定義)
├── images/                            # パンフレットで使用する画像(元PDFから抽出)
└── README.md
```

共通テンプレート本体は `../templates/tibso-template.js`、Node依存関係は `boarding-school-flyers/` 直下の `package.json` / `node_modules` を共用している。

## 今後の改善候補

- Word版が必要な場合は別途作成可能
