const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Kokomo High School",
  tags: ["公立", "男女共学", "全寮制"],
  logo: "images/p1_5.png",
  logoW: 1.2,
  logoH: 1.0,
  usMap: "images/p1_9.png",
  usMapAspect: 478 / 727,
  introPhoto: "images/p1_8.png",
  introBodyHeight: 0.6,
  facilitiesBodyHeight: 1.1,
  abcLogo: "images/p1_4.png",
  tibsoLogo: "images/p1_2.png",

  location: [
    "インディアナ州ココモ",
    "人口: 59,671人",
    "最寄り空港: インディアナポリス国際空港(IND) — 学校から車で1時間15分",
  ],
  locationHeight: 1.0,
  eligibility: [
    "受け入れ学年: 8〜12年生",
    "IELTS最低スコア: 4.5",
    "ELTiS最低スコア: 218",
    "SLEP最低スコア: 48",
    "TOEFL最低スコア: 50",
  ],
  facts: [
    "創立年: 1872年",
    "キャンパス面積: 8エーカー",
    "全校生徒数: 1,519名",
    "生徒対教師比率: 15:1",
  ],
  highlights: [
    "AP・IBプログラムを提供",
    "ESL: あり",
    "Project Lead the Way(パデュー大学提携の理数系教育プログラム)",
  ],

  introBody:
    "インディアナ州ココモに位置するKokomo High Schoolは、充実した教育プログラムと活発な課外活動で知られる有名な公立寄宿制学校です。",
  facilitiesBody:
    "教室に加え、屋内体育館、プール、サッカー場、テニスコート、野球場など、スポーツ施設にも力を入れています。これらの施設により、生徒は放課後も含めてスポーツや芸術活動に取り組む十分な機会を得られます。",

  page2Sections: [
    { heading: "言語 (Languages)", body: "フランス語、ドイツ語、スペイン語", height: 0.35 },
    {
      heading: "AP科目 (AP Courses)",
      body:
        "Biology, Calculus AB, Calculus BC, Chemistry, Computer Science A, English Language and Composition, English Literature and Composition, Environmental Science, European History, Macroeconomics, Microeconomics, Physics, Spanish Language and Culture, Statistics, US Government and Politics, US History",
      height: 1.3,
      fontSize: 9.5,
    },
    {
      heading: "芸術 (Arts)",
      body: "音楽理論、スタジオアート、ダンス(IBプログラムの芸術科目の一部)",
      height: 0.35,
    },
  ],
  page2Photos: ["images/p2_5.png", "images/p2_6.png", "images/p2_7.png", "images/p2_8.png"],

  matriculationList: [
    "Harvard University",
    "Stanford University",
    "Cornell University",
    "Duke University",
    "Johns Hopkins University",
    "Purdue University",
    "Indiana University",
    "Notre Dame University",
    "Rose-Hulman Institute of Technology",
    "Butler University",
  ],
  matriculationColumns: 1,
  matriculationPanelH: 2.3,

  page3Photos: ["images/p3_5.png", "images/p3_6.png", "images/p3_7.png"],
  page3PhotoAspect: 0.65,

  activitiesSections: [
    {
      heading: "競技スポーツ (Athletics)",
      body: "バレーボール、バスケットボール、ソフトボール、アメリカンフットボール、サッカー、野球、クロスカントリー、水泳、テニス、レスリング、陸上競技",
      height: 0.55,
    },
    {
      heading: "課外活動 (Activities)",
      body: "ディベート部、ロボティクス部、美術部、アカデミックチーム、演劇部、チアリーディング、青年グループ、学校新聞部",
      height: 0.55,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮について (Dormitories)",
      body:
        "Kokomo High Schoolの寮はココモ市内の中心部に位置し、男女別の2棟の建物で構成されています。各部屋にはベッド、学習机、ワードローブ、専用バスルームが完備されています。生徒は共有の洗濯スペースとキッチンを利用します。",
      height: 0.9,
    },
  ],
};

buildFlyer(data, "Kokomo_High_School_JP.pptx").then(() => console.log("done"));
