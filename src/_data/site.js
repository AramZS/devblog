module.exports = (info) => {
	return {
		lang: "en-US",
		github: {
			build_revision: process.env.MY_GITHUB_RUN_ID || 1.0,
			build_sha: process.env.GITHUB_SHA || 1,
		},
		site_url: process.env.DOMAIN,
		site_name: "Fight With Tools: A Dev Blog"
	};
};
