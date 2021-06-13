var sass = require("sass");

module.exports = () => {
	return sass.renderSync(
		{
			includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
			importer: function (url, prev, done) {
				// ...
			},
			sourceMap: true,
			outFile: "./docs/styles/style.css",
		},
		function (err, result) {
			// ...
		}
	);
};
