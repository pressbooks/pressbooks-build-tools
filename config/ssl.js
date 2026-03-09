import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const CERT_DIR = path.join( os.homedir(), '.local', 'share', 'pressbooks-build-tools', 'certs' );
const KEY_FILE = path.join( CERT_DIR, 'localhost-key.pem' );
const CERT_FILE = path.join( CERT_DIR, 'localhost.pem' );

/**
 * Checks if mkcert is installed and available in the system PATH.
 * @returns {boolean} True if mkcert is available
 */
function hasMkcert() {
	try {
		execSync( 'mkcert --version', { stdio: 'ignore' } );
		return true;
	} catch {
		return false;
	}
}

/**
 * Checks if the mkcert root CA has been installed in the system trust store.
 * @returns {boolean} True if the CA root certificate exists
 */
function isCaInstalled() {
	try {
		const caRoot = execSync( 'mkcert -CAROOT', { encoding: 'utf-8' } ).trim();
		return fs.existsSync( path.join( caRoot, 'rootCA.pem' ) );
	} catch {
		return false;
	}
}

/**
 * Checks if certificate files already exist and are not expired.
 * Certificates are considered valid for 30 days.
 * @returns {boolean} True if valid certificates exist
 */
function certsExist() {
	if ( ! fs.existsSync( KEY_FILE ) || ! fs.existsSync( CERT_FILE ) ) {
		return false;
	}
	// Check if cert is older than 30 days
	const stats = fs.statSync( CERT_FILE );
	const ageMs = Date.now() - stats.mtimeMs;
	const thirtyDays = 30 * 24 * 60 * 60 * 1000;
	return ageMs < thirtyDays;
}

/**
 * Generates trusted SSL certificates for localhost using mkcert.
 * Creates certificates in ~/.local/share/pressbooks-build-tools/certs/.
 * Requires mkcert to be installed and its CA root to be set up.
 * @returns {boolean} True if certificates were successfully generated
 */
function generateCerts() {
	try {
		fs.mkdirSync( CERT_DIR, { recursive: true } );
		execSync(
			`mkcert -key-file "${ KEY_FILE }" -cert-file "${ CERT_FILE }" localhost 127.0.0.1 ::1`,
			{ stdio: 'pipe' }
		);
		return true;
	} catch ( err ) {
		console.warn( '[pressbooks-build-tools] Failed to generate mkcert certificates:', err.message );
		return false;
	}
}

/**
 * Prints a boxed warning message to the console for visibility.
 * @param {string[]} lines - Array of message lines to display
 */
function printWarning( lines ) {
	const maxLen = Math.max( ...lines.map( l => l.length ) );
	const border = '─'.repeat( maxLen + 2 );
	console.warn( '' );
	console.warn( `  ┌${ border }┐` );
	for ( const line of lines ) {
		console.warn( `  │ ${ line.padEnd( maxLen ) } │` );
	}
	console.warn( `  └${ border }┘` );
	console.warn( '' );
}

/**
 * Returns the HTTPS configuration for Vite's server.https option.
 * Attempts to use mkcert for locally-trusted certificates. If mkcert is not
 * available or its CA is not installed, falls back to true (Vite's default
 * self-signed cert) and prints setup instructions.
 *
 * Using mkcert-generated certificates is important for development with tunneling
 * services (e.g., ngrok) because browsers reject self-signed certificates for
 * cross-origin subresource requests from public origins.
 * @returns {object|boolean} An object with key/cert buffers for mkcert certs,
 *                           or true to use Vite's default self-signed cert
 */
export function getHttpsConfig() {
	if ( ! hasMkcert() ) {
		printWarning( [
			'mkcert not found — using a self-signed certificate.',
			'',
			'Browsers will show certificate warnings, and tunneling',
			'services (ngrok, Cloudflare Tunnel, etc.) will not work.',
			'',
			'To fix this, run once:',
			'',
			'  brew install mkcert   # or: apt install mkcert',
			'  mkcert -install',
			'',
			'Then restart the dev server.',
		] );
		return true;
	}

	if ( ! isCaInstalled() ) {
		printWarning( [
			'mkcert is installed but its CA is not trusted yet.',
			'',
			'To fix this, run once:',
			'',
			'  mkcert -install',
			'',
			'Then restart the dev server.',
		] );
		return true;
	}

	if ( ! certsExist() ) {
		console.log( '[pressbooks-build-tools] Generating trusted SSL certificates with mkcert...' );
		if ( ! generateCerts() ) {
			printWarning( [
				'Failed to generate certificates with mkcert.',
				'Falling back to a self-signed certificate.',
				'',
				'Try running manually:',
				`  mkcert -key-file "${ KEY_FILE }" -cert-file "${ CERT_FILE }" localhost 127.0.0.1 ::1`,
			] );
			return true;
		}
		console.log( '[pressbooks-build-tools] Trusted SSL certificates ready.' );
	}

	return {
		key: fs.readFileSync( KEY_FILE ),
		cert: fs.readFileSync( CERT_FILE ),
	};
}

/**
 * Creates a Vite plugin that adds Private Network Access (PNA) headers.
 * This is required when the dev server (localhost) is accessed from an external
 * origin such as ngrok or other tunneling services. Chrome's PNA spec requires
 * the server to respond with Access-Control-Allow-Private-Network: true on
 * preflight requests from public origins targeting local network resources.
 * @returns {object} Vite plugin object
 */
export function privateNetworkAccessPlugin() {
	return {
		name: 'private-network-access',
		/**
		 *
		 * @param server
		 */
		configureServer( server ) {
			server.middlewares.use( ( req, res, next ) => {
				// Set CORS headers on all responses
				res.setHeader( 'Access-Control-Allow-Origin', '*' );
				res.setHeader( 'Access-Control-Allow-Methods', 'GET, OPTIONS' );
				res.setHeader( 'Access-Control-Allow-Headers', '*' );

				// Handle Private Network Access preflight
				if ( req.headers[ 'access-control-request-private-network' ] ) {
					res.setHeader( 'Access-Control-Allow-Private-Network', 'true' );
				}

				// Respond to preflight requests immediately
				if ( req.method === 'OPTIONS' ) {
					res.statusCode = 204;
					res.end();
					return;
				}

				next();
			} );
		},
	};
}
