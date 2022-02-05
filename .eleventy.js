const { DateTime } = require('luxon');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 752],
    formats: ["jpeg"],
    urlPath: "/img/",
    outputDir: "./public/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/audio");
  eleventyConfig.addPassthroughCopy("src/docs");

  eleventyConfig.setBrowserSyncConfig({
    files: './public/css/**/*.css',
    open: true,
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addPairedShortcode('button', function(icon, options = {}) {
    const { label = '' } = options;
    const { href = '' } = options;
    const { classes = '' } = options;

    return `<a class="c-button ${classes}" href="${href}">
      <span class="c-button__text">
        ${label}
      </span>
      ${icon ?? `<span class="c-button__icon">${icon}</span>`}
    </a>`;
  })


  // Set custom directories for input, output, includes, and data
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "public",
    }
  };
};