#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const command = process.argv[2];
const args = process.argv.slice( 3 );

const validCommands = [ 'build', 'dev', 'preview', 'lint', 'fix', 'test' ];

if ( ! command || ! validCommands.includes( command ) ) {
	console.log( 'Usage: pressbooks-build-tools <command>' );
	console.log( '' );
	console.log( 'Available commands:' );
	console.log( '  build    - Build assets for production using Vite' );
	console.log( '  dev      - Start Vite development server with hot reload' );
	console.log( '  preview  - Preview production build locally' );
	console.log( '  lint     - Run all linting tasks (scripts and styles)' );
	console.log( '  fix      - Auto-fix ESLint issues in JavaScript files' );
	console.log( '  test     - Run linting and build tasks' );
	process.exit( 1 );
}

// Check that we're in a valid project directory
const consumerPackageJsonPath = path.join( process.cwd(), 'package.json' );
if ( ! fs.existsSync( consumerPackageJsonPath ) ) {
	console.error( `Error: No package.json found in ${ process.cwd() }` );
	console.error( 'Make sure you are running this command from a directory with a package.json file' );
	process.exit( 1 );
}

// Get the path to the build tools directory
const buildToolsDir = path.dirname( path.dirname( import.meta.url.replace( 'file://', '' ) ) );

// Run the actual command directly to avoid circular npm script calls
let execCommand, execArgs;

switch ( command ) {
	case 'build':
		execCommand = path.join( buildToolsDir, 'node_modules', '.bin', 'vite' );
		execArgs = [ 'build', ...args ];
		break;
	case 'dev':
		execCommand = path.join( buildToolsDir, 'node_modules', '.bin', 'vite' );
		execArgs = [ ...args ];
		break;
	case 'preview':
		execCommand = path.join( buildToolsDir, 'node_modules', '.bin', 'vite' );
		execArgs = [ 'preview', ...args ];
		break;
	case 'lint':
		execCommand = path.join( buildToolsDir, 'node_modules', '.bin', 'run-s' );
		execArgs = [ 'lint:*', ...args ];
		break;
	case 'fix':
		execCommand = path.join( buildToolsDir, 'node_modules', '.bin', 'eslint' );
		execArgs = [ '--fix', '**/*.js', ...args ];
		break;
	case 'test':
		execCommand = path.join( buildToolsDir, 'node_modules', '.bin', 'run-s' );
		execArgs = [ 'lint:*', 'build', ...args ];
		break;
	default:
		console.error( `Error: Unknown command "${ command }"` );
		process.exit( 1 );
}

const child = spawn( execCommand, execArgs, {
	cwd: process.cwd(),
	stdio: 'inherit',
} );

child.on( 'close', code => {
	process.exit( code );
} );

child.on( 'error', err => {
	console.error( 'Error running command:', err );
	process.exit( 1 );
} );
