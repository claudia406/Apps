const { buildFlyer } = require("../templates/abc-template");

const data = {
  schoolNameJa: "Washington Academy",
  tags: ["私立", "男女共学", "全寮制"],
  flag: "images/p1_2.png",
  logo: "images/p1_3.png",
  logoW: 2.6,
  logoH: 0.546,
  chipOffsets: [3.5, 4.55, 5.65],
  usMap: "images/p1_1.png",
  usMapAspect: 500 / 800,
  introPhoto: "images/p1_4.png",
  abcLogo: "images/p1_0.png",

  location: [
    "メイン州イースト・マシアス",
    "最寄りの主要都市: ポートランドから北東へ約3時間30分",
    "気候: 夏・秋は温暖、冬・春は寒く湿度が高い",
    "空港コード: BGR",
  ],
  eligibility: [
    "受け入れ学年: 9〜12年生",
    "受け入れ試験: IELTS、IBT(TOEFL)、SLATE-PLUS(ITEP)、Jr. TOEFL、ELTiS、Duolingo(学年により異なる)",
  ],
  eligibilityHeight: 1.1,
  facts: [
    "学年編成: 9〜12年生、PG(ポストグラジュエート)",
    "全校生徒数: 430名",
    "教師対生徒比率: 1:13",
    "制服: なし",
  ],
  highlights: [
    "海洋生態学・海洋生物学プログラム",
    "ボート建造・健康科学プログラム",
    "AP科目・大学単位認定コースを提供",
  ],

  introBody:
    "メイン州北東部の海岸沿いに位置するWashington Academyでは、高度な海洋生態学・海洋生物学コースや、AP・名誉(オナー)・大学単位認定コースなど、独自のプログラムを提供しています。",
  introBodyHeight: 0.95,
  facilitiesBody:
    "施設には、工業アート棟、体育館、複数の競技場・コート、美術棟、大規模な音楽ホールがあります。1823年に建てられた最初の校舎には、教室と保健センターが入っています。",
  facilitiesBodyHeight: 0.85,

  page2Sections: [
    { heading: "言語 (Languages)", body: "中国語、スペイン語", height: 0.35 },
    {
      heading: "AP科目 (AP Courses)",
      body:
        "Biology, Calculus AB, Calculus BC, Chemistry, English Language and Composition, English Literature and Composition, European History, Latin, Music Theory, Physics 1, Spanish Language and Culture, Statistics, US History",
      height: 1.1,
      fontSize: 9.5,
    },
    {
      heading: "芸術 (Arts)",
      body: "Applied Media, Band, Chorus, Cultural Dance, Digital Animation, Guitar, Music Theory, Studio Art, Theater, Visual",
      height: 0.6,
      fontSize: 9.5,
    },
    { heading: "ESL", body: "あり(初級から上級まで対応)", height: 0.35 },
  ],
  page2Photos: ["images/p2_2.png", "images/p2_3.png", "images/p2_4.png"],

  matriculationSections: [
    {
      heading: "大学合格実績 (University Acceptances Include)",
      body:
        "大学合格率100%。合格実績の一部: ボストンカレッジ、ダートマス大学、ドレクセル大学、フランクリン・ピアース大学、ハソン大学、国際デザイン・テクノロジーアカデミー、ミドルベリー大学、ニューヨーク大学、ペンシルベニア州立大学、パデュー大学、ラトガース大学、シラキュース大学、サウスカロライナ大学、シモンズ大学、テキサス大学オースティン校、バンダービルト大学、ウィートンカレッジ、ウェストミンスターカレッジ、ウースター工科大学",
      height: 1.5,
      fontSize: 10,
    },
  ],

  page3Photos: ["images/p3_2.png", "images/p3_3.png", "images/p3_4.png"],
  page3PhotosH: 1.5,

  activitiesSections: [
    {
      heading: "競技スポーツ・男子 (Athletics - Boys)",
      body: [
        "秋季: クロスカントリー、アメリカンフットボール、ゴルフ、サッカー",
        "冬季: バスケットボール、ボウリング",
        "春季: 野球、テニス、陸上競技",
      ],
      height: 0.55,
      fontSize: 10,
    },
    {
      heading: "競技スポーツ・女子 (Athletics - Girls)",
      body: [
        "秋季: チアリーディング、クロスカントリー、ゴルフ、サッカー、バレーボール",
        "冬季: バスケットボール、チアリーディング",
        "春季: ソフトボール、テニス、陸上競技",
      ],
      height: 0.55,
      fontSize: 10,
    },
    {
      heading: "課外活動 (Extra-curricular Activities)",
      body:
        "アカペラ部、チェス部、Envirothon(環境科学コンテスト部)、演劇部、ジャズバンド、ジュニアプロム委員会、文芸誌編集部、数学部、ナショナル・オナー・ソサエティ、ニューメディア部、ペップバンド、学校新聞部、サイエンス部、スキー部、生徒会、サステナビリティ部",
      height: 0.55,
    },
  ],
  otherFactsSections: [
    {
      heading: "スポーツと芸術 (Sports and Arts)",
      body:
        "サッカー、チアリーディング、バスケットボールをはじめとする多くの強豪競技チームが州選手権で優勝しています。テニス部は生徒に特に人気があります。芸術学科では毎年演劇作品と春の発表会(Spring Show)を制作しており、生徒はギター演奏や伝統舞踊(カルチュラル・ダンス)を学ぶ機会もあります。",
      height: 0.75,
    },
    {
      heading: "寮と学生生活 (Dormitories and Student Life)",
      body:
        "Washington Academyの3つの寮には、電話回線、無線インターネット、テレビ、大型キッチンが備わっています。寮生は週末の小旅行やイベント、ファミリースタイルの夕食、日々の課外活動を含むレジデンシャル・ライフ・プログラムに参加します。",
      height: 0.6,
    },
  ],
};

buildFlyer(data, "Washington_Academy_JP.pptx").then(() => console.log("done"));
