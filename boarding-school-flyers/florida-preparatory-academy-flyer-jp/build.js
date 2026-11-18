const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Florida Preparatory Academy",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_9.png",
  logoW: 1.6,
  logoH: 0.58,
  usMap: "images/p1_7.png",
  usMapAspect: 507 / 771,
  introPhoto: "images/p1_8.png",
  introBodyHeight: 1.15,
  facilitiesBodyHeight: 1.15,
  abcLogo: "images/p1_6.png",
  tibsoLogo: "images/p1_4.png",

  location: [
    "フロリダ州メルボルン",
    "人口: 約86,000人",
    "最寄り空港: メルボルン・オーランド国際空港(MLB) — 学校から車で約1時間",
    "オーランドおよび主要テーマパークから車で1時間",
    "安全な郊外のコミュニティで、一年を通じて気候に恵まれている",
  ],
  locationHeight: 1.45,
  eligibility: [
    "受け入れ学年: 7〜12年生",
    "受け入れ試験: TOEFL",
  ],
  facts: [
    "創立年: 1961年",
    "キャンパス面積: 30エーカー",
    "全校生徒数: 179名",
    "留学生比率: 49%",
    "教師対生徒比率: 1:10",
    "教員の60%が大学院(修士・博士)学位を保有",
  ],
  highlights: [
    "Nicheランキング A",
    "ブレバード郡 私立高校ランキング第3位",
    "FAA資格取得に向けたフライト時間を記録できる航空プログラムを提供",
    "ケネディ宇宙センターに近接しているため、ロボティクス・工学・宇宙関連プログラムが充実",
  ],
  highlightsHeight: 1.7,

  introBody:
    "Florida Preparatory Academyは、フロリダ州の「スペースコースト」に位置する私立寄宿制学校で、充実したSTEM教育、航空プログラム、きめ細やかな学習環境で知られています。少人数制クラス、安全な海岸沿いの立地、そしてこの地域ならではの工学・航空宇宙活動に取り組める機会を生徒に提供しています。",
  facilitiesBody:
    "キャンパスには、最新の理科・工学実験室、フライトトレーニング・シミュレーター室、テクノロジーを活用した教室を備えた学習棟があります。屋外施設には競技場、体育館、テニスコート、フィットネスセンターを完備。キャンパスは安全で緑豊か、徒歩で移動しやすい設計となっており、学業への集中と心身の健康の両方を支えています。",

  page2Sections: [
    { heading: "ESL", body: "あり", height: 0.35 },
    {
      heading: "AP科目 (AP Courses)",
      body:
        "English Language, English Literature, Calculus AB, Calculus BC, Statistics, Biology, Chemistry, Psychology, Physics 1, Environmental Science, World History, United States History, Chinese Language & Culture, Computer Science, 2-D Art & Design",
      height: 1.0,
      fontSize: 9.5,
    },
    {
      heading: "オナーコース (Honors Courses)",
      body:
        "Algebra 1, 2, Biology, Chemistry, English 1, 2, 3, Geometry, Mandarin 5, Physics, Psychology, US Government, US History, World Geography, World History",
      height: 0.75,
      fontSize: 9.5,
    },
    {
      heading: "デュアル・エンロールメント (Dual Enrollment)",
      body:
        "Florida Prepに在籍しながら、資格要件を満たした生徒はEastern Florida State Collegeのリベラルアーツ・人文学系科目で大学単位を取得できます。また、Florida Institute of Technologyでは、航空学・航空宇宙工学・エンジニアリング・コンピューティング・高度数学などの分野で単位認定付きの履修も可能です。",
      height: 1.1,
      fontSize: 9.5,
    },
  ],
  page2Photos: ["images/p2_7.png", "images/p2_8.png", "images/p2_9.png"],

  matriculationList: [
    "Princeton University",
    "University of Michigan",
    "University of Florida",
    "Georgia Institute of Technology (Georgia Tech)",
    "University of Illinois Urbana-Champaign",
    "University of Massachusetts Amherst",
    "University of Miami",
    "University of Pittsburgh",
    "Rochester Institute of Technology (RIT)",
    "Rensselaer Polytechnic Institute (RPI)",
    "United States Naval Academy",
    "United States Air Force Academy",
    "Embry-Riddle Aeronautical University",
    "Baylor University",
    "Bentley University",
    "Mercer University",
    "Long Island University",
    "St. John's University",
    "California State University Northridge",
    "Rollins College",
  ],
  matriculationColumns: 2,
  matriculationPanelH: 2.3,

  page3Photos: ["images/p3_7.png", "images/p3_8.png", "images/p3_9.png"],
  page3PhotoAspect: 0.72,

  activitiesSections: [
    {
      heading: "競技スポーツ・課外活動 (Athletics & Intramurals)",
      body: [
        "秋季: 野球、サッカー、ゴルフ、水泳、バレーボール",
        "冬季: バスケットボール、野球、チアリーディング",
        "春季: 野球、テニス、陸上競技",
      ],
      height: 0.6,
      fontSize: 9.5,
    },
    {
      heading: "課外活動 (Extra-Curricular Activities)",
      body:
        "ロボティクス部、レゴ・ロボティクス部、チェス部、航空部、ランニング部、ゲームアート&デザイン部、写真・映像制作部、演劇部、eスポーツ部",
      height: 0.55,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮と学生生活 (Dormitories and Student Life)",
      body:
        "寄宿生は、経験豊富な寮監に見守られながら、快適な寮で生活します。部屋は基本的に2人部屋で、学習スペース、Wi-Fi、共有ラウンジを完備。週末には、ビーチへのお出かけ、オーランド観光、宇宙センター見学、ショッピング、屋外レクリエーションなど、計画された活動が用意されています。",
      height: 1.0,
    },
  ],
};

buildFlyer(data, "Florida_Preparatory_Academy_JP.pptx").then(() => console.log("done"));
