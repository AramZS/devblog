'use strict'

const Plugin = require('markdown-it-regexp')

module.exports = Plugin(
    /\s(prob)\s/gm,
    (match, utils) => {
		console.log('Markdown It shorthand match', match)
		return String(`probably`)
    }
  )
