module.exports = (info) => {
	return {
		lang: "en-US",
		github: {
			build_revision: process.env.MY_GITHUB_RUN_ID || 1.0,
			build_sha: process.env.GITHUB_SHA || 1,
		},
		site_url: process.env.DOMAIN,
		site_name: "Fight With Tools: A Dev Blog",
		description: "A site opening up my development process to all.",
		featuredImage: "nyc_noir.jpg",
		aramPhoto:
			"https://raw.githubusercontent.com/AramZS/aramzs.github.io/master/_includes/Aram-Zucker-Scharff-square.jpg",
	};
};
