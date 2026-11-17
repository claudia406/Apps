const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Archbishop Riordan High School",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_9.png",
  logoW: 1.3,
  logoH: 1.2,
  usMap: "images/p1_2.png",
  usMapAspect: 483 / 765,
  introPhoto: "images/p1_10.png",
  introBodyHeight: 0.85,
  facilitiesBodyHeight: 1.1,
  abcLogo: "images/p1_5.png",
  tibsoLogo: "images/p1_3.png",

  location: [
    "カリフォルニア州サンフランシスコ",
    "最寄り空港: サンフランシスコ国際空港(SFO) — 学校から15分",
    "人口: 808,437人",
    "気候: 夏は長く過ごしやすい、冬は短く寒さと曇りがち",
    "18歳未満は公共交通機関が無料。路面電車・バス停は学校から徒歩5分",
  ],
  locationHeight: 1.45,
  eligibility: [
    "受け入れ学年: 9〜12年生",
    "受け入れ試験: Duolingo、IELTS、TOEFL",
  ],
  facts: [
    "創立年: 1906年",
    "全校生徒数: 1,200名(うち留学生86名、18か国出身)",
    "教師対生徒比率: 1:10",
    "宗派: カトリック",
  ],
  highlights: [
    "Nicheランキング A+",
    "サンフランシスコ・ベイエリア 寄宿制高校ランキング第4位",
    "特色ある専門プログラム: 工学、生物医科学",
    "AP・オナーコース30以上",
  ],
  highlightsHeight: 1.7,

  introBody:
    "Archbishop Riordan High Schoolは、私立のカトリック系大学進学準備校です。高い学業水準、充実したスポーツプログラム、活発な芸術コミュニティで知られ、人格形成とリーダーシップの育成につながるバランスの取れた教育を提供しています。",
  facilitiesBody:
    "充実したキャンパス内スポーツ施設を誇っています。水泳プールとテニスコートは通りを挟んだ向かい側にありますが、体育館・競技場・コートなどその他のスポーツ施設はすべてキャンパス内にあります。Appleコンピュータを備えた最新のマルチメディアセンターも併設しています。",

  page2Sections: [
    { heading: "言語 (Languages)", body: "手話、中国語、スペイン語", height: 0.35 },
    {
      heading: "AP科目 (Advanced Placement Courses)",
      body:
        "Biology, Calculus AB, Calculus BC, Chemistry, Chinese, Computer Science, Economics, English Language, English Literature and Composition, Environmental Science, Human Geography, Physics C, Spanish Language, Statistics, U.S. Government & Politics, U.S. History, World History(生徒が履修できるAP科目は最大4科目まで)",
      height: 1.3,
      fontSize: 9.5,
    },
    {
      heading: "芸術プログラム (Arts Program)",
      body:
        "デジタルアート、ビジュアルアーツ(絵画・彫刻)、ダンス(モダン・ヒップホップ・クラシック・バレエ、ヒップホップは通年開講で参加者35名、要オーディション)、音楽(ジャズバンド・マーチングバンド)",
      height: 0.75,
      fontSize: 9.5,
    },
    { heading: "ESL", body: "あり", height: 0.35 },
  ],
  page2Photos: ["images/p2_5.png", "images/p2_6.png", "images/p2_7.png"],

  matriculationList: [
    "Allegheny College",
    "Arizona State University",
    "California Maritime Academy",
    "California State University",
    "DePaul University",
    "Los Angeles City College",
    "Ohio Wesleyan University",
    "Oregon State University",
    "Pennsylvania State University",
    "Southern Oregon University",
    "University of Arizona",
    "University of California",
    "University of Mississippi",
    "University of New Mexico",
    "University of Portland",
    "University of San Francisco",
    "Wesleyan University",
  ],
  matriculationColumns: 2,
  matriculationPanelH: 2.3,

  page3Photos: ["images/p3_5.png", "images/p3_6.png", "images/p3_7.png", "images/p3_8.png"],
  page3PhotoAspect: 0.72,

  activitiesSections: [
    {
      heading: "スポーツ (Sports)",
      body: [
        "秋季: アメリカンフットボール、クロスカントリー、バレーボール、ゴルフ、テニス、フラッグフットボール、セーリング",
        "冬季: バスケットボール、サッカー、レスリング",
        "春季: 野球、ゴルフ、テニス、ラクロス、陸上競技、バレーボール、水泳・飛び込み",
      ],
      height: 0.65,
      fontSize: 9.5,
    },
    {
      heading: "クラブ活動 (Clubs and Activities)",
      body:
        "Knights of Riordan(ナイツ・オブ・リオーダン)、アニメ部、美術部、チェス部、コミック部、クルセイダー合唱団、サイクリング部、ダンス部、DJ部、演劇部、環境部、フィッシング部、グラフィックデザイン部、歴史/クイズボウル部、ユダヤ文化部、Lancers(ランサーズ)、Latinos Unidos(ラティーノ連合)、地中海文化部、模擬国連、映画鑑賞部、新聞部、イヤーブック委員会",
      height: 0.85,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮について (Dormitories)",
      body:
        "寄宿プログラムには、21か国から集まった90名の生徒が在籍しており、多様で国際色豊かな環境が育まれています。生徒は2人部屋に滞在し、共有キッチンや、テレビゲーム・テレビ・卓球台を備えた広いレクリエーションルームを利用できます。各フロアには5つのシャワーを備えたバスルームが3か所あり、5名の常勤レジデンシャル・ペアレント(寮監)が生徒とともに生活し、家庭的で温かいサポート体制を整えています。",
      height: 1.1,
    },
    {
      heading: "その他の情報 (Other Facts)",
      body:
        "学期単位で在籍する生徒(セメスター留学生)は宗教科目の履修が免除されます。学習支援プログラム(RSP)は、追加のサポートが必要な生徒向けに3段階の支援体制を提供しており、追加費用5,000米ドルで利用できます。",
      height: 0.65,
    },
  ],
};

buildFlyer(data, "Archbishop_Riordan_High_School_JP.pptx").then(() => console.log("done"));
