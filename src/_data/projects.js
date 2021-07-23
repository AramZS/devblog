const { readdirSync } = require('fs');
const path = require('path')

const getDirectories = source =>
readdirSync(source, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

const directorySet = getDirectories('src/posts/projects/').map(
	(projectDir) => {
		const projectData = require(path.resolve(`./src/posts/projects/${projectDir}/${projectDir}.json`));
		const projectTitle = projectDir.charAt(0).toUpperCase() + projectDir.slice(1);
		return {
			title: projectTitle,
			slug: projectDir,
			projectName: projectData.project ? projectData.project : projectTitle,
			description: projectData.description ? projectData.description : `Building ${projectData.title}`
		}
	}
);


console.log(getDirectories('src/posts/projects/'));

module.exports = directorySet;
