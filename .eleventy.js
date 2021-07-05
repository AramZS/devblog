const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const sassBuild = require("./_custom-plugins/sass-manager");
const path = require("path");
const del = require("del");
// const hljs = require("highlight.js"); // https://highlightjs.org/
const loadLanguages = require("prismjs/components/");
var mdProcessor = require("markdown-it");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

let Nunjucks = require("nunjucks");
const normalize = require("normalize-path");

loadLanguages(["yaml"]);

require("dotenv").config();

let domain_name = "https://fightwithtools.dev";
let throwOnUndefinedSetting = false;

if (process.env.IS_LOCAL) {
	domain_name = "http://localhost:8080";
	throwOnUndefinedSetting = true;
	console.log('Dev env')
}

process.env.DOMAIN = domain_name;

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

	// Not in place until v1
	// eleventyConfig.addGlobalData("domain_name", domain_name);
	//console.log("eleventyConfig", eleventyConfig);

	const dirToClean = path.join(siteConfiguration.dir.output, "*");
	del.sync(dirToClean, { dot: true });

	// var markdownIt = new mdProcessor();

	// https://www.11ty.dev/docs/plugins/syntaxhighlight/
	// eleventyConfig.addPlugin(syntaxHighlight);
	// https://www.11ty.dev/docs/plugins/navigation/
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	// https://www.11ty.dev/docs/plugins/rss/
	eleventyConfig.addPlugin(pluginRss);
	// https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap
	eleventyConfig.addPlugin(sitemap, {
		// Name of the property for the last modification date.
		// By default it is undefined and the plugin will fallback to `date`.
		// When set, the plugin will try to use this property and it will fallback
		// to the `date` property when needed.
		lastModifiedProperty: "modified",

		sitemap: {
			// Options for SitemapStream. See https://github.com/ekalinin/sitemap.js/blob/master/api.md#sitemapstream
			// Hostname is needed when the URLs of the items don't include it.
			hostname: domain_name,
		},
	});

	sassBuild(domain_name);
	eleventyConfig.on("beforeWatch", (changedFiles) => {
		// changedFiles is an array of files that changed
		// to trigger the watch/serve build
		sassBuild(domain_name);
	});

	// https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap

	// https://www.11ty.dev/docs/data-deep-merge/
	eleventyConfig.setDataDeepMerge(true);

	// Alias `layout: post` to `layout: layouts/post.njk`
	// eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

	// Copy the `img` folders to the output
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("./CNAME");
	// eleventyConfig.addPassthroughCopy("src/.gitignore");
	eleventyConfig.addPassthroughCopy({ "dinky/assets/js": "assets/js" });
	eleventyConfig.addPassthroughCopy({
		"dinky/assets/images": "assets/images",
	});
	eleventyConfig.addPassthroughCopy({
		"dinky/_sass": "sass/dinky/_sass",
	});
	eleventyConfig.addPassthroughCopy({
		"src/_sass": "sass/src/_sass",
	});

	const pathNormalizer = function(pathString){
		return normalize(path.normalize(path.resolve(".")))
	}

	// Nunjucks Filters
	/**
		let nunjucksEnvironment = Nunjucks.configure(
			new Nunjucks.FileSystemLoader([
				siteConfiguration.dir.includes,
				siteConfiguration.dir.input,
				siteConfiguration.dir.layouts,
				"."
			]),
			{
				throwOnUndefined: throwOnUndefinedSetting,
				autoescape: true
			}
		);
		// eleventyConfig.setLibrary("njk", nunjucksEnvironment);
		//eleventyConfig.addNunjucksFilter("interpolate", function(value) {
		//	return Nunjucks.renderString(text, this.ctx);
		//});
	*/
	eleventyConfig.addShortcode("postList", function(collectionName, collectionOfPosts) {
		let postList = collectionOfPosts.map((post) => {
			return `<li>${post.data.title}</li>`
		})
		return `<p>${collectionName}</p>
		<ul>
			<!-- Collection: ${collectionName} -->
			${postList.join('\n')}
		</ul>
		`;
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
		replaceLink: function (link, env) {
			// console.log("env:", env);
			var imageLinkRegex = /^..\/img\//;
			if (link && imageLinkRegex.test(link)) {
				return (
					env.site.site_url +
					"/img/" +
					link.replace(imageLinkRegex, "")
				);
			} else {
				return link;
			}
		},
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
	var markdownSetup = mdProcessor(options)
		.use(require("markdown-it-replace-link"))
		.use(require("markdown-it-todo"));

	// via https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
	var defaultRender =
		markdownSetup.renderer.rules.link_open ||
		function (tokens, idx, options, env, self) {
			return self.renderToken(tokens, idx, options);
		};
	markdownSetup.renderer.rules.link_open = function (
		tokens,
		idx,
		options,
		env,
		self
	) {
		// If you are sure other plugins can't add `target` - drop check below
		var aIndex = tokens[idx].attrIndex("target");

		if (aIndex < 0) {
			tokens[idx].attrPush(["target", "_blank"]); // add new attribute
		} else {
			tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
		}

		// pass token to default renderer.
		return defaultRender(tokens, idx, options, env, self);
	};
	eleventyConfig.setLibrary("md", markdownSetup);

	return siteConfiguration;
};
