
module.exports = {
	extends: '@humanmade/eslint-config',
	globals: {
		jQuery: true,
		wp: true,
	},
	settings: {
		react: {
			version: '999.999.999',
		},
	},
	rules: {
		'jsx-a11y/href-no-hash': 0,
	},
};
