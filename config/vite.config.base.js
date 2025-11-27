import path from 'path';

import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import liveReload from 'vite-plugin-live-reload';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/**
 * Creates a Vite configuration with Pressbooks-specific defaults
 * @param {object} options - Configuration options
 * @param {object} [options.input] - Vite input configuration for entry points
 * @param {string} [options.outDir] - Output directory for built assets
 * @param {number} [options.port] - Development server port
 * @param {string} [options.host] - Development server host
 * @param {object} [options.proxy] - Development server proxy configuration
 * @param {Array} [options.copyTargets] - Array of files/directories to copy during build
 * @param {Array} [options.plugins] - Additional Vite plugins to include
 * @param {object} [options.config] - Additional Vite configuration to merge
 * @returns {object} Vite configuration object
 */
export function createViteConfig( options = {} ) {
	const plugins = [
		legacy( {
			targets: [ 'defaults', 'not IE 11' ],
		} ),
		liveReload( [
			'**/*.php',
			'templates/**/*.php',
		] ),
	];

	// Add static copy plugin if copyTargets are provided
	if ( options.copyTargets && options.copyTargets.length > 0 ) {
		plugins.push( viteStaticCopy( {
			targets: options.copyTargets,
		} ) );
	}

	// Add any additional plugins
	if ( options.plugins ) {
		plugins.push( ...options.plugins );
	}

	return defineConfig( {
		plugins,
		build: {
			outDir: options.outDir || 'assets/dist',
			rollupOptions: {
				input: options.input || {},
				output: {
					entryFileNames: 'scripts/[name].js',
					chunkFileNames: 'scripts/[name]-[hash].js',
					/**
					 * Determines the output filename for assets based on file type
					 * @param {object} assetInfo - Asset information object from Rollup
					 * @param {string} assetInfo.name - Name of the asset file
					 * @returns {string} Output path for the asset
					 */
					assetFileNames: assetInfo => {
						if ( assetInfo.name.endsWith( '.css' ) ) {
							return 'styles/[name][extname]';
						}
						return 'assets/[name]-[hash][extname]';
					},
				},
			},
			manifest: true,
			sourcemap: true,
			emptyOutDir: true,
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
					importers: [
						{
							/**
							 * Resolves webpack-style tilde (~) imports to node_modules paths
							 * @param {string} url - The import URL to resolve
							 * @returns {URL|null} File URL for tilde imports, null otherwise
							 */
							findFileUrl( url ) {
								// Handle webpack-style ~ imports for node_modules
								if ( url.startsWith( '~' ) ) {
									const modulePath = url.substring( 1 );
									const fullPath = path.resolve( process.cwd(), 'node_modules', modulePath );
									return new URL( `file://${ fullPath }` );
								}
								return null;
							},
						},
					],
				},
			},
		},
		server: {
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
