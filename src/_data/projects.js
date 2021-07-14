const { readdirSync } = require('fs');

const getDirectories = source =>
readdirSync(source, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

console.log(getDirectories('src/posts/projects/'));

module.exports = getDirectories('src/posts/projects/');
