const pptxgen = require("pptxgenjs");

const ORANGE = "F5821F";
const DARK = "3A3A3A";
const GRAY_BADGE = "7A7A7A";
const LIGHT_GRAY = "EFEFEF";
const WHITE = "FFFFFF";

const HEAD_FONT = "Meiryo UI";
const BODY_FONT = "Yu Gothic";

const PAGE_W = 8.5;
const PAGE_H = 11;
const MARGIN = 0.45;
const CONTENT_W = PAGE_W - MARGIN * 2;

function newPres() {
  const pres = new pptxgen();
  pres.defineLayout({ name: "LETTER_PORTRAIT", width: PAGE_W, height: PAGE_H });
  pres.layout = "LETTER_PORTRAIT";
  return pres;
}

function addHeader(slide, title) {
  slide.addShape("rect", { x: 0, y: 0, w: PAGE_W, h: 1.35, fill: { color: ORANGE }, line: { type: "none" } });
  slide.addText(title, {
    x: MARGIN, y: 0.25, w: CONTENT_W - 1.0, h: 0.9,
    fontFace: HEAD_FONT, fontSize: 24, bold: true, color: WHITE,
    valign: "middle", isTextBox: true, margin: 0,
  });
  slide.addImage({ path: "images/p1_2_Im2.png", x: PAGE_W - 1.05, y: 0.45, w: 0.6, h: 0.375 });
  slide.addShape("rect", { x: 0, y: 1.35, w: PAGE_W, h: 0.12, fill: { color: LIGHT_GRAY }, line: { type: "none" } });
}

function addFooter(slide) {
  slide.addShape("rect", { x: 0, y: PAGE_H - 0.55, w: PAGE_W, h: 0.55, fill: { color: LIGHT_GRAY }, line: { type: "none" } });
  slide.addImage({ path: "images/p1_0_Im0.png", x: MARGIN, y: PAGE_H - 0.47, w: 1.5, h: 0.39 });
  slide.addText("詳細はこちら: www.abceducationgroup.com", {
    x: PAGE_W - 4.0, y: PAGE_H - 0.5, w: 3.55, h: 0.4,
    fontFace: BODY_FONT, fontSize: 9, bold: true, color: DARK,
    align: "right", valign: "middle", isTextBox: true, margin: 0,
  });
}

function badge(slide, text, x, y, w) {
  slide.addShape("rect", { x, y, w, h: 0.34, fill: { color: GRAY_BADGE }, line: { type: "none" } });
  slide.addText(text, {
    x, y, w, h: 0.34, fontFace: HEAD_FONT, fontSize: 13, bold: true, color: WHITE,
    align: "left", valign: "middle", isTextBox: true, margin: [0, 0, 0, 0.12],
  });
}

function bullets(slide, items, x, y, w, h, opts) {
  const fontSize = (opts && opts.fontSize) || 11;
  const paraSpaceAfter = (opts && opts.paraSpaceAfter != null) ? opts.paraSpaceAfter : 6;
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: i < items.length - 1, paraSpaceAfter } })),
    {
      x, y, w, h, fontFace: BODY_FONT, fontSize, color: DARK,
      valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.05,
    }
  );
}

function sectionTitle(slide, text, x, y, w) {
  slide.addText(text, {
    x, y, w, h: 0.32, fontFace: HEAD_FONT, fontSize: 13, bold: true, color: ORANGE,
    isTextBox: true, margin: 0,
  });
}

function iconChip(slide, label, x, y) {
  const d = 0.62;
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: LIGHT_GRAY }, line: { color: ORANGE, width: 1.5 } });
  slide.addText("✓", { x, y: y - 0.02, w: d, h: d, fontFace: HEAD_FONT, fontSize: 20, bold: true, color: ORANGE, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  slide.addText(label, { x: x - 0.35, y: y + d + 0.02, w: d + 0.7, h: 0.3, fontFace: BODY_FONT, fontSize: 9, bold: true, color: DARK, align: "center", isTextBox: true, margin: 0 });
}

const pres = newPres();

/* ============ Slide 1 ============ */
{
  const s = pres.addSlide();
  addHeader(s, "Bella Vista College\nPreparatory School");

  let y = 1.65;
  // Logo + name
  s.addImage({ path: "images/p1_3_Im3.png", x: MARGIN, y, w: 2.9, h: 0.76 });

  // Private / Co-ed / Boarding chips
  const chipY = y + 0.02;
  iconChip(s, "私立", MARGIN + 3.3, chipY);
  iconChip(s, "男女共学", MARGIN + 4.35, chipY);
  iconChip(s, "全寮制", MARGIN + 5.45, chipY);

  y += 1.15;
  // US map
  s.addImage({ path: "images/p1_1_Im1.png", x: PAGE_W - 3.0, y: y, w: 2.55, h: 1.6 });

  // Location
  badge(s, "所在地", MARGIN, y, 3.0);
  bullets(s, [
    "アリゾナ州スコッツデール",
    "最寄りの主要都市: フェニックス",
    "気候: 夏は非常に暑く乾燥し、冬は涼しい。一年を通じてほぼ晴天",
    "空港コード: PHX",
  ], MARGIN, y + 0.42, 4.6, 1.5, { fontSize: 10.5 });

  y += 2.15;
  // Eligibility / Facts / Highlights - 3 columns
  const colW = (CONTENT_W - 0.3 * 2) / 3;
  const col1x = MARGIN;
  const col2x = MARGIN + colW + 0.3;
  const col3x = MARGIN + (colW + 0.3) * 2;

  badge(s, "出願資格", col1x, y, colW);
  bullets(s, [
    "受け入れ学年: 9〜12年生",
    "数学・作文の入学試験が必須",
  ], col1x, y + 0.42, colW, 1.7, { fontSize: 10 });

  badge(s, "学校概要", col2x, y, colW);
  bullets(s, [
    "学年編成: 6〜12年生",
    "教師対生徒比率: 1:6",
    "ドレスコード: カジュアル(制服あり)",
    "アリゾナ州私立高校ランキング第10位",
  ], col2x, y + 0.42, colW, 1.9, { fontSize: 10 });

  badge(s, "特色", col3x, y, colW);
  bullets(s, [
    "Nicheランキング A+",
    "優れたスポーツプログラム: National Basketball Prep Program(全米バスケットボール強化プログラム)",
    "卒業時平均20単位以上の大学単位を取得(州内外の大学で認定可)",
    "カリフォルニア州に近接(Googleなどテック企業の拠点を含む)",
  ], col3x, y + 0.42, colW, 2.4, { fontSize: 9.5 });

  y += 2.95; // clear of the tallest 3-column bullet box (bottom ~7.77)
  sectionTitle(s, "学校紹介", MARGIN, y, CONTENT_W - 2.8);
  s.addText(
    "Bella Vistaは少人数制クラスと、生徒一人ひとりに合わせたカリキュラムを誇りとしており、問題解決力・批判的思考力・テクノロジーを日々の授業に取り入れています。",
    { x: MARGIN, y: y + 0.32, w: CONTENT_W - 2.8, h: 0.85, fontFace: BODY_FONT, fontSize: 10.5, color: DARK, isTextBox: true, margin: 0, valign: "top" }
  );

  const introY = y;
  y += 1.45;
  sectionTitle(s, "学校施設", MARGIN, y, CONTENT_W - 2.8);
  s.addText(
    "モダンな設備を備えた広々とした教室、最新鋭のテクノロジー・コンピュータラボ、フルサイズの体育館などを完備しています。",
    { x: MARGIN, y: y + 0.32, w: CONTENT_W - 2.8, h: 0.78, fontFace: BODY_FONT, fontSize: 10.5, color: DARK, isTextBox: true, margin: 0, valign: "top" }
  );

  // team photo, right column — vertically centered against the two text blocks, clear of the footer
  s.addImage({ path: "images/p1_4_Im4.png", x: PAGE_W - MARGIN - 2.7, y: introY + 0.2, w: 2.7, h: 1.92 });

  addFooter(s);
}

/* ============ Slide 2 ============ */
{
  const s = pres.addSlide();
  addHeader(s, "Bella Vista College\nPreparatory School");

  let y = 1.65;
  badge(s, "コース", MARGIN, y, CONTENT_W);

  y += 0.5;
  sectionTitle(s, "上級コース (Advanced Courses)", MARGIN, y, CONTENT_W - 2.6);
  const courses = "CST 105 Computer Programming I、CST III Intro to Computer Science & Info、CST III Intro to Computer Science & Info Technology、ENG 105 English Composition I、ENG 106 English Composition II、ENG 130 Intro to Young Adult Literature、FIN 210 Personal Finance、MAT 144 College Mathematics、MAT 154 Applications of College Algebra I、MAT 254 Calculus and Analytic Geometry、MAT 261 Pre-Calculus、MAT 274 Probability and Statistics";
  s.addText(courses, {
    x: MARGIN, y: y + 0.32, w: CONTENT_W - 2.6, h: 1.7,
    fontFace: BODY_FONT, fontSize: 10, color: DARK, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
  });
  s.addText("生徒は平均して卒業時に20単位以上の大学単位(州内外の大学で認定可能)を取得します。", {
    x: MARGIN, y: y + 2.05, w: CONTENT_W - 2.6, h: 0.7,
    fontFace: BODY_FONT, fontSize: 10, color: DARK, isTextBox: true, margin: 0, valign: "top",
  });

  // two photos top-right
  s.addImage({ path: "images/p2_2_Im2.png", x: PAGE_W - MARGIN - 2.3, y: y, w: 2.3, h: 1.49 });
  s.addImage({ path: "images/p2_3_Im3.png", x: PAGE_W - MARGIN - 2.3, y: y + 1.6, w: 2.3, h: 1.49 });

  y += 3.3;
  badge(s, "進学実績 (Matriculation)", MARGIN, y, CONTENT_W);

  y += 0.5;
  sectionTitle(s, "大学合格率 100%", MARGIN, y, CONTENT_W);
  s.addText(
    "Bella Vista College Prepの生徒は、コロンビア大学、カリフォルニア大学サンディエゴ校、サンディエゴ大学、アリゾナ州立大学、カリフォルニア大学ロサンゼルス校、北アリゾナ大学など、トップクラスの大学に合格しています。",
    { x: MARGIN, y: y + 0.32, w: CONTENT_W, h: 1.0, fontFace: BODY_FONT, fontSize: 10.5, color: DARK, isTextBox: true, margin: 0, valign: "top" }
  );

  y += 1.5;
  s.addText(
    "男子アスリートの90%、女子アスリートの100%が、テキサス大学アーリントン校、セントルイス大学、テネシー大学マーティン校などでバスケットボールの大学奨学金を獲得しています。",
    { x: MARGIN, y: y, w: CONTENT_W, h: 1.0, fontFace: BODY_FONT, fontSize: 10.5, color: DARK, isTextBox: true, margin: 0, valign: "top" }
  );

  y += 1.4;
  // bottom 3 photos — sized to stay clear of the footer bar
  const ph = 1.4;
  const pw = ph / (397 / 613);
  const gap = 0.2;
  const rowW = pw * 3 + gap * 2;
  const startX = MARGIN + (CONTENT_W - rowW) / 2;
  s.addImage({ path: "images/p2_4_Im4.png", x: startX, y, w: pw, h: ph });
  s.addImage({ path: "images/p2_5_Im5.png", x: startX + pw + gap, y, w: pw, h: ph });
  s.addImage({ path: "images/p2_6_Im6.png", x: startX + (pw + gap) * 2, y, w: pw, h: ph });

  addFooter(s);
}

/* ============ Slide 3 ============ */
{
  const s = pres.addSlide();
  addHeader(s, "Bella Vista College\nPreparatory School");

  let y = 1.65;
  // top 3 photos
  const pw = (CONTENT_W - 0.2 * 2) / 3;
  s.addImage({ path: "images/p3_2_Im2.png", x: MARGIN, y, w: pw, h: 1.5 });
  s.addImage({ path: "images/p3_3_Im3.png", x: MARGIN + pw + 0.2, y, w: pw, h: 1.5 });
  s.addImage({ path: "images/p3_4_Im4.png", x: MARGIN + (pw + 0.2) * 2, y, w: pw, h: 1.5 });

  y += 1.75;
  badge(s, "課外活動 (Activities)", MARGIN, y, CONTENT_W);

  y += 0.5;
  sectionTitle(s, "競技スポーツ (Athletics)", MARGIN, y, CONTENT_W);
  s.addText("バスケットボール、ゴルフ、サッカー、テニス、陸上競技、バレーボール", {
    x: MARGIN, y: y + 0.32, w: CONTENT_W, h: 0.4, fontFace: BODY_FONT, fontSize: 10.5, color: DARK, isTextBox: true, margin: 0, valign: "top",
  });

  y += 0.85;
  sectionTitle(s, "課外クラブ・団体 (Extra-curricular Activities)", MARGIN, y, CONTENT_W);
  s.addText([
    { text: "クラブ・団体: ", options: { bold: true, breakLine: false } },
    { text: "Community Service Club(コミュニティサービスクラブ)、FIRST Robotics Team(FIRSTロボティクスチーム)、Robotics(ロボティクス部)、Student Council(生徒会)", options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: "芸術・音楽プログラム: ", options: { bold: true, breakLine: false } },
    { text: "Art Club(美術部)", options: { breakLine: false } },
  ], {
    x: MARGIN, y: y + 0.32, w: CONTENT_W, h: 1.1, fontFace: BODY_FONT, fontSize: 10.5, color: DARK, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
  });

  y += 1.65;
  badge(s, "その他の実績 (Other Facts)", MARGIN, y, CONTENT_W);

  y += 0.45;
  sectionTitle(s, "最近の受賞・表彰歴 (Recent Awards and Recognition)", MARGIN, y, CONTENT_W);
  bullets(s, [
    "FIRST Robotics Competition 優勝",
    "Patriots of American Revolution Worldwide Writing Contest(愛国者たちと米国革命 世界作文コンテスト)1位",
    "Daughters of the American Revolution(アメリカ革命の娘たち)地区大会ファイナリスト賞",
    "Stock Market Game 1位・2位・3位受賞",
    "Key Club International(キー・クラブ・インターナショナル)サービス団体会員",
    "National Honors Society(ナショナル・オナー・ソサエティ)会員",
    "男子バスケットボール全米選手権優勝",
    "女子バスケットボール全米選手権優勝",
  ], MARGIN, y + 0.32, CONTENT_W, 3.15, { fontSize: 10, paraSpaceAfter: 4 });

  addFooter(s);
}

pres.writeFile({ fileName: "Bella_Vista_College_Prep_JP.pptx" }).then(() => {
  console.log("done");
});
