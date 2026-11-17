const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Martin Luther High School",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_7.png",
  logoW: 1.3,
  logoH: 1.3,
  usMap: "images/p1_8.png",
  usMapAspect: 522 / 763,
  introPhoto: "images/p1_9.png",
  introPhotoAspect: 631 / 598,
  introBodyHeight: 1.3,
  abcLogo: "images/p1_4.png",
  tibsoLogo: "images/p1_2.png",

  location: [
    "ウィスコンシン州グリーンデール",
    "人口: 14,472人",
    "最寄り空港: ミルウォーキー・ミッチェル国際空港(MKE) — 学校から車で15分",
    "気候: 夏は涼しく、冬は寒く降雪が多い",
  ],
  eligibility: [
    "受け入れ学年: 9〜12年生",
    "受け入れ試験: TOEFL、Duolingo",
  ],
  facts: [
    "創立年: 1968年",
    "キャンパス面積: 26エーカー",
    "全校生徒数: 653名(うち留学生6%)",
    "教師対生徒比率: 1:14",
    "ESLサポート: あり",
  ],
  highlights: [
    "Nicheランキング A",
    "ウィスコンシン州 キリスト教系高校ランキング第5位",
    "ウィスコンシン州 寄宿制高校ランキング第7位",
  ],

  introBody:
    "Martin Luther High Schoolは、ウィスコンシン州グリーンデールに位置する私立キリスト教系高校で、バランスの取れた教育の提供に力を入れています。1968年に創立され、学業の卓越性、精神的な成長、人格形成を重視し、大学進学後も活躍できる生徒の育成を目指しています。",
  facilitiesBody:
    "広々とした教室、最新の理科・コンピュータラボ、設備の整ったパフォーミングアーツセンターなど、現代的で充実した施設を誇ります。屋外競技場や体育館を備え、近隣のレクリエーション施設も利用できるため、スポーツ・フィットネスプログラムを支えています。",

  page2Sections: [
    { heading: "言語 (Languages)", body: "スペイン語、中国語(北京語)、フランス語", height: 0.35 },
    {
      heading: "AP科目 (Advanced Placement Courses)",
      body:
        "AP Studio Art, AP Biology, AP Computer Science Principles, AP Chemistry, AP Computer Science A, AP Environmental Science, AP Music Theory, AP Physics, AP English Literature, AP Human Geography, AP English Language, AP Psychology, AP Research, AP US History, AP Seminar, AP World History, AP Calculus AB; BC",
      height: 1.35,
      fontSize: 9.5,
    },
    {
      heading: "芸術 (Arts)",
      body:
        "Art Foundations, Drawing & Painting 1, 2, Advanced Drawing, Advanced Painting, Ceramics 1, 2, Sculpture, Digital Photography 1, 2, Video Production, Filmmaking, Yearbook, Graphic Design 1, 2, ML Graphics, AP Studio Art",
      height: 1.1,
      fontSize: 9.5,
    },
  ],
  page2Photos: ["images/p2_5.png", "images/p2_6.png", "images/p2_7.png"],

  matriculationList: [
    "Princeton University",
    "Stanford University",
    "University of Wisconsin-Madison",
    "Marquette University",
    "University of Wisconsin-Milwaukee",
  ],
  matriculationColumns: 1,
  matriculationPanelH: 1.9,

  page3Photos: ["images/p3_5.png", "images/p3_6.png", "images/p3_7.png"],
  page3PhotoAspect: 0.72,

  activitiesSections: [
    {
      heading: "スポーツ (Sports)",
      body: [
        "秋季: クロスカントリー(男女)、アメリカンフットボール、バレーボール(男女)、サッカー(男子)、チア、水泳(女子)、ダンス(女子)、テニス(女子)",
        "冬季: バスケットボール(男女)、水泳/飛び込み(男子)、レスリング(男女)、チア",
        "春季: 野球、ゴルフ(男子)、サッカー(女子)、ソフトボール、テニス(男子)、陸上競技(男女)",
      ],
      height: 1.75,
      fontSize: 9.5,
    },
    {
      heading: "課外活動 (Activities)",
      body: "ロボティクス部、ナショナル・オナー・ソサエティ(NHS)、演劇部、美術部、合唱・吹奏楽アンサンブル、写真部、生徒会、チェス部、ディベート部、環境部",
      height: 0.6,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮について (Dormitory)",
      body:
        "2020年に新築された学生寮は清潔で設備が整っており、男女で異なるフロアに滞在します。各フロアには24時間体制で生徒をサポートする寮監(ドームペアレント)が常駐しています。",
      height: 1.0,
    },
  ],
};

buildFlyer(data, "Martin_Luther_High_School_JP.pptx").then(() => console.log("done"));
