"use strict";

/**
const Plugin = require("../markdown-it-regexp");

module.exports = Plugin(/s11tys/g, (match, utils) => {
	console.log("Markdown It shorthand match", match);
	return String(` Eleventy `);
});
 */

const isInline = (token) => token && token.type === "inline";
const isParagraph = (token) => token && token.type === "paragraph_open";
const hasMyWords = (token) => token && / 11ty | prob /.test(token.content);

function setAttr(token, name, value) {
	const index = token.attrIndex(name);
	const attr = [name, value];

	if (index < 0) {
		token.attrPush(attr);
	} else {
		token.attrs[index] = attr;
	}
}

function isMyWords(tokens, index) {
	return (
		isInline(tokens[index]) &&
		// isParagraph(tokens[index - 1]) &&
		hasMyWords(tokens[index])
	);
}

function fixMyWords(token, TokenConstructor) {
	let wordChoice = "";
	const betterWord = new TokenConstructor("inline", "", 0);
	if (/ 11ty /.test(token.content)) {
		betterWord.content = " Eleventy ";
		wordChoice = " 11ty ";
	} else if (/ prob /.test(token.content)) {
		betterWord.content = " probably ";
		wordChoice = " prob ";
	}

	return { betterWord, wordChoice };
}

function fixWordify(token, TokenConstructor) {
	const { betterWord, wordChoice } = fixMyWords(token, TokenConstructor);
	// token.children.unshift(betterWord);

	//const sliceIndex = wordChoice.length;
	token.content = token.content.replace(wordChoice, betterWord.content);
	const fixedContent = new TokenConstructor("inline", "", 0);
	fixedContent.content = token.content;
	// token.children[0].content = token.children[0].content.replace(
	//	wordChoice,
	//	betterWord.content
	// );
	token.children[0].content = fixedContent;
}

module.exports = (md) => {
	md.core.ruler.after("inline", "evernote-todo", (state) => {
		const tokens = state.tokens;
		console.log(
			"Walking through possible words to fix3",
			state.tokens.filter((token) => token.type === "text")
		);
		for (let i = 0; i < tokens.length; i++) {
			if (isMyWords(tokens, i)) {
				console.log("Trying to fix some words!");
				fixWordify(tokens[i], state.Token);
				setAttr(tokens[i - 1], "data-wordfix", "true");
			}
		}
	});
};

/**
module.exports = (markdownSetup) => {
	var defaultRender =
		markdownSetup.renderer.rules.fix_my_words ||
		function (tokens, idx, options, env, self) {
			return self.renderToken(tokens, idx, options);
		};
	markdownSetup.renderer.rules.fix_my_words = function (
		tokens,
		idx,
		options,
		env,
		self
	) {
		for (let i = 0; i < tokens.length; i++) {
			if (isMyWords(tokens, i)) {
				console.log("Trying to fix some words!");
				fixWordify(tokens[i], tokens);
				setAttr(tokens[i - 1], "data-wordfix", "true");
			}
		}

		// pass token to default renderer.
		return defaultRender(tokens, idx, options, env, self);
	};
};
*/
