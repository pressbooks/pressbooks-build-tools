import { v4wp } from '@kucrut/vite-for-wp';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import liveReload from 'vite-plugin-live-reload';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { getHttpsConfig, privateNetworkAccessPlugin } from './ssl.js';

/**
 * Creates a WordPress-specific Vite configuration using @kucrut/vite-for-wp
 * This configuration is optimized for WordPress plugins and themes
 * @param {object} options - Configuration options
 * @param {object} [options.input] - Vite input configuration for entry points
 * @param {string} [options.outDir] - Output directory for built assets
 * @param {number} [options.port] - Development server port
 * @param {string} [options.host] - Development server host
 * @param {object} [options.proxy] - Development server proxy configuration
 * @param {Array} [options.liveReloadPaths] - Array of file patterns to watch for live reload
 * @param {boolean} [options.useTailwind] - Whether to include Tailwind CSS
 * @param {Array} [options.postcssPlugins] - Additional PostCSS plugins
 * @param {Array} [options.plugins] - Additional Vite plugins to include
 * @param {boolean} [options.https] - Whether to enable HTTPS with basic SSL (defaults to true)
 * @param {object} [options.config] - Additional Vite configuration to merge
 * @returns {object} Vite configuration object
 */
export function createWpViteConfig( options = {} ) {
	const useHttps = options.https !== false;
	const postcssPlugins = [ autoprefixer ];

	// Add Tailwind if requested
	if ( options.useTailwind ) {
		// Dynamic import handled by consumer
		postcssPlugins.unshift( options.tailwindcss );
	}

	// Add any additional PostCSS plugins
	if ( options.postcssPlugins ) {
		postcssPlugins.push( ...options.postcssPlugins );
	}

	const plugins = [
		v4wp( {
			input: options.input || {},
			outDir: options.outDir || 'dist',
		} ),
		liveReload(
			options.liveReloadPaths || [
				'**/*.php',
				'templates/**/*.php',
			]
		),
		viteStaticCopy( {
			targets: options.copyTargets || [],
		} ),
		privateNetworkAccessPlugin(),
	];

	// Add any additional plugins
	if ( options.plugins ) {
		plugins.push( ...options.plugins );
	}

	return defineConfig( {
		plugins,
		css: {
			postcss: {
				plugins: postcssPlugins,
			},
		},
		server: {
			https: useHttps ? getHttpsConfig() : false,
			cors: false, // Handled by privateNetworkAccessPlugin for PNA support
			proxy: options.proxy || {
				// Default proxy for WordPress development
				'/wp-admin': {
					target: 'https://pressbooks.test',
					changeOrigin: true,
					secure: false,
				},
				'/wp-login.php': {
					target: 'https://pressbooks.test',
					changeOrigin: true,
					secure: false,
				},
			},
			port: options.port || 3100,
			host: options.host || 'localhost',
		},
		...options.config,
	} );
}
