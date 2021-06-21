module.exports = (info) => {
	console.log("Global data input", info);
	return {
		lang: "en-US",
		github: {
			build_revision: 1.0,
		},
		site_url: process.env.DOMAIN,
	};
};
