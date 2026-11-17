const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Washington Preparatory School",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_7.png",
  logoW: 1.3,
  logoH: 1.3,
  usMap: "images/p1_8.png",
  usMapAspect: 560 / 852,
  introPhoto: "images/p1_9.png",
  introBodyHeight: 1.3,
  abcLogo: "images/p1_4.png",
  tibsoLogo: "images/p1_2.png",

  location: [
    "ワシントン州ボセル",
    "人口: 50,213人",
    "気候: 温暖な海洋性気候。冬は温暖で雨が多く、夏は暖かく乾燥",
    "最寄り空港: シアトル・タコマ国際空港(SEA) — 学校から車で約30分",
  ],
  eligibility: [
    "受け入れ学年: 6〜12年生",
    "受け入れ試験: Duolingo、TOEFL、IELTS",
  ],
  facts: [
    "キャンパス面積: 13.8エーカー",
    "全校生徒数: 70名(うち留学生30%)",
    "生徒対教師比率: 5:1",
  ],
  highlights: [
    "Nicheランキング A+",
    "ワシントン州 寄宿制学校ランキング第3位",
    "シアトルエリア 寄宿制学校ランキング第3位",
  ],

  introBody:
    "Washington Preparatory Schoolは、啓発的で倫理的、思いやりのある人材の育成に取り組む、活気ある教育機関です。ワシントン州内でわずか4校しかない国際バカロレア(IB)ワールドスクールの一つとして、創造性・レジリエンス・批判的思考力を生徒に養い、地球市民として意義のある行動を促します。",
  facilitiesBody:
    "キャンパスには、充実した教育体験を支える最新鋭の施設が整っています。教室には高度なテクノロジーが導入され、双方向型の学習を支援するほか、芸術・理科専用のスペースが創造性とイノベーションを後押ししています。",

  page2Sections: [
    { heading: "世界の言語 (World Languages)", body: "スペイン語、中国語(北京語)", height: 0.35 },
    {
      heading: "AP科目 (Advanced Placement Courses)",
      body:
        "AP Biology, AP US History, AP Calculus AB, AP Calculus BC, AP Statistics, AP Physics, AP Physics C: Mechanics, Electricity and Magnetism, AP Computer Science, AP Computer Principles",
      height: 1.1,
      fontSize: 9.5,
    },
    { heading: "IBプログラム (IB Program)", body: "あり", height: 0.35 },
    { heading: "ESL", body: "あり", height: 0.35 },
  ],
  page2Photos: ["images/p2_5.png", "images/p2_6.png", "images/p2_7.png"],

  matriculationBody:
    "米国大学への合格率100%。これまでの卒業生は、マサチューセッツ工科大学、カリフォルニア州立工科大学ポモナ校、コロンビア大学、カリフォルニア州立大学、ニューヨーク大学、ノースウェスタン大学、カリフォルニア大学バークレー校、ミシガン大学アナーバー校、ペンシルベニア大学、ワシントン大学、カリフォルニア大学サンタバーバラ校、カリフォルニア大学サンタクルーズ校、カリフォルニア大学アーバイン校、ウィスコンシン大学マディソン校、南カリフォルニア大学など、トップクラスの大学に進学しています。",
  matriculationPanelH: 2.3,

  page3Photos: ["images/p3_5.png", "images/p3_6.png"],
  page3PhotoAspect: 0.5,

  activitiesSections: [
    {
      heading: "課外活動 (Activities)",
      body: "美術部、フォースクエア部、チェス部、Bobcats Music Club(ボブキャッツ音楽部)、数学部、ロボティクス部、スピーチ&ディベート部、プログラミング部",
      height: 0.85,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮について (Dormitory)",
      body:
        "学校は生徒向けに寮を提供しており、快適でサポートの行き届いた生活環境が整えられています。休暇期間中の寮の閉鎖については、現時点で詳細情報はありません。",
      height: 0.85,
    },
    {
      heading: "IB + AP デュアルトラック教育",
      body:
        "Washington Preparatory Schoolでは、AP(アドバンスト・プレイスメント)とIB(国際バカロレア)の両プログラムをデュアルトラック制で提供しています。生徒は自身の能力や興味に応じて学習パスを選択でき、この二重の準備により、主要な米国大学入試における得点力が高まります。",
      height: 1.1,
    },
  ],
};

buildFlyer(data, "Washington_Preparatory_School_JP.pptx").then(() => console.log("done"));
