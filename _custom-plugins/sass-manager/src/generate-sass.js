var sass = require("sass");
var fs = require("fs");

module.exports = () => {
	var result = sass.renderSync({
		includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
		file: "src/_sass/_index.sass",
		importer: function (url, prev, done) {
			// ...
		},
		sourceMap: true,
		outFile: "docs/assets/css/style.css",
	});
	console.log("Sass renderSync result", result);
	var fullCSS = result.css.toString();
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
	console.log("Sass file write result", writeResult);
	return result;
};
