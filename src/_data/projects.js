const { readdirSync } = require('fs');
const path = require('path')

const getDirectories = source =>
readdirSync(source, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

const directorySet = getDirectories('src/posts/projects/').map(
	(projectDir) => {
		return {
			title: projectDir.charAt(0).toUpperCase() + projectDir.slice(1),
			slug: projectDir,
			projectName: require(path.resolve(`./src/posts/projects/${projectDir}/${projectDir}.json`)).project
		}
	}
);


console.log(getDirectories('src/posts/projects/'));

module.exports = directorySet;
