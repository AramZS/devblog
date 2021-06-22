module.exports = (info) => {
	return {
		lang: "en-US",
		github: {
			build_revision: process.env.GITHUB_HEAD_SHA || 1.0,
			job_id: process.env.github ? process.env.github.job : 1,
			other_job_id: process.env.GITHUB_JOB || 1,
		},
		site_url: process.env.DOMAIN,
	};
};
