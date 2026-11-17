const pptxgen = require("pptxgenjs");

const HEADER_BG = "7D8CA3";
const DARK = "2C3E60";
const TEXT = "333333";
const GRAY_PANEL = "F0F1F3";
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

function addHeader(slide, schoolNameJa) {
  slide.addShape("rect", { x: 0, y: 0, w: PAGE_W, h: 1.25, fill: { color: HEADER_BG }, line: { type: "none" } });
  slide.addText("TIBSO", {
    x: MARGIN, y: 0.18, w: 3.0, h: 0.3,
    fontFace: HEAD_FONT, fontSize: 15, bold: true, color: WHITE, isTextBox: true, margin: 0,
  });
  slide.addText("THE INTERNATIONAL BOARDING SCHOOL ORGANIZATION", {
    x: MARGIN, y: 0.46, w: 4.0, h: 0.2,
    fontFace: BODY_FONT, fontSize: 6, color: WHITE, isTextBox: true, margin: 0,
  });
  slide.addText(schoolNameJa, {
    x: MARGIN, y: 0.62, w: CONTENT_W, h: 0.55,
    fontFace: HEAD_FONT, fontSize: 22, bold: true, color: WHITE, valign: "top", isTextBox: true, margin: 0,
  });
}

function addFooter(slide, abcLogoPath, tibsoLogoPath) {
  slide.addShape("rect", { x: 0, y: PAGE_H - 0.5, w: PAGE_W, h: 0.5, fill: { color: GRAY_PANEL }, line: { type: "none" } });
  slide.addImage({ path: abcLogoPath, x: MARGIN, y: PAGE_H - 0.42, w: 1.0, h: 0.34 });
  slide.addImage({ path: tibsoLogoPath, x: MARGIN + 1.15, y: PAGE_H - 0.4, w: 0.85, h: 0.3 });
  slide.addText("詳細はこちら:\nwww.abceducationgroup.com / www.tibso.org", {
    x: PAGE_W - 4.2, y: PAGE_H - 0.46, w: 3.75, h: 0.4,
    fontFace: BODY_FONT, fontSize: 7.5, bold: true, color: DARK,
    align: "right", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1,
  });
}

function heading(slide, text, x, y, w, opts) {
  const fontSize = (opts && opts.fontSize) || 14;
  slide.addText(text, {
    x, y, w, h: 0.3, fontFace: HEAD_FONT, fontSize, bold: true, color: DARK, isTextBox: true, margin: 0,
  });
}

function bullets(slide, items, x, y, w, h, opts) {
  const fontSize = (opts && opts.fontSize) || 10.5;
  const paraSpaceAfter = (opts && opts.paraSpaceAfter != null) ? opts.paraSpaceAfter : 5;
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: { code: "25E6" }, breakLine: i < items.length - 1, paraSpaceAfter } })),
    {
      x, y, w, h, fontFace: BODY_FONT, fontSize, color: TEXT,
      valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.05,
    }
  );
}

function badge(slide, text, x, y, w) {
  slide.addShape("roundRect", { x, y, w, h: 0.36, rectRadius: 0.06, fill: { color: DARK }, line: { type: "none" } });
  slide.addText(text, {
    x, y, w, h: 0.36, fontFace: HEAD_FONT, fontSize: 13, bold: true, color: WHITE,
    align: "left", valign: "middle", isTextBox: true, margin: [0, 0, 0, 0.14],
  });
}

function grayPanel(slide, x, y, w, h) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.12, fill: { color: GRAY_PANEL }, line: { type: "none" } });
}

function tagChip(slide, label, x, y) {
  const w = 1.0, h = 0.3;
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.06, fill: { color: GRAY_PANEL }, line: { color: DARK, width: 1 } });
  slide.addText(label, { x, y, w, h, fontFace: HEAD_FONT, fontSize: 10, bold: true, color: DARK, align: "center", valign: "middle", isTextBox: true, margin: 0 });
}

function paragraph(slide, text, x, y, w, h, opts) {
  const fontSize = (opts && opts.fontSize) || 10.5;
  const content = Array.isArray(text)
    ? text.map((t, i) => ({ text: t, options: { breakLine: i < text.length - 1, paraSpaceAfter: 2 } }))
    : text;
  slide.addText(content, {
    x, y, w, h, fontFace: BODY_FONT, fontSize, color: TEXT, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.12,
  });
}

// Mirrors renderSections' own height accounting, so panels can be sized to fit exactly.
function measureSectionsHeight(sections, opts) {
  const gap = (opts && opts.gap) || 0.18;
  let total = 0;
  for (const sec of sections) {
    total += 0.3; // heading
    if (sec.bullets) {
      total += sec.height || (0.22 * sec.bullets.length + 0.1);
    } else {
      total += sec.height || 0.6;
    }
    total += gap;
  }
  return total;
}

// data.page2Sections / data.activitiesSections / data.additionalInfoSections:
// array of { heading, body? , bullets? }
function renderSections(slide, sections, x, y, w, opts) {
  const gap = (opts && opts.gap) || 0.18;
  let cy = y;
  for (const sec of sections) {
    heading(slide, sec.heading, x, cy, w, { fontSize: 11.5 });
    cy += 0.3;
    if (sec.bullets) {
      const h = sec.height || (0.22 * sec.bullets.length + 0.1);
      bullets(slide, sec.bullets, x, cy, w, h, { fontSize: sec.fontSize || 10, paraSpaceAfter: 3 });
      cy += h;
    } else {
      const h = sec.height || 0.6;
      paragraph(slide, sec.body, x, cy, w, h, { fontSize: sec.fontSize || 10 });
      cy += h;
    }
    cy += gap;
  }
  return cy;
}

function buildFlyer(data, outputPath) {
  const pres = newPres();

  // ---------- Slide 1 ----------
  {
    const s = pres.addSlide();
    addHeader(s, data.schoolNameJa);

    let y = 1.45;
    s.addImage({ path: data.logo, x: MARGIN, y, w: data.logoW || 1.3, h: data.logoH || 1.3 });

    tagChip(s, data.tags[0], MARGIN + 2.1, y + 0.15);
    tagChip(s, data.tags[1], MARGIN + 3.25, y + 0.15);
    tagChip(s, data.tags[2], MARGIN + 4.4, y + 0.15);

    s.addImage({ path: data.usMap, x: PAGE_W - MARGIN - 2.7, y: y, w: 2.7, h: (2.7 * (data.usMapAspect || 0.68)) });

    y += (data.logoH || 1.3) + 0.2;
    heading(s, "所在地 (Location)", MARGIN, y, CONTENT_W);
    const locH = 0.24 * data.location.length + 0.15;
    bullets(s, data.location, MARGIN, y + 0.32, CONTENT_W - 3.0, locH, { fontSize: 10.5 });
    y += 0.32 + locH + 0.15;

    const colW = (CONTENT_W - 0.3 * 2) / 3;
    const col1x = MARGIN, col2x = MARGIN + colW + 0.3, col3x = MARGIN + (colW + 0.3) * 2;
    const col1h = 0.24 * data.eligibility.length + 0.15;
    const col2h = 0.24 * data.facts.length + 0.15;
    const col3h = 0.24 * data.highlights.length + 0.15;
    const maxColH = Math.max(col1h, col2h, col3h);

    heading(s, "出願資格 (Eligibility)", col1x, y, colW, { fontSize: 12 });
    bullets(s, data.eligibility, col1x, y + 0.32, colW, col1h, { fontSize: 9.5 });
    heading(s, "学校概要 (Facts)", col2x, y, colW, { fontSize: 12 });
    bullets(s, data.facts, col2x, y + 0.32, colW, col2h, { fontSize: 9.5 });
    heading(s, "特色 (Highlights)", col3x, y, colW, { fontSize: 12 });
    bullets(s, data.highlights, col3x, y + 0.32, colW, col3h, { fontSize: 9.5 });

    y += 0.32 + maxColH + 0.25;

    const bottomH = PAGE_H - 0.5 - y - 0.15;
    grayPanel(s, 0, y, PAGE_W, bottomH);

    const textW = CONTENT_W - 2.9;
    const introH = data.introBodyHeight || 1.0;
    const facilitiesH = data.facilitiesBodyHeight || (bottomH - 0.4 - 0.32 - introH - 0.32);
    let iy = y + 0.2;
    heading(s, "学校紹介 (Introduction)", MARGIN, iy, textW, { fontSize: 13 });
    iy += 0.32;
    paragraph(s, data.introBody, MARGIN, iy, textW, introH, { fontSize: 9.8 });

    let fy = iy + introH;
    heading(s, "学校施設 (Facilities)", MARGIN, fy, textW, { fontSize: 13 });
    fy += 0.32;
    paragraph(s, data.facilitiesBody, MARGIN, fy, textW, facilitiesH, { fontSize: 9.8 });

    const photoH = bottomH - 0.4;
    const photoW = photoH * (data.introPhotoAspect || 1.4);
    const maxPhotoW = 2.55;
    const finalPhotoW = Math.min(photoW, maxPhotoW);
    const finalPhotoH = finalPhotoW / (data.introPhotoAspect || 1.4);
    s.addImage({ path: data.introPhoto, x: PAGE_W - MARGIN - finalPhotoW, y: y + (bottomH - finalPhotoH) / 2, w: finalPhotoW, h: finalPhotoH });

    addFooter(s, data.abcLogo, data.tibsoLogo);
  }

  // ---------- Slide 2 ----------
  {
    const s = pres.addSlide();
    addHeader(s, data.schoolNameJa);

    let y = 1.45;
    badge(s, "コース (Courses)", MARGIN, y, 3.0);

    const panelY = y + 0.55;
    const panelH = PAGE_H - 0.5 - panelY - 0.25 - (data.matriculationPanelH || 2.0);
    const panelW = CONTENT_W - 2.7;
    grayPanel(s, MARGIN, panelY, panelW, panelH);

    renderSections(s, data.page2Sections, MARGIN + 0.25, panelY + 0.2, panelW - 0.5, { gap: 0.15 });

    const photos = data.page2Photos;
    const pGap = 0.15;
    const pH = (panelH - pGap * (photos.length - 1)) / photos.length;
    photos.forEach((p, i) => {
      s.addImage({ path: p, x: PAGE_W - MARGIN - 2.35, y: panelY + i * (pH + pGap), w: 2.35, h: pH });
    });

    const matY = panelY + panelH + 0.25;
    badge(s, "進学実績 (Matriculation)", MARGIN, matY, 3.2);
    const matPanelY = matY + 0.55;
    const matPanelH = PAGE_H - 0.5 - matPanelY - 0.15;
    grayPanel(s, MARGIN, matPanelY, CONTENT_W, matPanelH);

    if (data.matriculationBody) {
      paragraph(s, data.matriculationBody, MARGIN + 0.25, matPanelY + 0.2, CONTENT_W - 0.5, matPanelH - 0.4, { fontSize: 10 });
    } else if (data.matriculationColumns === 2) {
      const half = Math.ceil(data.matriculationList.length / 2);
      const colA = data.matriculationList.slice(0, half);
      const colB = data.matriculationList.slice(half);
      const mw = (CONTENT_W - 0.5 - 0.3) / 2;
      bullets(s, colA, MARGIN + 0.25, matPanelY + 0.2, mw, matPanelH - 0.4, { fontSize: 10 });
      bullets(s, colB, MARGIN + 0.25 + mw + 0.3, matPanelY + 0.2, mw, matPanelH - 0.4, { fontSize: 10 });
    } else {
      bullets(s, data.matriculationList, MARGIN + 0.25, matPanelY + 0.2, CONTENT_W - 0.5, matPanelH - 0.4, { fontSize: 10 });
    }

    addFooter(s, data.abcLogo, data.tibsoLogo);
  }

  // ---------- Slide 3 ----------
  {
    const s = pres.addSlide();
    addHeader(s, data.schoolNameJa);

    let y = 1.45;
    const photos3 = data.page3Photos;
    const gap3 = 0.2;
    const pW3 = (CONTENT_W - gap3 * (photos3.length - 1)) / photos3.length;
    const pH3 = pW3 * (data.page3PhotoAspect || 0.65);
    photos3.forEach((p, i) => {
      s.addImage({ path: p, x: MARGIN + i * (pW3 + gap3), y, w: pW3, h: pH3 });
    });

    y += pH3 + 0.25;
    badge(s, "課外活動 (Activities)", MARGIN, y, 3.0);
    const actPanelY = y + 0.55;
    const actGap = 0.2;
    const actPanelH = data.activitiesPanelH || (0.2 + measureSectionsHeight(data.activitiesSections, { gap: actGap }) + 0.1);
    grayPanel(s, MARGIN, actPanelY, CONTENT_W, actPanelH);
    renderSections(s, data.activitiesSections, MARGIN + 0.25, actPanelY + 0.2, CONTENT_W - 0.5, { gap: actGap });

    const addY = actPanelY + actPanelH + 0.25;
    badge(s, "その他の情報 (Additional Information)", MARGIN, addY, 4.2);
    const addPanelY = addY + 0.55;
    const addPanelH = PAGE_H - 0.5 - addPanelY - 0.15;
    grayPanel(s, MARGIN, addPanelY, CONTENT_W, addPanelH);
    renderSections(s, data.additionalInfoSections, MARGIN + 0.25, addPanelY + 0.2, CONTENT_W - 0.5, { gap: 0.2 });

    addFooter(s, data.abcLogo, data.tibsoLogo);
  }

  return pres.writeFile({ fileName: outputPath });
}

module.exports = { buildFlyer, PAGE_W, PAGE_H, MARGIN, CONTENT_W };
