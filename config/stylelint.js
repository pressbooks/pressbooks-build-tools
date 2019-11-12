
module.exports = {
	extends: [
		'stylelint-config-recommended-scss',
		'./node_modules/prettier-stylelint/config.js',
	],
	rules: {
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'/(top|right|left|bottom|page)(:|-)*(w)*(-)*(w)*/',
					'footnotes',
				],
			},
		],
		'media-feature-name-no-unknown': [
			true,
			{ ignoreMediaFeatureNames: [ 'min--moz-device-pixel-ratio' ] },
		],
		'media-query-list-comma-space-after': 'always-single-line',
		'property-no-unknown': [
			true,
			{
				ignoreProperties: [
					'footnote-style-position',
					'hyphenate-before',
					'hyphenate-after',
					'hyphenate-lines',
					'margin-inside',
					'margin-outside',
					'prince-bookmark-level',
					'prince-footnote-policy',
					'prince-image-resolution',
					'prince-page-group',
				],
			},
		],
		'selector-pseudo-element-no-unknown': [
			true,
			{ ignorePseudoElements: [ 'footnote-call' ] },
		],
	},
};
