import { resolve } from 'path';

import { createViteConfig } from './config/vite.config.base.js';

export default createViteConfig( {
	input: {
		test: resolve( process.cwd(), 'assets/src/scripts/test.js' ),
		'test-styles': resolve( process.cwd(), 'assets/src/styles/test.scss' ),
	},
} );
