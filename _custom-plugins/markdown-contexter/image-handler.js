const fetchUrl = require("./fetch-tools");
var sanitizeFilename = require("sanitize-filename");
const fs = require("fs");
var path = require("path");
var slugify = require("slugify");

const imageCheck = (response, cacheFile, cacheFilePath) => {
	const r = response.data;
	if (
		r.finalizedMeta &&
		r.finalizedMeta.image &&
		r.finalizedMeta.image.length
	) {
		let image = "";
		if (Array.isArray(r.finalizedMeta.image)) {
			image = r.finalizedMeta.image[0];
		} else {
			image = r.finalizedMeta.image;
		}
		console.log("Image found ", image);
		const imageFileNameArray = image.split("/");
		const imageFileName = imageFileNameArray[imageFileNameArray.length - 1];
		const imageFile = imageFileName.split("?")[0];
		console.log(
			"Image file pieces",
			imageFileNameArray,
			imageFileName,
			imageFile
		);
		const fileObj = cacheFilePath(
			"images/" + cacheFile + "/",
			imageFile,
			true
		);
		const imageCacheFolder = fileObj.cacheFolder;
		const imageCacheFile = fileObj.cacheFile;
		console.log("File Path Generation", imageCacheFolder, imageCacheFile);
		try {
			fs.accessSync(imageCacheFile, fs.constants.F_OK);
			return imageFile;
		} catch (e) {
			handleImageFromObject(response, cacheFile, cacheFilePath);
			return false;
		}
	}
};

const handleImageFromObject = async (response, cacheFile, cacheFilePath) => {
	if (response) {
		const r = response.data;
		if (
			r.finalizedMeta &&
			r.finalizedMeta.image &&
			r.finalizedMeta.image.length
		) {
			let image = "";
			if (Array.isArray(r.finalizedMeta.image)) {
				image = r.finalizedMeta.image[0];
			} else {
				image = r.finalizedMeta.image;
			}
			console.log("Image found ", image);
			const imageFileNameArray = image.split("/");
			const imageFileName =
				imageFileNameArray[imageFileNameArray.length - 1];
			const imageFile = imageFileName.split("?")[0];
			console.log(
				"Image file pieces",
				imageFileNameArray,
				imageFileName,
				imageFile
			);
			const fileObj = cacheFilePath(
				"images/" + cacheFile + "/",
				imageFile,
				true
			);
			const imageCacheFolder = fileObj.cacheFolder;
			const imageCacheFile = fileObj.cacheFile;
			console.log(
				"File Path Generation",
				imageCacheFolder,
				imageCacheFile
			);
			try {
				fs.accessSync(imageCacheFile, fs.constants.F_OK);
				return imageFile;
			} catch (e) {
				fs.mkdirSync(imageCacheFolder, {
					recursive: true,
				});
				console.log("Writing Image to ", imageCacheFile);
				console.log("Image file being written: ", image);
				const imageFile = await getImageAndWriteLocally(
					image,
					imageCacheFile
				);
				return imageFile;
			}
		} else {
			return false;
		}
	}
};

const getImageAndWriteLocally = async (url, imageCacheFile) => {
	const responseImage = await fetchUrl(url);
	const buffer = await responseImage.buffer();
	fs.writeFileSync(imageCacheFile, buffer);
	return imageCacheFile;
};

module.exports = { imageCheck, handleImageFromObject };
