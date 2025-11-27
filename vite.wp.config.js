import tailwindcss from 'tailwindcss';

import { createWpViteConfig } from './config/vite.config.wp.js';

export default createWpViteConfig( {
	input: {},
	outDir: 'dist',
	useTailwind: true,
	tailwindcss,
} );
