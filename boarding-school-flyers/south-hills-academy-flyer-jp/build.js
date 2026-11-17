const { buildFlyer } = require("../templates/abc-template");

const data = {
  schoolNameJa: "South Hills Academy",
  tags: ["私立", "男女共学", "全寮制"],
  flag: "images/p1_2.png",
  logo: "images/p1_3.png",
  logoW: 0.95,
  logoH: 1.12,
  usMap: "images/p1_1.png",
  usMapAspect: 500 / 800,
  introPhoto: "images/p1_4.png",
  abcLogo: "images/p1_0.png",

  location: [
    "カリフォルニア州ウェストコビナ",
    "ウォルナット市から車で15分",
    "空港: ロサンゼルス国際空港",
  ],
  eligibility: [
    "受け入れ学年: 7〜12年生",
    "短期留学・サマープログラム・正規留学に対応",
    "受け入れ試験: Duolingo English Test、TOEFL、TOEFL Jr.、IELTS",
  ],
  eligibilityHeight: 1.1,
  facts: [
    "学年編成: K-12(幼稚園〜高校)",
    "全校生徒数: 385名",
    "教師対生徒比率: 1:8",
  ],
  highlights: [
    "Nicheランキング Aスクール",
    "AP科目20以上を提供",
    "大学合格率100%",
    "AP Capstone Diploma(APキャップストーン・ディプロマ)",
  ],
  highlightsHeight: 1.1,

  introBody:
    "創立60年以上にわたり、高い学業水準を維持してきました。幼稚園・小学校・中学校・高校の4部門それぞれに特色があり、学業・社会性・人格形成の面で生徒の成長を支えています。",
  introBodyHeight: 0.85,
  facilitiesBody: [
    "・最新テクノロジーを備えた最先端の教室・実験室",
    "・フルサイズの体育館と講堂",
    "・生徒の研究・学習を支える豊富な資料を揃えた図書館・メディアセンター",
    "・栄養バランスの取れた食事・軽食を提供するカフェテリア",
  ],
  facilitiesBodyHeight: 0.85,

  page2Sections: [
    { heading: "AP科目 (AP Courses)", body: "20以上のAP科目を提供", height: 0.35 },
    {
      heading: "AP Capstone Diploma",
      body:
        "このプログラムはAP SeminarとAP Researchの2科目で構成され、生徒に自主的な学びの機会を提供します。教員は、生徒が選んだテーマについて深く掘り下げた研究を行うために必要なスキルを身につけさせます。この2科目に加え、他の4つのAP試験でも優秀な成績を収めた生徒には、名誉あるAP Capstone Diploma(APキャップストーン・ディプロマ)が授与されます。",
      height: 1.2,
      fontSize: 10,
    },
    { heading: "ELL (English Language Learners) コース", body: "あり", height: 0.35 },
  ],
  page2Photos: ["images/p2_2.png", "images/p2_3.png", "images/p2_4.png"],

  matriculationSections: [
    {
      heading: "大学合格率 100%",
      body:
        "合格実績の一部: カリフォルニア大学バークレー校、カリフォルニア大学ロサンゼルス校、カリフォルニア大学サンディエゴ校、南カリフォルニア大学、カリフォルニア大学サンタバーバラ校、ウィスコンシン大学など。",
      height: 1.0,
    },
  ],

  page3Photos: ["images/p3_2.png", "images/p3_3.png", "images/p3_4.png"],
  page3PhotosH: 1.5,

  activitiesSections: [
    {
      heading: "競技スポーツ (Sports)",
      body: "バスケットボール、クロスカントリー、ダンス、ゴルフ、サッカー、水泳、陸上競技、バレーボール",
      height: 0.5,
    },
    {
      heading: "課外活動 (Extra-curricular Activities)",
      body: "芸術・音楽プログラム: Worship Band(ワーシップバンド)。その他: ダンス、チアリーディング、スポーツ、パブリックスピーキング、ディベート、STEAM科目",
      height: 0.6,
    },
  ],
  otherFactsSections: [
    {
      heading: "放課後プログラム (After School Programs)",
      body:
        "生徒は希望する課外の競技プログラムに参加することが義務付けられています。プログラムにはダンス、チア、スポーツ、スピーチ&ディベート、STEAMなどがあります。学内での人間関係を深め、大学進学やその後の人生に向けた準備となるような課外活動を、生徒たちに経験してほしいと考えています。",
      height: 0.75,
    },
    {
      heading: "南カリフォルニアについて (About Southern California)",
      body: "美しいビーチ、雄大な山々、世界的に有名な観光スポット、そして素晴らしい気候に恵まれています。",
      height: 0.5,
    },
  ],
};

buildFlyer(data, "South_Hills_Academy_JP.pptx").then(() => console.log("done"));
