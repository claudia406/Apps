# Foxcroft Academy 日本語版パンフレット

ABC Education Group / TIBSO発行の英語パンフレット「Foxcroft Academy」を、日本語版として作成したPowerPoint資料。

## 概要

メイン州ドーバー・フォックスクロフトにある私立共学寄宿制(ボーディング)の学校、Foxcroft Academyの紹介資料。1823年創立で、IBプログラムとApple Distinguished School(Apple優良校)認定が特色。元の英語版パンフレット(全3ページ)のレイアウト・デザイン・写真を踏襲しつつ、本文を日本語に翻訳した。

## 主な機能

- 元のTIBSOフォーマットの配色・レイアウトを再現
- 元のパンフレットに掲載されている学校ロゴ・米国地図・写真をすべて収録(画質劣化なく再現可能だったため、省略した画像はなし。ページ3の写真は元資料どおり4枚収録)
- AP科目名・大学名・クラブ名など、無理に訳すと不自然になる固有名詞は英語表記のまま残し、必要に応じて日本語の補足を括弧で併記
- PowerPointファイルとして納品のため、Owner側で自由にテキスト編集・レイアウト調整が可能

## 内容構成(全3ページ)

1. ページ1: 所在地・出願資格・学校概要・特色・学校紹介・学校施設
2. ページ2: コース(言語・AP科目・芸術・ESL)・進学実績(合格大学一覧、2列)
3. ページ3: 課外活動(スポーツ・クラブ)・その他の情報(寮について)

## 使用方法

`Foxcroft_Academy_JP.pptx` をPowerPoint(またはPowerPoint互換ソフト)で開いて編集・印刷・共有できる。

## 技術構成

- PowerPoint (.pptx) ファイル、`pptxgenjs` (Node.js) を用いて生成
- レイアウト・デザインの共通ロジックは `boarding-school-flyers/templates/tibso-template.js` に切り出し、このフォルダの `build.js` はデータ定義のみを行う
- 画像は元PDFから抽出(JPEG2000形式のものはPNGに変換して格納)

## フォルダ構成

```
foxcroft-academy-flyer-jp/
├── Foxcroft_Academy_JP.pptx  # 完成版・日本語パンフレット
├── build.js                   # スライド生成スクリプト(データ定義)
├── images/                    # パンフレットで使用する画像(元PDFから抽出)
└── README.md
```

共通テンプレート本体は `../templates/tibso-template.js`、Node依存関係は `boarding-school-flyers/` 直下の `package.json` / `node_modules` を共用している。

## 注意点(ご確認ください)

- 進学実績(Matriculation)の合格大学リストには、**Colby College・Georgetown University・Lehigh Universityが2回ずつ記載**されています。これは元のパンフレットの記載をそのまま再現したものです。元資料側の重複の可能性がありますので、必要であれば整理いたします。

## 今後の改善候補

- 上記の大学名重複の整理
- Word版が必要な場合は別途作成可能
