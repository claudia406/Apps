# Life Preparatory Academy 日本語版パンフレット

ABC Education Group / TIBSO発行の英語パンフレット「Life Preparatory Academy」を、日本語版として作成したPowerPoint資料。

## 概要

カンザス州ウィチタにある私立共学寄宿制(ボーディング)の学校、Life Preparatory Academyの紹介資料。学年ではなく能力別のクラス編成と、1年での卒業オプションが特色。元の英語版パンフレット(全3ページ)のレイアウト・デザインを踏襲しつつ、本文を日本語に翻訳した。

## 主な機能

- 元のTIBSOフォーマットの配色・レイアウトを再現
- AP科目名・大学名・クラブ名など、無理に訳すと不自然になる固有名詞は英語表記のまま残し、必要に応じて日本語の補足を括弧で併記
- PowerPointファイルとして納品のため、Owner側で自由にテキスト編集・レイアウト調整が可能

## 内容構成(全3ページ)

1. ページ1: 所在地・出願資格・学校概要・特色・学校紹介・学校施設
2. ページ2: コース・選択科目、AP/大学レベル科目、芸術プログラム、言語・進学実績(合格率100%、大学一覧2列)
3. ページ3: 課外活動(男女別スポーツ・クラブ)・その他の情報(芸術とスポーツ、寮と学生生活)

## 使用方法

`Life_Preparatory_Academy_JP.pptx` をPowerPoint(またはPowerPoint互換ソフト)で開いて編集・印刷・共有できる。

## 技術構成

- PowerPoint (.pptx) ファイル、`pptxgenjs` (Node.js) を用いて生成
- レイアウト・デザインの共通ロジックは `boarding-school-flyers/templates/tibso-template.js` に切り出し、このフォルダの `build.js` はデータ定義のみを行う
- 画像は元PDFから抽出

## フォルダ構成

```
life-preparatory-academy-flyer-jp/
├── Life_Preparatory_Academy_JP.pptx  # 完成版・日本語パンフレット
├── build.js                           # スライド生成スクリプト(データ定義)
├── images/                             # パンフレットで使用する画像(元PDFから抽出)
└── README.md
```

共通テンプレート本体は `../templates/tibso-template.js`、Node依存関係は `boarding-school-flyers/` 直下の `package.json` / `node_modules` を共用している。

## 重要な注意点(ご確認ください)

- 元のPDF1ページ目には、Life Preparatory Academyとは**無関係な別の学校「Hyde School」のロゴと、山岳地帯にある別のキャンパス写真**が2点(Introduction/Facilities欄の写真と思われる箇所)に混入していました。これはLife Preparatory Academy(カンザス州ウィチタ、平坦な地形)の写真としては明らかに不自然(写真の地形が山岳地帯でカンザスと合わない、ロゴも別の学校のもの)なため、誤って混入した資料と判断し、**今回のスライドには使用していません**。
- 代わりに、学校紹介(Introduction)の横の写真には、同じPDF内にあったLife Preparatory Academy自身の校舎外観写真を使用しています。
- 元のPDFファイル自体に、別の学校の画像が混在している可能性がありますので、資料の出所をご確認いただくことをおすすめします。

## 今後の改善候補

- 上記の写真混入について、正しいLife Preparatory Academyの別写真があれば差し替え可能
- Word版が必要な場合は別途作成可能
