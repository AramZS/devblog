"use strict";

module.exports = (md) => {
	md.core.ruler.push('git_skiplink', state => {
		const tokens = state.tokens;
		// console.log('look for code blocks')
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].type == "fence" && tokens[i].tag == "code"){
				console.log(tokens[i-1], tokens[i], tokens[i+1])
			}
		}
	});
};
