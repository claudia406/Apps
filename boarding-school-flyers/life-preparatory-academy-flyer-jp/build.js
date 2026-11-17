const { buildFlyer } = require("../templates/tibso-template");

const data = {
  schoolNameJa: "Life Preparatory Academy",
  tags: ["私立", "男女共学", "全寮制"],
  logo: "images/p1_7.png",
  logoW: 1.3,
  logoH: 1.3,
  usMap: "images/p1_6.png",
  usMapAspect: 393 / 500,
  introPhoto: "images/p1_8.png",
  introBodyHeight: 1.55,
  abcLogo: "images/p1_4.png",
  tibsoLogo: "images/p1_3.png",

  location: [
    "カンザス州ウィチタ",
    "四季がはっきりしており、春は気温が穏やかで雨が多い",
    "博物館・ディナーシアター・アートギャラリーなど見どころが多く、ゴルフの名所としても知られる",
    "空港: ウィチタ空港(ICT)",
  ],
  locationHeight: 1.75,
  eligibility: ["受け入れ試験: TOEFL"],
  eligibilityHeight: 0.4,
  facts: [
    "受け入れ学年: 5〜12年生",
    "ESLサポート: あり",
    "ドレスコード: 制服",
    "1年での卒業: 可能(1年卒業オプションあり)",
    "SAT平均スコア: 1800",
    "全校生徒数: 250名",
  ],
  highlights: [
    "Nicheランキング A-",
    "ウィチタエリア STEM高校ランキング第5位",
  ],

  introBody:
    "Life Prep Academyは、カンザス州ウィチタにある男女共学の通学・寄宿制学校です。生徒一人ひとりが、大学進学準備コースやオンライン講座を含む質の高い教育と、手厚いサポート体制を受けることができます。Life Prepは学年ではなく能力別に生徒を配置し、生徒が本来持つ可能性を最大限に引き出せるよう後押しします。生徒は将来に向けてしっかりと準備ができ、多くを学びながら楽しい学校生活を送っています。",
  facilitiesBody:
    "近代的な施設と教室が整っています。寮は特に充実しており、4つの居住棟とメインハウス1棟で構成されています。寮にはプール、業務用キッチン、卓球台も備わっています。",

  page2Sections: [
    {
      heading: "コース・選択科目 (Courses and Electives)",
      body: [
        "数学: 微積分、物理",
        "社会科: 地理、政治学、応用倫理学",
        "英語: コミュニケーション、スピーチ、クリエイティブ・ライティング",
        "その他: コンピュータラボ、ACT対策、SAT対策、TOEFL対策、心理学、金融リテラシー、男子体育、女子体育、投資学、投資学2",
      ],
      height: 1.5,
      fontSize: 9.5,
    },
    { heading: "AP科目・大学レベル科目", body: "あり", height: 0.35 },
    { heading: "芸術プログラム (Arts Program)", body: "美術、吹奏楽、合唱、ダンス、演劇、ドローイング、音楽、彫刻", height: 0.55 },
    { heading: "言語 (Languages)", body: "スペイン語", height: 0.35 },
  ],
  page2Photos: ["images/p2_1.png", "images/p2_2.png", "images/p2_3.png"],

  matriculationNote: "大学合格率100%",
  matriculationList: [
    "Kansas State University",
    "Missouri State University",
    "Friends University",
    "Tabor College",
    "Wichita State University",
    "LA City College",
    "University of Washington",
    "University of Toronto",
    "Penn State University",
    "Rosan University",
    "Eastern Michigan University",
    "Florida State University",
    "University of Minnesota",
    "Oregon State University",
  ],
  matriculationColumns: 2,
  matriculationPanelH: 2.2,

  page3Photos: ["images/p3_1.png", "images/p3_2.png", "images/p3_3.png"],
  page3PhotoAspect: 0.55,

  activitiesSections: [
    {
      heading: "競技スポーツ (Athletics)",
      body: [
        "男子: 野球、バスケットボール、アメリカンフットボール、サッカー、陸上競技、eスポーツ",
        "女子: バスケットボール、チアリーディング、サッカー、陸上競技、バレーボール、eスポーツ",
      ],
      height: 0.45,
      fontSize: 10,
    },
    {
      heading: "課外活動 (Extra-Curricular Activities)",
      body: "チェス部、合唱団、料理部、投資部、ロボティクス部、Teenview Magazine(ティーン向け雑誌編集部)",
      height: 0.55,
    },
  ],
  additionalInfoSections: [
    {
      heading: "芸術とスポーツ (Arts and Sports)",
      body:
        "Life Prep Academyは、スポーツと芸術の両方を生徒の学校生活に欠かせない要素と位置づけています。この分野において長年にわたる実績を誇り、生徒が目標を達成できるよう、一流の施設と指導を提供しています。優れたアスリートであれ、情熱あふれるアーティストであれ、Life Prepは生徒が力を発揮できる支援環境を整えています。",
      height: 0.9,
    },
    {
      heading: "寮と学生生活 (Dormitories and Student Life)",
      body:
        "Life Prep Academyの寮は、20か国以上から集まった生徒たちが活気あふれる交流を育む場です。ドーム・ディレクター(寮監)が、男子2棟・女子2棟の計4棟と、中央の共有スペースからなる美しくデザインされた住環境を統括しています。メインハウスには、ゲームテーブルや大型テレビ、本格的な業務用キッチンが備わっています。",
      height: 0.9,
    },
  ],
};

buildFlyer(data, "Life_Preparatory_Academy_JP.pptx").then(() => console.log("done"));
