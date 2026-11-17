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

function addHeader(slide, title, flagPath) {
  slide.addShape("rect", { x: 0, y: 0, w: PAGE_W, h: 1.35, fill: { color: ORANGE }, line: { type: "none" } });
  slide.addText(title, {
    x: MARGIN, y: 0.25, w: CONTENT_W - 1.0, h: 0.9,
    fontFace: HEAD_FONT, fontSize: 24, bold: true, color: WHITE,
    valign: "middle", isTextBox: true, margin: 0,
  });
  if (flagPath) {
    slide.addImage({ path: flagPath, x: PAGE_W - 1.05, y: 0.45, w: 0.6, h: 0.375 });
  }
  slide.addShape("rect", { x: 0, y: 1.35, w: PAGE_W, h: 0.12, fill: { color: LIGHT_GRAY }, line: { type: "none" } });
}

function addFooter(slide, abcLogoPath) {
  slide.addShape("rect", { x: 0, y: PAGE_H - 0.55, w: PAGE_W, h: 0.55, fill: { color: LIGHT_GRAY }, line: { type: "none" } });
  slide.addImage({ path: abcLogoPath, x: MARGIN, y: PAGE_H - 0.47, w: 1.5, h: 0.39 });
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
    x, y, w, h: 0.3, fontFace: HEAD_FONT, fontSize: 13, bold: true, color: ORANGE,
    isTextBox: true, margin: 0,
  });
}

function paragraph(slide, text, x, y, w, h, opts) {
  const fontSize = (opts && opts.fontSize) || 10.5;
  const content = Array.isArray(text)
    ? text.map((t, i) => ({ text: t, options: { breakLine: i < text.length - 1, paraSpaceAfter: 2 } }))
    : text;
  slide.addText(content, {
    x, y, w, h, fontFace: BODY_FONT, fontSize, color: DARK, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.12,
  });
}

function iconChip(slide, label, x, y) {
  const d = 0.62;
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: LIGHT_GRAY }, line: { color: ORANGE, width: 1.5 } });
  slide.addText("✓", { x, y: y - 0.02, w: d, h: d, fontFace: HEAD_FONT, fontSize: 20, bold: true, color: ORANGE, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  slide.addText(label, { x: x - 0.35, y: y + d + 0.02, w: d + 0.7, h: 0.3, fontFace: BODY_FONT, fontSize: 9, bold: true, color: DARK, align: "center", isTextBox: true, margin: 0 });
}

// Mirrors renderSections' own height accounting, so callers can size panels/offsets to fit.
function measureSectionsHeight(sections, opts) {
  const gap = (opts && opts.gap) || 0.18;
  let total = 0;
  for (const sec of sections) {
    if (sec.heading) total += 0.3;
    if (sec.bullets) {
      total += sec.height || (0.22 * sec.bullets.length + 0.1);
    } else {
      total += sec.height || 0.6;
    }
    total += gap;
  }
  return total;
}

// sections: array of { heading?, body?, bullets?, height?, fontSize? }
function renderSections(slide, sections, x, y, w, opts) {
  const gap = (opts && opts.gap) || 0.18;
  let cy = y;
  for (const sec of sections) {
    if (sec.heading) {
      sectionTitle(slide, sec.heading, x, cy, w);
      cy += 0.3;
    }
    if (sec.bullets) {
      const h = sec.height || (0.22 * sec.bullets.length + 0.1);
      bullets(slide, sec.bullets, x, cy, w, h, { fontSize: sec.fontSize || 10.5, paraSpaceAfter: 4 });
      cy += h;
    } else {
      const h = sec.height || 0.6;
      paragraph(slide, sec.body, x, cy, w, h, { fontSize: sec.fontSize || 10.5 });
      cy += h;
    }
    cy += gap;
  }
  return cy;
}

function rowImages(slide, photos, x, y, totalW, h, gap) {
  const n = photos.length;
  const w = (totalW - gap * (n - 1)) / n;
  photos.forEach((p, i) => {
    const px = x + i * (w + gap);
    slide.addImage({ path: p, x: px, y, w, h, sizing: { type: "cover", w, h } });
  });
}

function buildFlyer(data, outputPath) {
  const pres = newPres();

  // ---------- Slide 1 ----------
  {
    const s = pres.addSlide();
    addHeader(s, data.schoolNameJa, data.flag);

    let y = 1.65;
    s.addImage({ path: data.logo, x: MARGIN, y, w: data.logoW || 2.9, h: data.logoH || 0.76 });

    const chipY = y + 0.02;
    iconChip(s, data.tags[0], MARGIN + (data.chipOffsets ? data.chipOffsets[0] : 3.3), chipY);
    iconChip(s, data.tags[1], MARGIN + (data.chipOffsets ? data.chipOffsets[1] : 4.35), chipY);
    iconChip(s, data.tags[2], MARGIN + (data.chipOffsets ? data.chipOffsets[2] : 5.45), chipY);

    y += (data.logoH || 0.76) + 0.39;
    s.addImage({ path: data.usMap, x: PAGE_W - 3.0, y, w: 2.55, h: 2.55 * (data.usMapAspect || 0.63) });

    badge(s, "所在地", MARGIN, y, 3.0);
    const locH = data.locationHeight || (0.24 * data.location.length + 0.15);
    bullets(s, data.location, MARGIN, y + 0.42, 4.6, locH, { fontSize: 10.5 });

    y += 0.42 + locH + 0.15;

    const colW = (CONTENT_W - 0.3 * 2) / 3;
    const col1x = MARGIN, col2x = MARGIN + colW + 0.3, col3x = MARGIN + (colW + 0.3) * 2;
    const col1h = data.eligibilityHeight || (0.24 * data.eligibility.length + 0.15);
    const col2h = data.factsHeight || (0.24 * data.facts.length + 0.15);
    const col3h = data.highlightsHeight || (0.24 * data.highlights.length + 0.15);
    const maxColH = Math.max(col1h, col2h, col3h);

    badge(s, "出願資格", col1x, y, colW);
    bullets(s, data.eligibility, col1x, y + 0.42, colW, col1h, { fontSize: 10 });
    badge(s, "学校概要", col2x, y, colW);
    bullets(s, data.facts, col2x, y + 0.42, colW, col2h, { fontSize: 10 });
    badge(s, "特色", col3x, y, colW);
    bullets(s, data.highlights, col3x, y + 0.42, colW, col3h, { fontSize: 9.5 });

    y += 0.42 + maxColH + 0.25;

    const introH = data.introBodyHeight || 0.85;
    sectionTitle(s, "学校紹介", MARGIN, y, CONTENT_W - 2.8);
    paragraph(s, data.introBody, MARGIN, y + 0.32, CONTENT_W - 2.8, introH, { fontSize: 10.5 });

    const introY = y;
    y += introH + 0.6;
    const facilitiesH = data.facilitiesBodyHeight || 0.78;
    sectionTitle(s, "学校施設", MARGIN, y, CONTENT_W - 2.8);
    paragraph(s, data.facilitiesBody, MARGIN, y + 0.32, CONTENT_W - 2.8, facilitiesH, { fontSize: 10.5 });

    if (data.introPhoto) {
      const photoW = 2.7, photoH = 1.92;
      s.addImage({
        path: data.introPhoto, x: PAGE_W - MARGIN - photoW, y: introY + 0.2, w: photoW, h: photoH,
        sizing: { type: "cover", w: photoW, h: photoH },
      });
    }

    const bottomContentBottom = y + 0.32 + facilitiesH;
    const footerTop = PAGE_H - 0.55;
    if (bottomContentBottom > footerTop + 0.01) {
      console.warn(`[abc-template] Slide 1 content needs ${bottomContentBottom.toFixed(2)}in but footer starts at ${footerTop.toFixed(2)}in. Shorten introBody/facilitiesBody.`);
    }

    addFooter(s, data.abcLogo);
  }

  // ---------- Slide 2 ----------
  {
    const s = pres.addSlide();
    addHeader(s, data.schoolNameJa, data.flag);

    let y = 1.65;
    badge(s, "コース", MARGIN, y, CONTENT_W);
    y += 0.5;

    const leftW = data.page2Photos && data.page2Photos.length ? CONTENT_W - 2.6 : CONTENT_W;
    const sectionsGap = 0.15;
    renderSections(s, data.page2Sections, MARGIN, y, leftW, { gap: sectionsGap });

    if (data.page2Photos && data.page2Photos.length) {
      const pGap = 0.11;
      const pW = 2.3;
      const pH = 1.49;
      data.page2Photos.forEach((p, i) => {
        const py = y + i * (pH + pGap);
        s.addImage({ path: p, x: PAGE_W - MARGIN - pW, y: py, w: pW, h: pH, sizing: { type: "cover", w: pW, h: pH } });
      });
    }

    const sectionsH = measureSectionsHeight(data.page2Sections, { gap: sectionsGap });
    const photosH = data.page2Photos && data.page2Photos.length
      ? data.page2Photos.length * 1.49 + (data.page2Photos.length - 1) * 0.11
      : 0;
    y += Math.max(sectionsH, photosH) + 0.15;

    badge(s, "進学実績 (Matriculation)", MARGIN, y, CONTENT_W);
    y += 0.5;
    const matGap = 0.15;
    renderSections(s, data.matriculationSections, MARGIN, y, CONTENT_W, { gap: matGap });
    y += measureSectionsHeight(data.matriculationSections, { gap: matGap }) + 0.1;

    if (data.page2BottomPhotos && data.page2BottomPhotos.length) {
      const ph = data.page2BottomPhotosH || 1.4;
      const aspect = data.page2BottomPhotosAspect || (397 / 613);
      const pw = ph * (1 / aspect);
      const gap = 0.2;
      const n = data.page2BottomPhotos.length;
      const rowW = pw * n + gap * (n - 1);
      const startX = MARGIN + (CONTENT_W - rowW) / 2;
      data.page2BottomPhotos.forEach((p, i) => {
        const px = startX + i * (pw + gap);
        s.addImage({ path: p, x: px, y, w: pw, h: ph, sizing: { type: "cover", w: pw, h: ph } });
      });
      y += ph;
    }

    const footerTop = PAGE_H - 0.55;
    if (y > footerTop + 0.01) {
      console.warn(`[abc-template] Slide 2 content reaches ${y.toFixed(2)}in but footer starts at ${footerTop.toFixed(2)}in. Shorten sections or shrink page2BottomPhotosH.`);
    }

    addFooter(s, data.abcLogo);
  }

  // ---------- Slide 3 ----------
  {
    const s = pres.addSlide();
    addHeader(s, data.schoolNameJa, data.flag);

    let y = 1.65;
    if (data.page3Photos && data.page3Photos.length) {
      const ph = data.page3PhotosH || 1.5;
      rowImages(s, data.page3Photos, MARGIN, y, CONTENT_W, ph, 0.2);
      y += ph + 0.25;
    }

    badge(s, "課外活動 (Activities)", MARGIN, y, CONTENT_W);
    y += 0.5;
    const actGap = 0.2;
    renderSections(s, data.activitiesSections, MARGIN, y, CONTENT_W, { gap: actGap });
    y += measureSectionsHeight(data.activitiesSections, { gap: actGap }) + 0.1;

    badge(s, "その他の情報 (Other Facts)", MARGIN, y, CONTENT_W);
    y += 0.45;
    const ofGap = 0.2;
    renderSections(s, data.otherFactsSections, MARGIN, y, CONTENT_W, { gap: ofGap });
    const finalY = y + measureSectionsHeight(data.otherFactsSections, { gap: ofGap });

    const footerTop = PAGE_H - 0.55;
    if (finalY > footerTop + 0.01) {
      console.warn(`[abc-template] Slide 3 content needs to reach ${finalY.toFixed(2)}in but footer starts at ${footerTop.toFixed(2)}in. Shorten activitiesSections/otherFactsSections or shrink page3PhotosH.`);
    }

    addFooter(s, data.abcLogo);
  }

  return pres.writeFile({ fileName: outputPath });
}

module.exports = { buildFlyer, PAGE_W, PAGE_H, MARGIN, CONTENT_W };
