const contexter = require("../../../contexter");
const fs = require("fs");
var path = require("path");
var slugify = require("slugify");
var sanitizeFilename = require("sanitize-filename");
var imageHandler = require("./image-handler");

const urlRegex =
	/^([\t\- ]*)*(?<main>(\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))(?=\n|\r)$)+)/gim;

module.exports = (eleventyConfig, userOptions) => {
	let options = {
		name: "markdown-contexter",
		extension: "md",
		cachePath: "_contexterCache",
		publicPath: "assets/images/contexter",
		domain: "http://localhost:8080",
		existingRenderer: function () {},
		...userOptions,
	};
	console.log("markdown-contexter-go");
	eleventyConfig.addPassthroughCopy({
		[`${options.cachePath}/images`]: options.publicPath,
	});

	const cacheFilePath = (pageFilePath, searchKey, notJson = false) => {
		const cacheFolder = path.join(
			__dirname,
			"../../",
			`/${options.cachePath}/`,
			pageFilePath
		);
		let cacheFile = cacheFolder + searchKey;
		if (!notJson) {
			cacheFile = cacheFile + ".json";
		}
		// console.log('cacheFile: ', cacheFile)
		return { cacheFolder, cacheFile };
	};

	const reMarkdown = (inputContent, data) => {
		let promiseContext = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("foo");
			}, 300);
		});
		// const urls = urlRegex.exec(inputContent); // .exec(inputContent);
		let matchArray = [];
		let urlsArray = [];
		let counter = 0;
		while ((matchArray = urlRegex.exec(inputContent)) != null) {
			console.log("Found URLs", matchArray.groups.main, matchArray[0]);
			urlsArray.push({
				url: matchArray.groups.main,
				replace: matchArray[0],
			});
			counter++;
		}
		if (urlsArray.length) {
			urlsArray.forEach((urlObj) => {
				const link = urlObj.url;
				console.log("inputContent Process: ", link);
				// console.log("inputContent treated", inputContent);
				const fileName = sanitizeFilename(
					slugify(contexter.sanitizeLink(link)).replace(/\./g, "")
				);
				const { cacheFolder, cacheFile } = cacheFilePath("", fileName);
				let imageCheck = false;
				try {
					fs.accessSync(cacheFile, fs.constants.F_OK);
					const contextString = fs.readFileSync(cacheFile).toString();
					// Rebuild conditions?
					// Mby https://attacomsian.com/blog/nodejs-get-file-last-modified-date
					const contextData = JSON.parse(contextString);
					let htmlEmbed = contextData.htmlEmbed.replace(
						/\t|^\s+|\n|\r/gim,
						""
					);
					const localImageName = imageHandler.imageCheck(
						contextData,
						fileName,
						cacheFilePath
					);
					if (localImageName) {
						imageCheck = true;
						console.log(
							"Local Cached Image",
							`${options.domain}/${options.publicPath}/${fileName}/${localImageName}`
						);
						let image = "";
						if (
							Array.isArray(contextData.data.finalizedMeta.image)
						) {
							image = contextData.data.finalizedMeta.image[0];
						} else {
							image = contextData.data.finalizedMeta.image;
						}
						htmlEmbed = htmlEmbed.replace(
							image,
							`${options.domain}/${options.publicPath}/${fileName}/${localImageName}`
						);
					}
					// console.log("contextData", contextData);
					// const contextData = JSON.parse(contextString);
					inputContent = inputContent.replace(
						urlObj.replace,
						htmlEmbed
					);
				} catch (e) {
					if (imageCheck) {
						console.log("Image issue possibly", e);
					}
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
							console.log("Writing data for: ", link);
							fs.mkdirSync(cacheFolder, { recursive: true });
							imageHandler.handleImageFromObject(
								r,
								fileName,
								cacheFilePath
							);
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
