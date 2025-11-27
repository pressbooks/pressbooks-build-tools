#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const command = process.argv[2];
const args = process.argv.slice( 3 );

const validCommands = [ 'build', 'dev', 'preview', 'lint', 'lint:scripts', 'lint:styles', 'fix', 'fix:scripts', 'fix:styles', 'test' ];

if ( ! command || ! validCommands.includes( command ) ) {
	console.log( 'Usage: pressbooks-build-tools <command>' );
	console.log( '' );
	console.log( 'Available commands:' );
	console.log( '  build        - Build assets for production using Vite' );
	console.log( '  dev          - Start Vite development server with hot reload' );
	console.log( '  preview      - Preview production build locally' );
	console.log( '  lint         - Run all linting tasks (scripts and styles)' );
	console.log( '  lint:scripts - Run ESLint on JavaScript files only' );
	console.log( '  lint:styles  - Run Stylelint on CSS/SCSS files only' );
	console.log( '  fix          - Auto-fix ESLint issues in JavaScript files' );
	console.log( '  fix:scripts  - Auto-fix ESLint issues in JavaScript files' );
	console.log( '  fix:styles   - Auto-fix Stylelint issues in CSS/SCSS files' );
	console.log( '  test         - Run linting and build tasks' );
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
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const buildToolsDir = path.dirname( __dirname );

// Helper function to find executable
/**
 *
 * @param name
 */
function findExecutable( name ) {
	// Try to find in build tools node_modules first
	const buildToolsBin = path.join( buildToolsDir, 'node_modules', '.bin', name );
	if ( fs.existsSync( buildToolsBin ) ) {
		return buildToolsBin;
	}

	// Fallback to npx
	return 'npx';
}

// Main execution function
/**
 *
 */
async function main() {
	// Run the actual command
	let execCommand, execArgs;

	switch ( command ) {
		case 'build':
			execCommand = findExecutable( 'vite' );
			execArgs = execCommand === 'npx' ? [ 'vite', 'build', ...args ] : [ 'build', ...args ];
			break;
		case 'dev':
			execCommand = findExecutable( 'vite' );
			execArgs = execCommand === 'npx' ? [ 'vite', ...args ] : [ ...args ];
			break;
		case 'preview':
			execCommand = findExecutable( 'vite' );
			execArgs = execCommand === 'npx' ? [ 'vite', 'preview', ...args ] : [ 'preview', ...args ];
			break;
		case 'lint':
			// For lint, we need to run multiple tasks, so let's implement it directly
			console.log( 'Running linting tasks...' );
			await runLintTasks( args );
			return;
		case 'lint:scripts':
			console.log( 'Running script linting...' );
			await runScriptLinting( args );
			return;
		case 'lint:styles':
			console.log( 'Running style linting...' );
			await runStyleLinting( args );
			return;
		case 'fix':
		case 'fix:scripts':
			execCommand = findExecutable( 'eslint' );
			
			// Parse file patterns from args, default to common JS patterns if none provided
			const fixPatterns = [];
			const eslintOptions = [];
			
			for ( const arg of args ) {
				if ( arg.includes( '*.js' ) || arg.includes( '*.ts' ) || arg.includes( '*.jsx' ) || arg.includes( '*.tsx' ) ) {
					fixPatterns.push( arg );
				} else {
					eslintOptions.push( arg );
				}
			}
			
			// Default patterns if no JS patterns specified
			const defaultFixPatterns = [ 'assets/src/scripts/**/*.js', 'config/*.js' ];
			const finalFixPatterns = fixPatterns.length > 0 ? fixPatterns : defaultFixPatterns;
			
			execArgs = execCommand === 'npx' 
				? [ 'eslint', '--fix', ...finalFixPatterns, '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...eslintOptions ] 
				: [ '--fix', ...finalFixPatterns, '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...eslintOptions ];
			break;
		case 'fix:styles':
			execCommand = findExecutable( 'stylelint' );
			
			// Parse style patterns from args, default to common style patterns if none provided
			const styleFixPatterns = [];
			const stylelintOptions = [];
			
			for ( const arg of args ) {
				if ( arg.includes( '*.css' ) || arg.includes( '*.scss' ) || arg.includes( '*.sass' ) || arg.includes( '*.less' ) ) {
					styleFixPatterns.push( arg );
				} else {
					stylelintOptions.push( arg );
				}
			}
			
			// Default patterns if no style patterns specified
			const defaultStyleFixPatterns = [ '**/*.scss', '**/*.css' ];
			const finalStyleFixPatterns = styleFixPatterns.length > 0 ? styleFixPatterns : defaultStyleFixPatterns;
			
			execArgs = execCommand === 'npx' 
				? [ 'stylelint', '--fix', ...finalStyleFixPatterns, '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...stylelintOptions ] 
				: [ '--fix', ...finalStyleFixPatterns, '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...stylelintOptions ];
			break;
		case 'test':
			// For test, run lint then build
			console.log( 'Running test tasks...' );
			await runTestTasks( args );
			return;
		default:
			console.error( `Error: Unknown command "${ command }"` );
			process.exit( 1 );
	}

	// Helper function to run a command and return a promise
	/**
	 *
	 * @param cmd
	 * @param cmdArgs
	 * @param description
	 */
	function runCommand( cmd, cmdArgs, description ) {
		return new Promise( ( resolve, reject ) => {
			console.log( `Running: ${ description }` );
			const child = spawn( cmd, cmdArgs, {
				cwd: process.cwd(),
				stdio: 'inherit',
			} );

			child.on( 'close', code => {
				if ( code === 0 ) {
					resolve();
				} else {
					reject( new Error( `Command failed with exit code ${ code }` ) );
				}
			} );

			child.on( 'error', err => {
				reject( err );
			} );
		} );
	}

	// Function to run script linting only
	async function runScriptLinting( args, exitOnComplete = true ) {
		try {
			// Parse arguments to get script patterns
			const scriptPatterns = [];
			const otherArgs = [];
			
			for ( let i = 0; i < args.length; i++ ) {
				const arg = args[ i ];
				if ( arg === '--scripts' && args[ i + 1 ] ) {
					scriptPatterns.push( args[ i + 1 ] );
					i++; // Skip next argument as it's the pattern
				} else if ( arg.includes( '*.js' ) || arg.includes( '*.ts' ) || arg.includes( '*.jsx' ) || arg.includes( '*.tsx' ) ) {
					scriptPatterns.push( arg );
				} else {
					otherArgs.push( arg );
				}
			}
			
			// Default patterns if none provided
			const defaultScriptPatterns = [ 'config/*.js', 'assets/src/scripts/**/*.js' ];
			const finalScriptPatterns = scriptPatterns.length > 0 ? scriptPatterns : defaultScriptPatterns;

			// Lint scripts
			const eslintCmd = findExecutable( 'eslint' );
			const eslintArgs = eslintCmd === 'npx'
				? [ 'eslint', ...finalScriptPatterns, '--ignore-pattern', 'bin/', '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...otherArgs ]
				: [ ...finalScriptPatterns, '--ignore-pattern', 'bin/', '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...otherArgs ];

			await runCommand( eslintCmd, eslintArgs, 'ESLint (scripts)' );

			if ( exitOnComplete ) {
				console.log( 'Script linting completed successfully!' );
				process.exit( 0 );
			}
		} catch ( error ) {
			console.error( 'Script linting failed:', error.message );
			if ( exitOnComplete ) {
				process.exit( 1 );
			}
			throw error;
		}
	}

	// Function to run style linting only
	async function runStyleLinting( args, exitOnComplete = true ) {
		try {
			// Parse arguments to get style patterns
			const stylePatterns = [];
			const otherArgs = [];
			
			for ( let i = 0; i < args.length; i++ ) {
				const arg = args[ i ];
				if ( arg === '--styles' && args[ i + 1 ] ) {
					stylePatterns.push( args[ i + 1 ] );
					i++; // Skip next argument as it's the pattern
				} else if ( arg.includes( '*.scss' ) || arg.includes( '*.css' ) || arg.includes( '*.sass' ) || arg.includes( '*.less' ) ) {
					stylePatterns.push( arg );
				} else {
					otherArgs.push( arg );
				}
			}
			
			// Default patterns if none provided
			const defaultStylePatterns = [ '**/*.scss' ];
			const finalStylePatterns = stylePatterns.length > 0 ? stylePatterns : defaultStylePatterns;

			// Lint styles
			const stylelintCmd = findExecutable( 'stylelint' );
			const stylelintArgs = stylelintCmd === 'npx'
				? [ 'stylelint', ...finalStylePatterns, '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...otherArgs ]
				: [ ...finalStylePatterns, '--ignore-pattern', 'vendor/**', '--ignore-pattern', 'node_modules/**', ...otherArgs ];

			await runCommand( stylelintCmd, stylelintArgs, 'Stylelint (styles)' );

			if ( exitOnComplete ) {
				console.log( 'Style linting completed successfully!' );
				process.exit( 0 );
			}
		} catch ( error ) {
			console.error( 'Style linting failed:', error.message );
			if ( exitOnComplete ) {
				process.exit( 1 );
			}
			throw error;
		}
	}

	// Function to run lint tasks
	/**
	 *
	 * @param args
	 * @param exitOnComplete
	 */
	async function runLintTasks( args, exitOnComplete = true ) {
		try {
			// Run both script and style linting (don't exit on complete for individual tasks)
			await runScriptLinting( args, false );
			await runStyleLinting( args, false );

			if ( exitOnComplete ) {
				console.log( 'All linting tasks completed successfully!' );
				process.exit( 0 );
			}
		} catch ( error ) {
			console.error( 'Linting failed:', error.message );
			if ( exitOnComplete ) {
				process.exit( 1 );
			}
			throw error;
		}
	}	// Function to run test tasks (lint + build)
	/**
	 *
	 * @param args
	 */
	async function runTestTasks( args ) {
		try {
		// Run linting first (don't exit on complete)
			await runLintTasks( [], false );

			// Then run build
			const viteCmd = findExecutable( 'vite' );
			const viteArgs = viteCmd === 'npx' ? [ 'vite', 'build', ...args ] : [ 'build', ...args ];

			await runCommand( viteCmd, viteArgs, 'Vite build' );

			console.log( 'All test tasks completed successfully!' );
			process.exit( 0 );
		} catch ( error ) {
			console.error( 'Test tasks failed:', error.message );
			process.exit( 1 );
		}
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
}

// Run the main function
main().catch( err => {
	console.error( 'Error:', err.message );
	process.exit( 1 );
} );
