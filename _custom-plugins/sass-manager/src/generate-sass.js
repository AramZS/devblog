var sass = require("sass");
var fs = require("fs");

module.exports = () => {
	var result = sass.renderSync({
		includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
		file: "_sass/_index.sass",
		importer: function (url, prev, done) {
			// ...
		},
		sourceMap: true,
		outFile: "docs/styles/style.css",
	});
	console.log("Sass renderSync result", result);
	var fullCSS = result.css.toString();
	if (!fs.existsSync("./docs")) {
		fs.mkdirSync("./docs");
	}
	if (!fs.existsSync("./docs/styles")) {
		fs.mkdirSync("./docs/styles");
	}
	var writeResult = fs.writeFileSync("./docs/styles/style.css", fullCSS);
	console.log("Sass file write result", writeResult);
	return result;
};
