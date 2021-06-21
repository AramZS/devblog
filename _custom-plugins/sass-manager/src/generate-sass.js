var sass = require("sass");
var fs = require("fs");

module.exports = () => {
	var result = sass.renderSync({
		includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
		file: "src/_sass/_index.sass",
		importer: function (url, prev, done) {
			// ...
		},
		outputStyle: "compressed",
		sourceMap: process.env.DOMAIN + "/assets/css/style.css.map",
		outFile: process.env.DOMAIN + "/assets/css/style.css",
	});
	console.log("Sass renderSync result", result);
	var fullCSS = result.css.toString();
	var fullMap = result.map.toString();
	if (!fs.existsSync("./docs")) {
		fs.mkdirSync("./docs");
	}
	if (!fs.existsSync("./docs/assets")) {
		fs.mkdirSync("./docs/assets");
	}
	if (!fs.existsSync("./docs/assets/css")) {
		fs.mkdirSync("./docs/assets/css");
	}
	var writeResult = fs.writeFileSync("./docs/assets/css/style.css", fullCSS);
	var writeMapResult = fs.writeFileSync(
		"./docs/assets/css/style.css.map",
		fullMap
	);
	console.log(
		"Sass file write result",
		writeResult,
		"Sass map write result",
		writeMapResult
	);
	return result;
};
