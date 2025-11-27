import { resolve } from 'path';

import { createWpViteConfig } from 'pressbooks-build-tools/vite-wp';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/**
 * Example Vite configuration for a WordPress theme
 *
 * This configuration is based on the pressbooks-book theme webpack.mix.js
 * and demonstrates how to port a Laravel Mix configuration to Vite.
 *
 * Original webpack.mix.js:
 * https://github.com/pressbooks/pressbooks-book/blob/dev/webpack.mix.js
 */
export default createWpViteConfig( {
	// Define entry points for scripts and styles
	input: {
		// Main theme scripts
		book: resolve( process.cwd(), 'assets/src/scripts/book.js' ),
		pane: resolve( process.cwd(), 'assets/src/scripts/pane.js' ),
		'collapse-sections': resolve( process.cwd(), 'assets/src/scripts/collapse-sections.js' ),
		lightbox: resolve( process.cwd(), 'assets/src/scripts/lightbox.js' ),

		// Vendor scripts from node_modules
		sharer: resolve( process.cwd(), 'node_modules/sharer.js/sharer.js' ),
		lity: resolve( process.cwd(), 'node_modules/lity/dist/lity.js' ),
		'details-element-polyfill': resolve( process.cwd(), 'node_modules/details-element-polyfill/dist/details-element-polyfill.js' ),

		// Theme styles
		'book-styles': resolve( process.cwd(), 'assets/src/styles/book.scss' ),
		'web-house-style': resolve( process.cwd(), 'assets/legacy/styles/web-house-style.scss' ),
	},

	// Output directory
	outDir: 'dist',

	// Development server configuration
	port: 3200,
	host: 'localhost',

	// Proxy configuration for WordPress development
	// Update this to match your local WordPress site
	proxy: {
		'/': {
			target: 'https://pressbooks.test',
			changeOrigin: true,
			secure: false,
		},
	},

	// Files to watch for live reload
	liveReloadPaths: [
		'**/*.php',
		'templates/**/*.php',
	],

	// Additional Vite plugins
	plugins: [
		// Copy static assets (equivalent to webpack mix.copy and mix.copyDirectory)
		viteStaticCopy( {
			targets: [
				// Copy lity CSS file
				{
					src: 'node_modules/lity/dist/lity.css',
					dest: 'styles',
				},
				// Copy images directory
				{
					src: 'assets/src/images',
					dest: 'images',
				},
			],
		} ),
	],

	// Additional Vite configuration
	config: {
		build: {
			// Enable asset versioning (equivalent to mix.version())
			manifest: true,
		},
	},
} );
