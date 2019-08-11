(() => {
  const buildSection = (sectionEl) => {
    const name = $(sectionEl).find(".section-name").text().trim();
    const subSections = $(sectionEl).find(".subsection")
      .toArray().map(el => buildSubSection(el));

    return {name, subSections};
  };

  const buildSubSection = (subSectionEl) => {
    const name = $(subSectionEl).find(".subsection-title").text().trim();
    const blocks = $(subSectionEl).find(".vertical").toArray().map(el => buildBlock(el));

    return {name, blocks};
  };

  const buildBlock = (blockEl) => {
    const name = $(blockEl).find(".vertical-title").text().trim();
    const link = $(blockEl).find(".outline-item").attr("href");

    return {name, link};
  };

  return $("#main .section").toArray().map(sectionEl => buildSection(sectionEl));
})();
