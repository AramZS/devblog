const { readdirSync, readFileSync } = require("fs");
const path = require("path");
const matter = require("gray-matter");

const getDirectories = (source) =>
	readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

const directorySet = getDirectories("src/posts/projects/").map((projectDir) => {
	const projectsPath = path.resolve(`./src/posts/projects/${projectDir}`);
	const projectData = require(projectsPath + `/${projectDir}.json`);
	const projectTitle =
		projectDir.charAt(0).toUpperCase() + projectDir.slice(1);
	const projectFiles = readdirSync(projectsPath);
	let lastUpdated = 0;
	const projectFilesContent = projectFiles.map((filePath) => {
		return readFileSync(
			path.resolve(`./src/posts/projects/${projectDir}/${filePath}`)
		).toString();
	});
	// console.log("project files", projectFilesContent);
	let daysWorked = 0;
	lastUpdated = projectFilesContent.reduce((prevValue, fileContent) => {
		try {
			const mdObject = matter(fileContent);
			//console.log("project data", mdObject.data);
			if (!mdObject.data || !mdObject.data.date) {
				return 0;
			}
			if (mdObject.data.tags.includes("WiP")) {
				++daysWorked;
			}
			const datetime = Date.parse(mdObject.data.date);
			if (prevValue > datetime) {
				return prevValue;
			} else {
				return datetime;
			}
		} catch (e) {
			console.log("Could not find date", e);
			return 0;
		}
	}, 0);
	return {
		title: projectTitle,
		slug: projectDir,
		projectName: projectData.project ? projectData.project : projectTitle,
		description: projectData.description
			? projectData.description
			: `Building ${projectTitle}`,
		url: (function () {
			return process.env.DOMAIN + "/projects/" + projectDir;
		})(),
		count: projectFiles.length - 1, // minus one for the project description json file.
		daysWorked: daysWorked,
		complete: projectData.complete ? projectData.complete : "In-progress",
		lastUpdatedPost: lastUpdated,
	};
});

directorySet.sort((a, b) => b.lastUpdatedPost - a.lastUpdatedPost);

console.log(directorySet);

module.exports = directorySet;
