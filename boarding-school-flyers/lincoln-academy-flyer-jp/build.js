const { buildFlyer } = require("../templates/abc-template");

const data = {
  schoolNameJa: "Lincoln Academy",
  tags: ["私立", "男女共学", "全寮制"],
  flag: "images/p1_2.png",
  logo: "images/p1_4.png",
  logoW: 2.4,
  logoH: 0.25,
  usMap: "images/p1_1.png",
  usMapAspect: 500 / 800,
  introPhoto: "images/p1_3.png",
  abcLogo: "images/p1_0.png",

  location: [
    "メイン州ニューキャッスル",
    "最寄り都市: ポートランド",
    "気候: 夏は涼しく、冬は寒く雪が多い",
    "空港コード: PWM",
  ],
  eligibility: ["受け入れ学年: 9〜12年生"],
  eligibilityHeight: 0.4,
  facts: [
    "学年編成: 9〜12年生",
    "全校生徒数: 590名",
    "教師対生徒比率: 1:12",
  ],
  highlights: [
    "メイン州は治安の良さで知られ、政治家の保養地としても有名",
    "徒歩10分圏内に観光の町ダマリスコッタがある",
    "40ヘクタールのキャンパスに7kmの森林トレイルコースを完備",
  ],
  highlightsHeight: 1.9,

  introBody:
    "Lincoln Academyは200年以上にわたり地域社会に貢献してきた歴史ある学校で、多様な背景を持つ生徒たちに幅広い教育を提供しています。",
  introBodyHeight: 0.85,
  facilitiesBody: "40ヘクタールのキャンパスには、寄宿施設、競技場(スタジアム)などが備わっています。",
  facilitiesBodyHeight: 0.6,

  page2Sections: [
    {
      heading: "言語 (Languages)",
      body: "フランス語、スペイン語",
      height: 0.35,
    },
    {
      heading: "AP科目 (AP Courses)",
      body:
        "Biology, Calculus AB & BC, Chemistry, Computer Science, English Language & Composition, English Literature & Composition, French V, French Language & Culture, Environmental Science, European History, Macroeconomics, Music Theory, Physics, Spanish Language & Culture, Spanish V, Statistics, Studio Art/Drawing, U.S. History",
      height: 1.5,
      fontSize: 9.5,
    },
    { heading: "ESL", body: "あり", height: 0.35 },
  ],
  page2Photos: ["images/p2_2.png", "images/p2_3.png", "images/p2_4.png"],

  matriculationSections: [
    {
      heading: "合格大学 (University Acceptances Include)",
      body:
        "Brown University, Cornell University, New York University, Purdue University, University of Pennsylvania, Yale University in Singapore, Georgia Institute of Technology, University of California, University of Hong Kong, Bates College, Dartmouth College, Reed College, Boston Conservatory, Oberlin College Conservatory",
      height: 1.3,
      fontSize: 10,
    },
  ],

  page3Photos: ["images/p3_2.png", "images/p3_3.png", "images/p3_4.png"],
  page3PhotosH: 1.5,

  activitiesSections: [
    {
      heading: "競技スポーツ (Athletics)",
      body:
        "バスケットボール、野球、チアリーディング、クロスカントリー、フィールドホッケー、ゴルフ、屋内陸上競技、ラクロス、サッカー、ソフトボール、水泳、テニス、陸上競技、レスリング",
      height: 0.55,
    },
    {
      heading: "課外活動 (Extra-curricular Activities)",
      body:
        "ロブスターベイク(伝統の収穫祭)、Glidden Point Oyster Farm(牡蠣養殖場見学)、ホームカミング、パンプキンフェスト、キャンプファイヤー、リンゴ狩り、紅葉狩り、Insider Maine(メイン州探訪プログラム)、感謝祭、Gardens Aglow(庭園イルミネーション)、コンサート、クリスマス、学生DJダンスパーティー、アイススケート、犬ぞり体験、スキー、そり滑り",
      height: 0.9,
    },
  ],
  otherFactsSections: [
    {
      heading: "クラブ活動 (Clubs)",
      body:
        "チェス部、合唱団、Civil Rights Team(公民権運動研究チーム)、気候アクション部、コミュニティサービス部、吹奏楽団、ディベート部、国際部、ジャズバンド、数学部、模擬国連、ナショナル・アート・オナー・ソサエティ、ナショナル・オナー・ソサエティ、アウティング部(野外活動)、ピアチューター、哲学部、写真部、サイエンス・オリンピック、生徒会、演劇部、アルティメット・フリスビー部、VEXロボティクス部、ウィンドアンサンブル、イヤーブック委員会",
      height: 1.1,
    },
    {
      heading: "ダマリスコッタの街 (Damariscotta)",
      body:
        "学校から徒歩15分の距離にあり、コーヒー、アイスクリーム、タイ料理、シーフード、3軒のグルメレストランなどが楽しめます。地元のアメリカ人高校生がアルバイトするお店で交流することもできます。",
      height: 0.5,
    },
  ],
};

buildFlyer(data, "Lincoln_Academy_JP.pptx").then(() => console.log("done"));
