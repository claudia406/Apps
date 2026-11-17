const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Foxcroft Academy",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_7.png",
  logoW: 1.5,
  logoH: 1.1,
  usMap: "images/p1_8.png",
  usMapAspect: 522 / 763,
  introPhoto: "images/p1_9.png",
  introBodyHeight: 1.15,
  abcLogo: "images/p1_4.png",
  tibsoLogo: "images/p1_2.png",

  location: [
    "メイン州ドーバー・フォックスクロフト",
    "ポートランドから車で2時間",
    "最寄り空港: ポートランド国際ジェットポート(PWM) — 学校から2時間",
    "気候: 冬は寒く降雪が多い、夏は穏やか",
  ],
  eligibility: [
    "受け入れ学年: 9〜12年生",
    "受け入れ試験: TOEFL",
  ],
  facts: [
    "創立年: 1823年",
    "キャンパス面積: 125エーカー",
    "全校生徒数: 425名",
    "教師対生徒比率: 1:11",
    "ESLサポート: あり",
  ],
  highlights: [
    "Nicheランキング B+",
    "メイン州 寄宿制高校ランキング第13位",
    "IBプログラムを提供",
    "Apple Distinguished School(Apple優良校認定)",
  ],

  introBody:
    "Foxcroft Academyは1823年創立の名門私立校で、メイン州ドーバー・フォックスクロフトに位置する通学・寄宿制学校です。高い学業水準、多様な課外活動、強いコミュニティ精神で知られ、世界中からの生徒を温かく迎え入れています。",
  facilitiesBody:
    "125エーカーのキャンパスには、現代的な寮、充実した学習施設、広大なスポーツ施設が揃っています。複数の競技場、新しく改修されたテニスコート、優勝記念バナーが飾られたメイン体育館も備えています。",

  page2Sections: [
    { heading: "言語 (Languages)", body: "ドイツ語、スペイン語、ラテン語", height: 0.35 },
    {
      heading: "AP科目 (AP Courses)",
      body:
        "Biology, Calculus AB, Chemistry, English Literature and Composition, Macroeconomics, Microeconomics, Physics B, Statistics, Studio Art: 2D Design, Studio Art: 3D Design, Studio Art: Drawing, US History, World History",
      height: 1.2,
      fontSize: 9.5,
    },
    {
      heading: "芸術 (Arts)",
      body:
        "Art, Advanced Art, Architectural Drawing and Design, Ceramics, Chorus, Contemporary Ensemble, Creative Textiles, Digital Photography, Filmmaking, Introduction to Guitar, Introduction to Piano, Jazz Band, Sculptural Welding, Studio Art, Theater, Video Game Design, Woodworking",
      height: 1.2,
      fontSize: 9.5,
    },
    { heading: "ESL", body: "あり", height: 0.35 },
  ],
  page2Photos: ["images/p2_5.png", "images/p2_6.png", "images/p2_7.png"],

  matriculationList: [
    "Boston College",
    "Carnegie Mellon University",
    "Case Western Reserve University",
    "Colby College",
    "College of the Holy Cross",
    "Georgetown University",
    "Lehigh University",
    "Northwestern University",
    "University of California, Los Angeles (UCLA)",
    "University of California, Berkeley",
    "University of North Carolina at Chapel Hill",
    "University of Virginia",
    "Wake Forest University",
    "Parsons The New School for Design",
    "New York School of Interior Design",
    "San Francisco Art Institute",
    "School of the Visual Arts",
    "Colby College",
    "Georgetown University",
    "Lehigh University",
  ],
  matriculationColumns: 2,
  matriculationPanelH: 2.3,

  page3Photos: ["images/p3_5.png", "images/p3_6.png", "images/p3_7.png", "images/p3_8.png"],
  page3PhotoAspect: 0.72,

  activitiesSections: [
    {
      heading: "スポーツ (Sports)",
      body: [
        "秋季: チアリーディング、クロスカントリー、フィールドホッケー、アメリカンフットボール、ゴルフ、サッカー",
        "冬季: バスケットボール、チアリーディング、屋内陸上競技、スキー、水泳、レスリング",
        "春季: 野球、ソフトボール、屋外陸上競技、テニス",
      ],
      height: 0.6,
      fontSize: 9.5,
    },
    {
      heading: "課外活動 (Activities)",
      body:
        "美術部、アジア文化部、料理部、ダンス部、環境部、ジャズバンド、キー・クラブ、数学部、アウトドア部、フォトジャーナリズム部、学生テクノロジーチーム",
      height: 0.6,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮について (Dormitory)",
      body:
        "Foxcroft Academyには、快適で最新設備の整った寮が2棟あります。各寮には男女別の棟、広々とした共有スペース、完備されたキッチン設備、学習室、Wi-Fiアクセスが備わっています。自然光と景観を重視した設計により、コミュニティでの交流と個々の安らぎの両方を育む居心地の良い環境を実現しています。",
      height: 1.1,
    },
  ],
};

buildFlyer(data, "Foxcroft_Academy_JP.pptx").then(() => console.log("done"));
