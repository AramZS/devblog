const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const sassBuild = require("./_custom-plugins/sass-manager");
const projectSet = require("./src/_data/projects");
const pluginTOC = require("eleventy-plugin-toc");
const getCollectionItem = require("@11ty/eleventy/src/Filters/GetCollectionItem");
// const markdownShorthand = require("./_custom-plugins/markdown-it-short-phrases");
// const markdownItRegex = require("markdown-it-regex");
const path = require("path");
const del = require("del");
// const hljs = require("highlight.js"); // https://highlightjs.org/
const loadLanguages = require("prismjs/components/");
var mdProcessor = require("markdown-it");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

let Nunjucks = require("nunjucks");
const normalize = require("normalize-path");

const util = require("util");

var slugify = require("slugify");

loadLanguages(["yaml"]);

require("dotenv").config();

let domain_name = "https://fightwithtools.dev";
let throwOnUndefinedSetting = false;

if (process.env.IS_LOCAL) {
	domain_name = "http://localhost:8080";
	throwOnUndefinedSetting = true;
	console.log("Dev env");
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

	// https://www.11ty.dev/docs/data-deep-merge/
	eleventyConfig.setDataDeepMerge(true);

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
	eleventyConfig.addWatchTarget("./_custom-plugins/");
	// eleventyConfig.addWatchTarget("./src/_sass");
	// sassBuild(domain_name);
	eleventyConfig.on("beforeWatch", (changedFiles) => {
		// changedFiles is an array of files that changed
		// to trigger the watch/serve build
		// sassBuild(domain_name);
	});
	eleventyConfig.addPlugin(require("eleventy-plugin-dart-sass"), {
		sassLocation: path.join(path.resolve("."), "src/_sass/"),
		perTemplateFiles: "template-",
		outDir: path.join(path.resolve("."), "docs"),
		domainName: domain_name,
	});

	// https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap

	// Alias `layout: post` to `layout: layouts/post.njk`
	// eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

	// Copy the `img` folders to the output
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("./CNAME");
	eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
	// eleventyConfig.addPassthroughCopy("src/.gitignore");
	eleventyConfig.addPassthroughCopy({ "dinky/assets/js": "assets/js" });
	eleventyConfig.addPassthroughCopy({ "src/_well-known": ".well-known" });
	eleventyConfig.addPassthroughCopy({
		"dinky/assets/images": "assets/images",
	});
	eleventyConfig.addPassthroughCopy({
		"dinky/_sass": "sass/dinky/_sass",
	});
	eleventyConfig.addPassthroughCopy({
		"src/assets": "assets",
	});

	// Can't use this until ver 1 apparently
	/**
	const getDirectories = source =>
		readdirSync(source, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name)


	eleventyConfig.addGlobalData('projects', function(collectionApi) {
        return getDirectories('src/projects/');
    });
	*/

	const pathNormalizer = function (pathString) {
		return normalize(
			path.normalize(path.join(path.resolve("."), pathString))
		);
	};

	// Nunjucks Filters
	/** this method doesn't work for unclear reasons
	let nunjucksFileSystem = [
		pathNormalizer(
			path.join(
				siteConfiguration.dir.input,
				siteConfiguration.dir.includes
			)
		),
		pathNormalizer(
			path.join(
				siteConfiguration.dir.input,
				siteConfiguration.dir.layouts
			)
		),
		pathNormalizer(siteConfiguration.dir.input),
		normalize(path.normalize(".")),
	];
	console.log("nunjucksFileSystem", nunjucksFileSystem);
	let nunjucksEnvironment = Nunjucks.configure(
		new Nunjucks.FileSystemLoader(nunjucksFileSystem),
		{
			throwOnUndefined: throwOnUndefinedSetting,
			autoescape: true,
		}
	);
	eleventyConfig.setLibrary("njk", nunjucksEnvironment);
    */
	const nunjucksFileSystem = [
		path.join(siteConfiguration.dir.input, siteConfiguration.dir.includes),
		path.join(siteConfiguration.dir.input, siteConfiguration.dir.layouts),
		siteConfiguration.dir.input,
		normalize(path.normalize(".")),
	];
	const njkEngine = require("nunjucks").configure(nunjucksFileSystem, {
		autoescape: false,
		throwOnUndefined: throwOnUndefinedSetting,
		noCache: throwOnUndefinedSetting,
	});
	// /Users/zuckerscharffa/Dev/fightwithtooldev/.eleventy.js
	// /Users/zuckerscharffa/Dev/fightwithtooldev/src
	console.log("other nunjucksFileSystem", nunjucksFileSystem);
	eleventyConfig.setLibrary("njk", njkEngine); //: autoescape for CSS rules
	//eleventyConfig.addNunjucksFilter("interpolate", function(value) {
	//	return Nunjucks.renderString(text, this.ctx);
	//});
	eleventyConfig.addShortcode(
		"postList",
		function (collectionName, collectionOfPosts, order, hlevel) {
			var postCollection = [];
			if (collectionOfPosts) {
				// Clone post collection to avoid reverse having weird effects on other uses of the collection due to it being transformed in place.
				postCollection = collectionOfPosts.slice();
			} else {
				return "";
			}
			if (!!!order) {
				order = "reverse";
			}
			if (order === "reverse" && collectionOfPosts) {
				// console.log(postCollection.map((post) => post.data.title));
				postCollection = postCollection.reverse();
				// console.log("reversed",postCollection.map((post) => post.data.title));
			}
			if (postCollection) {
				postList = postCollection.map((post) => {
					let postName = post.data.title;
					return `<li><a href="${post.url}">${postName}</a></li>`;
				});
				// console.log("rendered reversed", postList);
			}
			let hblock = "";
			if (!!!hlevel) {
				hlevel = "p";
			}
			if (hlevel != "noheader") {
				hblock = `<${hlevel}>${collectionName}</${hlevel}>`;
			}
			return `${hblock}
		<ul data-collection-name="${collectionName}">
			${postList.join("\n")}
		</ul>
		`;
		}
	);

	eleventyConfig.addShortcode(
		"projectList",
		function (collectionName, collectionOfPosts, order, hlevel, limit) {
			var postCollection = [];
			if (collectionOfPosts) {
				// Clone post collection to avoid reverse having weird effects on other uses of the collection due to it being transformed in place.
				postCollection = collectionOfPosts.slice();
			}
			if (!!!order) {
				order = "reverse";
			}
			if (order === "reverse" && collectionOfPosts) {
				postCollection = postCollection.reverse();
			}
			let postList = [];
			if (collectionOfPosts && limit) {
				postCollection = postCollection.slice(0, limit);
			}
			if (postCollection) {
				postList = postCollection.map((post) => {
					let postName = post.data.title;
					if (post.data.hasOwnProperty("project")) {
						postName =
							"<em>" + post.data.project + "</em> | " + postName;
					}
					return `<li><a href="${post.url}">${postName}</a></li>`;
				});
			}
			if (!!!hlevel) {
				hlevel = "p";
			}
			return `<${hlevel}>${collectionName}</${hlevel}>
		<ul data-collection-name="${collectionName}">
			${postList.join("\n")}
		</ul>
		`;
		}
	);
	function getNProjectItem(collection, page, projectName, index, operation) {
		let found = false;
		let i = index;
		if (projectName) {
			let lastPost;
			while (found === false) {
				lastPost = getCollectionItem(collection, page, i);
				if (
					lastPost &&
					lastPost.data.hasOwnProperty("project") &&
					lastPost.data.project == projectName &&
					lastPost.data.tags.includes("WiP")
				) {
					found = true;
				} else {
					if (!lastPost) {
						return false;
					}
					i = operation(i);
				}
			}
			return lastPost;
		} else {
			return false;
		}
	}
	eleventyConfig.addFilter(
		"getPreviousProjectItem",
		function (collection, page, project) {
			let index = -1;
			return getNProjectItem(
				collection,
				page,
				project,
				index,
				function (i) {
					return i - 1;
				}
			);
		}
	);
	eleventyConfig.addFilter(
		"getNextProjectItem",
		function (collection, page, project) {
			let index = 1;
			return getNProjectItem(
				collection,
				page,
				project,
				index,
				function (i) {
					return i + 1;
				}
			);
		}
	);
	eleventyConfig.addFilter("relproject", function (url) {
		var urlArray = url.split("/");
		var urlFiltered = urlArray.filter((e) => e.length > 0);
		urlFiltered.pop(); // Remove post path
		urlFiltered.shift(); // Remove `posts/`
		return process.env.DOMAIN + "/" + urlFiltered.join("/");
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("slice", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});
	/**
	// Get the first `n` chracters of a `s` string.
	eleventyConfig.addFilter("truncate", (s, n) => {
		if ("string" != typeof s || s.length === 0) {
			return "";
		}
		if (n < 0) {
			return s;
		}

		return s.substring(0, n);
	});
 */
	function filterTagList(tags) {
		return (tags || []).filter(
			(tag) =>
				["all", "nav", "post", "posts", "projects"].indexOf(tag) === -1
		);
	}

	eleventyConfig.addFilter("filterTagList", filterTagList);

	const paginate = (arr, size) => {
		return arr.reduce((acc, val, i) => {
			let idx = Math.floor(i / size);
			let page = acc[idx] || (acc[idx] = []);
			page.push(val);

			return acc;
		}, []);
	};

	let tagSet = new Set();
	let tagList = [];

	getAllTags = (allPosts) => {
		allPosts.forEach((item) => {
			if ("tags" in item.data) {
				let tags = filterTagList(item.data.tags);
				// console.log("Tags:", tags);
				tags.forEach((tag) => {
					tagSet.add(tag);
				});
			}
		});
		tagList = [...tagSet];
		return tagList;
	};

	const makePageObject = (tagName, slug, number, posts, first, last) => {
		return {
			tagName: tagName,
			slug: slug ? slug : slugify(tagName.toLowerCase()),
			number: number,
			posts: posts,
			first: first,
			last: last,
		};
	};

	const getPostClusters = (allPosts, tagName, slug) => {
		aSet = new Set();
		let postArray = allPosts.reverse();
		aSet = [...postArray];
		postArray = paginate(aSet, 10);
		let paginatedPostArray = [];
		postArray.forEach((p, i) => {
			paginatedPostArray.push(
				makePageObject(
					tagName,
					slug,
					i + 1,
					p,
					i === 0,
					i === postArray.length - 1
				)
			);
		});
		// console.log(paginatedPostArray)
		return paginatedPostArray;
	};

	eleventyConfig.addCollection("postsPages", (collection) => {
		return getPostClusters(collection.getFilteredByTag("posts"), "Posts");
	});

	eleventyConfig.addCollection("projectsPages", (collection) => {
		return getPostClusters(
			collection.getFilteredByTag("projects"),
			"Projects"
		);
	});

	// Create an array of all tags
	eleventyConfig.addCollection("tagList", (collection) => {
		return getAllTags(collection.getAll());
	});

	// Create a list of posts by tag for paged lists
	eleventyConfig.addCollection("deepTagList", (collection) => {
		const maxPostsPerPage = 10;
		const pagedPosts = [];
		tagList = getAllTags(collection.getAll());
		tagList.forEach((tagName) => {
			const taggedPosts = [
				...collection.getFilteredByTag(tagName),
			].reverse();
			const numberOfPages = Math.ceil(
				taggedPosts.length / maxPostsPerPage
			);

			for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
				const sliceFrom = (pageNum - 1) * maxPostsPerPage;
				const sliceTo = sliceFrom + maxPostsPerPage;

				pagedPosts.push(
					makePageObject(
						tagName,
						false,
						pageNum,
						taggedPosts.slice(sliceFrom, sliceTo),
						pageNum === 1,
						pageNum === numberOfPages
					)
				);
			}
		});
		console.log("pagedPosts", pagedPosts[0].tagName);
		return pagedPosts;
		collection.getAll().forEach((item) => {
			if ("tags" in item.data) {
				let tags = filterTagList(item.data.tags);
				// console.log("Tags:", tags);
				tags.forEach((tag) => {
					if (!tagSet.hasOwnProperty(tag)) {
						console.log("Add new tag to object", tag);
						tagSet[tag] = new Set();
					}
					item.data.verticalTag = tag;
					tagSet[tag].add(item);
				});
			}
		});
		let taggedArray = [];
		Object.keys(tagSet).forEach((key) => {
			// console.log(key);        // the name of the current key.
			// console.log(myObj[key]); // the value of the current key.
			taggedArray.push([...tagSet[key]]);
		});
		console.log("tagset", taggedArray[0][0].data.verticalTag);
		return tagSet;
	});

	eleventyConfig.addCollection("deepProjectPostsList", (collection) => {
		let deepProjectPostList = [];
		// console.log("projectSet", projectSet);
		projectSet.forEach((project) => {
			// console.log("aProject", project);
			if (project.count > 0) {
				let allProjectPosts = collection.getFilteredByTag("projects");
				// console.log(allProjectPosts[2].data.project, project.projectName);
				let allPosts = allProjectPosts.filter((post) => {
					if (post.data.project == project.projectName) {
						return true;
					} else {
						return false;
					}
				});
				allPosts.reverse();
				const postClusters = getPostClusters(
					allPosts,
					project.projectName,
					project.slug
				);
				// console.log("allPosts", postClusters);
				deepProjectPostList.push(
					getPostClusters(allPosts, project.projectName, project.slug)
				);
			}
		});
		// console.log("deepProjectPostList", deepProjectPostList);
		let pagedDeepProjectList = [];
		deepProjectPostList.forEach((projectCluster) => {
			/**
			 * 	tagName,
				slug: slug ? slug : slugify(tagName.toLowerCase()),
				number: i + 1,
				posts: p,
				first: i === 0,
				last: i === postArray.length - 1,
			*/
			pagedDeepProjectList.push(...projectCluster);
		});
		// console.log("pagedDeepProjectList", pagedDeepProjectList);
		return pagedDeepProjectList;
	});

	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h1", "h2", "h3", "h4"], // which heading tags are selected headings must each have an ID attribute
		wrapper: "nav", // element to put around the root `ol`/`ul`
		wrapperClass: "toc", // class for the element around the root `ol`/`ul`
		ul: false, // if to use `ul` instead of `ol`
		flat: false, // if subheadings should appear as child of parent or as a sibling
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
			//console.log(Prism.languages);
			Prism.languages.liquid = Prism.languages.extend("html", {
				templateTag: {
					pattern: /(?<=\{\%).*?(?=\%\})/g,
					greedy: true,
					inside: Prism.languages.javascript,
				},
				templateTagBoundary: {
					pattern: /\{\%}?|\%\}?/g,
					greedy: false,
					alias: "template-tag-boundary",
				},
			});
			Prism.languages.njk = Prism.languages.extend("liquid", {});
		},
	});

	eleventyConfig.addFilter("console", function (value) {
		let objToEcho;
		if (value.posts) {
			objToEcho = Object.assign({}, value);
			delete objToEcho.posts;
		} else {
			objToEcho = value;
		}
		const str = util.inspect(objToEcho);
		return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`;
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
		.use(require("markdown-it-todo"))
		// .use(require("./_custom-plugins/markdown-it-short-phrases"))
		.use(require("markdown-it-find-and-replace"))
		// .use(require('@gerhobbelt/markdown-it-footnote'))
		.use(require("markdown-it-anchor"), {
			slugify: (s) => slugify(s.toLowerCase().replace(/"/g, "")),
		})
		.use(require("./_custom-plugins/markdown-it-git-commit/index.js"))
		.use(
			require("./_custom-plugins/markdown-it-codeblocks-skip-links/index.js")
		);

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
		if (tokens[idx].meta && tokens[idx].meta.includes("skip-link")) {
			return defaultRender(tokens, idx, options, env, self);
		}
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
