var sass = require("sass");
var fs = require("fs");
var path = require("path");

module.exports = (domain) => {
	console.log(
		"Generate Sass with domain",
		domain,
		"target file",
		`${domain}/assets/css/style.css`,
		"cwd",
		process.cwd()
	);
	const outFile = "/assets/css/style.css";
	var result = sass.renderSync({
		includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
		file: "src/_sass/_index.sass",
		importer: function (url, prev, done) {
			// ...
		},
		outputStyle: "compressed",
		//sourceMap: `${domain}/assets/css/style.css.map`,
		sourceMap: true,
		sourceMapContents: true,
		outFile: path.join(process.cwd(), path.basename(outFile)),
		// outFile: `${domain}/assets/css/style.css`,
		// sourceMapRoot: `${domain}/assets/css/`,
	});
	console.log("Sass renderSync result", result);
	var fullCSS = result.css.toString();
	var map = JSON.parse(result.map);
	map.sourceRoot = domain;
	var newSources = map.sources.map((source) => {
		return "sass/" + source;
	});
	map.sources = newSources;
	result.map = JSON.stringify(map, null, "\t");
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
