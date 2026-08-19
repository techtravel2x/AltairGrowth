module.exports = function (eleventyConfig) {
  // Static assets copied as-is: CSS, JS, logo images
  eleventyConfig.addPassthroughCopy("src/assets");

  // The Sveltia CMS admin panel — served at /admin/
  eleventyConfig.addPassthroughCopy("src/admin");

  // SEO files served at the site root
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // ---- Content collections (these feed the CMS-managed pages) ----

  // FAQ entries: published only, ordered by the "order" field
  eleventyConfig.addCollection("faqItems", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/faq/*.md")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Insights posts: newest first
  eleventyConfig.addCollection("insightPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/insights/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Open roles only (closed roles stay in the repo but drop off the page)
  eleventyConfig.addCollection("openRoles", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/roles/*.md")
      .filter((item) => item.data.open !== false);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
