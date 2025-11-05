import { resolve } from 'path';

import { createWpViteConfig } from 'pressbooks-build-tools/vite-wp';

/**
 * Example Vite configuration for a WordPress plugin
 *
 * This example demonstrates how to use pressbooks-build-tools
 * to configure Vite for a WordPress plugin with multiple entry points.
 */
export default createWpViteConfig( {
	// Define your JavaScript and CSS entry points
	input: {
		// Main plugin JavaScript
		'plugin-admin': resolve( process.cwd(), 'assets/src/scripts/admin.js' ),
		'plugin-public': resolve( process.cwd(), 'assets/src/scripts/public.js' ),

		// Plugin styles
		'plugin-admin-styles': resolve( process.cwd(), 'assets/src/styles/admin.scss' ),
		'plugin-public-styles': resolve( process.cwd(), 'assets/src/styles/public.scss' ),
	},

	// Output directory (relative to your plugin root)
	outDir: 'dist',

	// Development server configuration
	port: 3100,
	host: 'localhost',

	// Proxy configuration for WordPress development
	// Adjust the target to match your local WordPress URL
	proxy: {
		'/wp-admin': {
			target: 'https://your-site.test',
			changeOrigin: true,
			secure: false,
		},
		'/wp-login.php': {
			target: 'https://your-site.test',
			changeOrigin: true,
			secure: false,
		},
	},

	// Files to watch for live reload (default: **/*.php, templates/**/*.php)
	liveReloadPaths: [
		'**/*.php',
		'templates/**/*.php',
		'includes/**/*.php',
	],

	// Optional: Enable Tailwind CSS
	// useTailwind: true,
	// tailwindcss: (await import('tailwindcss')).default,

	// Optional: Add custom PostCSS plugins
	// postcssPlugins: [
	// 	(await import('postcss-nested')).default,
	// ],

	// Optional: Add custom Vite plugins
	// plugins: [
	// 	// your custom plugins here
	// ],
} );
