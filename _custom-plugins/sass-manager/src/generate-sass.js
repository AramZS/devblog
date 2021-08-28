var sass = require("sass");
var fs = require("fs");
var path = require("path");

const handleSassResult = (resultOfRenderSync, domain, filename) => {
	const result = resultOfRenderSync;
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
	var writeResult = fs.writeFileSync(
		`./docs/assets/css/${filename}.css`,
		fullCSS
	);
	var writeMapResult = fs.writeFileSync(
		`./docs/assets/css/${filename}.css.map`,
		fullMap
	);
	console.log(
		"Sass file write result",
		writeResult,
		"Sass map write result",
		writeMapResult
	);
};

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
	const sassTemplateFiles = fs.readdirSync(path.resolve(`./src/_sass`));
	const templateFiles = sassTemplateFiles.filter((sassFile) => {
		console.log("sassFile", sassFile);
		var sassName = sassFile;
		if (sassName.includes("template-")) {
			console.log("Sass File ");
			return true;
		} else {
			return false;
		}
	});
	templateFiles.forEach((file) => {
		var templateOutFile =
			"/assets/css/" + path.basename(file, ".sass").substring(1) + ".css";
		console.log("Sass Outfile: ", templateOutFile);
		var templateResult = sass.renderSync({
			includePaths: [
				"src/_sass/*.{scss,sass}",
				"**/*.{scss,sass}",
				"!node_modules/**",
			],
			file: "src/_sass/" + file,
			outputStyle: "compressed",
			//sourceMap: `${domain}/assets/css/style.css.map`,
			sourceMap: true,
			sourceMapContents: true,
			outFile: path.join(process.cwd(), path.basename(templateOutFile)),
			// outFile: `${domain}/assets/css/style.css`,
			// sourceMapRoot: `${domain}/assets/css/`,
		});
		handleSassResult(templateResult, domain, path.basename(file, ".sass"));
	});
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
	handleSassResult(result, domain, "style");
	return result;
};
