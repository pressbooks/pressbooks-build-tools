module.exports = {
	extends: [
		'stylelint-config-standard-scss',
		'stylelint-config-prettier',
	],
	rules: {
		'scss/comment-no-empty': null,
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
		'selector-class-pattern': null,
		'selector-pseudo-element-no-unknown': [
			true,
			{ ignorePseudoElements: [ 'footnote-call' ] },
		],
		'no-descending-specificity': null,
	},
};
