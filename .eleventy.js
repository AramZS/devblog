const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const sassBuild = require("./_custom-plugins/sass-manager");
const path = require("path");
const del = require("del");
// const hljs = require("highlight.js"); // https://highlightjs.org/
const loadLanguages = require("prismjs/components/");
var mdProcessor = require("markdown-it");

loadLanguages(["yaml"]);

module.exports = function (eleventyConfig) {
	var siteConfiguration = {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html
		templateFormats: ["md", "njk", "html"],

		// -----------------------------------------------------------------
		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Don’t worry about leading and trailing slashes, we normalize these.

		// If you don’t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for link URLs (it does not affect your file structure)
		// Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

		// You can also pass this in on the command line using `--pathprefix`

		// Optional (default is shown)
		pathPrefix: "/",
		// -----------------------------------------------------------------

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// Opt-out of pre-processing global data JSON files: (default: `liquid`)
		dataTemplateEngine: false,

		// These are all optional (defaults are shown):
		dir: {
			input: "src",
			includes: "_includes",
			layouts: "_layouts",
			data: "_data",
			output: "docs",
		},
	};

	const dirToClean = path.join(siteConfiguration.dir.output, "*");
	del.sync(dirToClean, { dot: true });

	// var markdownIt = new mdProcessor();

	// https://www.11ty.dev/docs/plugins/syntaxhighlight/
	// eleventyConfig.addPlugin(syntaxHighlight);
	// https://www.11ty.dev/docs/plugins/navigation/
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	// https://www.11ty.dev/docs/plugins/rss/
	eleventyConfig.addPlugin(pluginRss);

	sassBuild();
	eleventyConfig.on("beforeWatch", (changedFiles) => {
		// changedFiles is an array of files that changed
		// to trigger the watch/serve build
		sassBuild();
	});

	// https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap

	// https://www.11ty.dev/docs/data-deep-merge/
	eleventyConfig.setDataDeepMerge(true);

	// Alias `layout: post` to `layout: layouts/post.njk`
	// eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

	// Copy the `img` folders to the output
	eleventyConfig.addPassthroughCopy("img");
	eleventyConfig.addPassthroughCopy({ "dinky/assets/js": "assets/js" });
	eleventyConfig.addPassthroughCopy({
		"dinky/assets/images": "assets/images",
	});

	eleventyConfig.addPlugin(syntaxHighlight, {
		templateFormats: ["md", "njk"],
		init: function ({ Prism }) {
			Prism.languages.markdown = Prism.languages.extend("markup", {
				frontmatter: {
					pattern: /^---[\s\S]*?^---$/m,
					greedy: true,
					inside: Prism.languages.yaml,
				},
			});
		},
	});

	let options = {
		html: true,
		breaks: true,
		linkify: true,
		/** langPrefix: "language-",
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					console.log("Syntax highlight good", lang);
					return hljs.highlight(lang, str).value;
				} catch (__) {
					console.log("Syntax highlight fail", lang);
				}
			}
			console.log("Fallback syntax highlighting");
			return ""; // use external default escaping
		},**/
	};
	eleventyConfig.setLibrary("md", mdProcessor(options));
	eleventyConfig.setLibrary("markdown", mdProcessor(options));

	return siteConfiguration;
};
