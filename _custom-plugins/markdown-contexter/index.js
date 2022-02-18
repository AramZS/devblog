const contexter = require("../../../contexter");
const fs = require("fs");
var path = require("path");
var slugify = require("slugify");
var sanitizeFilename = require("sanitize-filename");

const urlRegex =
	/^(?:[\t\- ]*)(?<main>(\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))(?=\n|\r)$)+)/gim;

module.exports = (eleventyConfig, userOptions) => {
	let options = {
		name: "markdown-contexter",
		extension: "md",
		cachePath: "_contexterCache",
		existingRenderer: function () {},
		...userOptions,
	};
	console.log("markdown-contexter-go");

	const cacheFilePath = (pageFilePath, searchKey) => {
		const cacheFolder = path.join(
			__dirname,
			"../../",
			`/${options.cachePath}/`,
			pageFilePath
		);
		const cacheFile =
			cacheFolder +
			sanitizeFilename(slugify(searchKey).replace(/\./g, ""));
		// console.log('cacheFile: ', cacheFile)
		return { cacheFolder, cacheFile: cacheFile + ".json" };
	};

	const reMarkdown = (inputContent, data) => {
		let promiseContext = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("foo");
			}, 300);
		});
		const urls = urlRegex.exec(inputContent); // .exec(inputContent);
		let matchArray = [];
		let urlsArray = [];
		let counter = 0;
		while ((matchArray = urlRegex.exec(inputContent)) != null) {
			if (urls) {
				console.log(
					"Found URLs",
					matchArray.groups.main,
					matchArray[0]
				);
				urlsArray.push({
					url: matchArray.groups.main,
					replace: matchArray[0],
				});
				counter++;
			}
		}
		if (urlsArray.length) {
			urlsArray.forEach((urlObj) => {
				const link = urlObj.url;
				console.log("inputContent Process");
				// console.log("inputContent treated", inputContent);
				const { cacheFolder, cacheFile } = cacheFilePath(
					"",
					contexter.uidLink(contexter.sanitizeLink(link))
				);
				try {
					fs.accessSync(cacheFile, fs.constants.F_OK);
					const contextString = fs.readFileSync(cacheFile).toString();
					const contextData = JSON.parse(contextString);
					// console.log("contextData", contextData);
					// const contextData = JSON.parse(contextString);
					inputContent = inputContent.replace(
						urlObj.replace,
						contextData.htmlEmbed
					);
				} catch (e) {
					let pContext = contexter.context(link);
					// No file yet
					console.log(
						"Cached link " + cacheFile + " to repo not ready"
					);
					pContext.then((r) => {
						console.log("Context ready", r.linkId);
						// No file yet
						console.log(
							"Cached link for " + cacheFile + " ready to write."
						);
						try {
							fs.mkdirSync(cacheFolder, { recursive: true });
							// console.log('write data to file', cacheFile)
							fs.writeFileSync(cacheFile, JSON.stringify(r));
						} catch (e) {
							console.log("writing to cache failed:", e);
						}
					});
				}
			});
		}
		// 2nd argument sets env
		return options.existingRenderer.render(inputContent, data);
	};
	const compiler = (inputContent, inputPath) => {
		// console.log("msc", inputContent, inputPath);
		let remark = false;
		if (
			inputContent &&
			inputPath &&
			inputPath.endsWith(`.${options.extension}`)
		) {
			// console.log("CONTENT REPLACEx", arguments, this);
			remark = true;
		}
		// https://github.com/11ty/eleventy/issues/2217
		return function (data) {
			// console.log("msc compile", data);
			// options.md.set(data);
			if (remark && data.layout && /post/.test(data.layout)) {
				// console.log("msc compile");

				const rmResult = reMarkdown(inputContent, data);
				return rmResult;
			}
			// console.log("msc data");
			// console.dir(this.global);
			// You can also access the default `markdown-it` renderer here:
			return this.defaultRenderer(data);
		};
	};
	eleventyConfig.addExtension(options.extension, {
		read: true,
		compile: compiler,
	});
	/**
	eleventyConfig.addTransform(
		"async-contexter",
		async function (content, outputPath) {
			// console.log("markdown-contexter-transform-hooked");
			if (outputPath && outputPath.endsWith(".md")) {
				console.log("CONTENT REPLACE");
				content.replace(
					"https://twitter.com/Chronotope/status/1402628536121319424",
					"https://twitter.com/Chronotope/status/1402628536121319424?ab=123"
				);
			}
			return content;
		}
	);
*/
};
