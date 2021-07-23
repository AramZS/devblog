const { readdirSync } = require('fs');
const path = require('path')

const getDirectories = source =>
readdirSync(source, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

const directorySet = getDirectories('src/posts/projects/').map(
	(projectDir) => {
		const projectsPath = path.resolve(`./src/posts/projects/${projectDir}`)
		const projectData = require(projectsPath + `/${projectDir}.json`);
		const projectTitle = projectDir.charAt(0).toUpperCase() + projectDir.slice(1);
		const projectFiles = readdirSync(projectsPath);
		return {
			title: projectTitle,
			slug: projectDir,
			projectName: projectData.project ? projectData.project : projectTitle,
			description: projectData.description ? projectData.description : `Building ${projectTitle}`,
			url: (function(){ return process.env.DOMAIN + "/projects/" + projectDir })(),
			count: projectFiles.length - 1, // minus one for the project description json file.
			complete: projectData.complete ? projectData.complete : 'In-progress'
		}
	}
);


console.log(getDirectories('src/posts/projects/'));

module.exports = directorySet;
