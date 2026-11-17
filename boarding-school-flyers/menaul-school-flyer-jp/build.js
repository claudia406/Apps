const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Menaul School",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_7.png",
  logoW: 1.3,
  logoH: 1.3,
  usMap: "images/p1_5.png",
  usMapAspect: 500 / 800,
  introPhoto: "images/p1_6.png",
  introBodyHeight: 1.0,
  abcLogo: "images/p1_4.png",
  tibsoLogo: "images/p1_3.png",

  location: [
    "ニューメキシコ州アルバカーキ",
    "サンタフェに最も近く、アルバカーキから北へ約60マイル",
    "晴天率の高い都市で、年間300日以上快晴",
    "最寄り空港: アルバカーキ国際サンポート空港(ABQ)",
  ],
  eligibility: [
    "受け入れ試験: TOEFL Jr.、TOEFL iBT、IELTS、Duolingo",
  ],
  facts: [
    "受け入れ学年: 8〜12年生",
    "全校生徒数: 200名",
    "ESL: ELL(英語学習者向けプログラム)を提供",
  ],
  highlights: [
    "Nicheランキング A+",
    "ニューメキシコ州 キリスト教系高校ランキング第1位",
    "AP科目を含む多様なカリキュラム",
  ],

  introBody:
    "Menaul Schoolは19世紀後半にまで遡る長い歴史を持つ学校です。設立当初はスペイン語を話す男子生徒のための寄宿学校でしたが、その後、世界各地から生徒を受け入れる男女共学の寄宿・通学制学校へと発展しました。",
  facilitiesBody:
    "緑豊かな木々に囲まれた32エーカーの敷地は、学生に静かで大学のようなキャンパス環境を提供しています。Menaul Schoolのキャンパス内には12棟の建物があり、2つの体育館とサッカー場を備えています。",

  page2Sections: [
    {
      heading: "AP科目 (AP Courses)",
      body: "AP English Literature & Composition, AP Calculus, AP Psychology, AP US Government & Politics, AP Human Geography",
      height: 0.65,
      fontSize: 9.5,
    },
    {
      heading: "優等生制度 (Honor Roll)",
      body: [
        "各学期末に決定されます。GPA 3.25〜3.74の生徒は優等生名簿(Honor Roll)に、GPA 3.75以上の生徒は優等生リーダー(Honor Roll Leaders)に掲載されます。",
        "学校はニューメキシコ大学と連携しており、生徒は選抜制の大学講座を履修する機会があります。",
      ],
      height: 1.7,
    },
  ],
  page2Photos: ["images/p2_5.png", "images/p2_6.png", "images/p2_7.png"],

  matriculationBody:
    "人気の大学合格実績: 本校は4年制大学への合格率100%を誇り、ボストン大学、ブラウン大学、ニューヨーク大学、ノースウェスタン大学、カリフォルニア大学アーバイン校、ワシントン大学、パデュー大学など、多くの大学に合格者を輩出しています。",
  matriculationPanelH: 1.6,

  page3Photos: ["images/p3_5.png"],
  page3PhotoAspect: 0.22,

  activitiesSections: [
    {
      heading: "スポーツ (Sports)",
      body: [
        "秋季: アメリカンフットボール、バレーボール、サッカー、クロスカントリー",
        "冬季: バスケットボール",
        "春季: 陸上競技、野球",
      ],
      height: 0.6,
      fontSize: 9.5,
    },
    {
      heading: "クラブ活動 (Clubs)",
      body: "生徒会、ナショナル・オナー・ソサエティ、ACT/SAT対策、チェス部、環境部、数学部、模擬国連、Open Circle(オープンサークル)、国際ユースイニシアチブ、ランニング部、射撃部、サッカー部、スピーチ&ディベート部",
      height: 0.6,
    },
  ],
  additionalInfoSections: [
    {
      heading: "寮について (Dormitories)",
      body:
        "各寮には、経験豊富な常勤レジデンシャル・アドバイザーが個室を持って常駐しています。レジデンシャル・アドバイザーおよびレジデンシャル・ライフ・コーディネーターをはじめとするレジデンシャル・ライフ・スタッフは、生徒がいつでも気軽に相談できる体制を整えています。",
      height: 0.55,
    },
    {
      heading: "週末・休暇中の活動 (Weekend Activities)",
      body:
        "秋休みや感謝祭休暇などの主要な長期休暇中には、学校が企画するグランドキャニオンやコロラド州への旅行、ニューメキシコ州内の周辺地域を探訪する機会があります。クリスマス休暇と春休みの期間は学校・寮ともに閉鎖となり、ほとんどの生徒は帰省するか旅行に出かけます。",
      height: 0.7,
    },
  ],
};

buildFlyer(data, "Menaul_School_JP.pptx").then(() => console.log("done"));
