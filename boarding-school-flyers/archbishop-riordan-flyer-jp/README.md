# Archbishop Riordan High School 日本語版パンフレット

ABC Education Group / TIBSO発行の英語パンフレット「Archbishop Riordan High School」を、日本語版として作成したPowerPoint資料。

## 概要

カリフォルニア州サンフランシスコにある私立共学寄宿制(ボーディング)のカトリック系大学進学準備校、Archbishop Riordan High Schoolの紹介資料。1906年創立で、工学・生物医科学の専門プログラムやAP・オナーコース30以上が特色。元の英語版パンフレット(全3ページ)のレイアウト・デザインを踏襲しつつ、本文を日本語に翻訳した。

## 主な機能

- 元のTIBSOフォーマットの配色・レイアウトを再現
- 元のパンフレットに掲載されている学校ロゴ・米国地図・写真をすべて収録(画質劣化なく再現可能だったため、省略した画像はなし。ページ3の写真は元資料どおり4枚収録)
- AP科目名・大学名・クラブ名など、無理に訳すと不自然になる固有名詞は英語表記のまま残し、必要に応じて日本語の補足を括弧で併記
- PowerPointファイルとして納品のため、Owner側で自由にテキスト編集・レイアウト調整が可能

## 内容構成(全3ページ)

1. ページ1: 所在地・出願資格・学校概要・特色・学校紹介・学校施設
2. ページ2: コース(言語・AP科目・芸術プログラム・ESL)・進学実績(合格大学一覧、2列)
3. ページ3: 課外活動(スポーツ・クラブ)・その他の情報(寮について、その他の情報)

## 使用方法

`Archbishop_Riordan_High_School_JP.pptx` をPowerPoint(またはPowerPoint互換ソフト)で開いて編集・印刷・共有できる。

## 技術構成

- PowerPoint (.pptx) ファイル、`pptxgenjs` (Node.js) を用いて生成
- レイアウト・デザインの共通ロジックは `boarding-school-flyers/templates/tibso-template.js` に切り出し、このフォルダの `build.js` はデータ定義のみを行う
- 画像は元PDFから抽出(JPEG2000形式のものはPNGに変換して格納)

## フォルダ構成

```
archbishop-riordan-flyer-jp/
├── Archbishop_Riordan_High_School_JP.pptx  # 完成版・日本語パンフレット
├── build.js                                  # スライド生成スクリプト(データ定義)
├── images/                                    # パンフレットで使用する画像(元PDFから抽出)
└── README.md
```

共通テンプレート本体は `../templates/tibso-template.js`、Node依存関係は `boarding-school-flyers/` 直下の `package.json` / `node_modules` を共用している。

## 重要な注意点(ご確認ください)

- 元のPDF1ページ目には、Archbishop Riordan High Schoolとは**無関係な別の学校の校舎写真**(レンガ造りの寮が並ぶ、海沿いの広大な緑地キャンパス)が1点混入していました。Archbishop Riordanはサンフランシスコ市街地にある学校で、この写真の景観(海沿いの広大な芝生、レンガ造りの古い寮群)とは明らかに一致しないため、誤って混入した資料と判断し、**今回のスライドには使用していません**。
- 代わりに、学校紹介(Introduction)の横の写真には、同じPDF内にあったArchbishop Riordan自身の校舎外観写真(校名の看板が写っているもの)を使用しています。

## 今後の改善候補

- 上記の写真混入について、正しいArchbishop Riordanの別写真があれば差し替え可能
- Word版が必要な場合は別途作成可能
