# Claude Code Configuration

## Project Overview
This is the pressbooks-build-tools package - an NPM package that provides asset linting and build tools for Pressbooks projects. It includes ESLint, Stylelint, Vite, and other modern build dependencies.

## Key Commands
- **Build**: `npm run build` - Build assets for production using Vite
- **Dev**: `npm run dev` - Start Vite development server with hot reload
- **Preview**: `npm run preview` - Preview production build locally
- **Lint**: `npm run lint` - Run all linting tasks (scripts and styles)
- **Test**: `npm run test` - Run linting and build tasks
- **Fix**: `npm run fix` - Auto-fix ESLint issues in JavaScript files

## Project Structure
- `config/` - ESLint and Stylelint configuration files
- `assets/src/scripts/` - Source JavaScript files
- `assets/src/styles/` - Source SCSS files
- `assets/dist/` - Built assets output directory
- `vite.config.js` - Vite configuration

## Development Workflow
1. Use `npm run dev` for development with hot reload and live server
2. Make changes to source files in `assets/src/`
3. Test changes with `npm run lint` 
4. Build with `npm run build` for production assets
5. Use `npm run fix` to auto-fix linting issues

## Build Features
- Modern ES modules with legacy browser support
- SCSS preprocessing with modern API
- Source maps for debugging
- Asset versioning and manifest generation
- Live reload for PHP templates during development
- Development server with proxy support for WordPress

## Important Notes
- Node.js >= 18 required
- Uses Vite for fast, modern build tooling
- Includes legacy browser support via @vitejs/plugin-legacy
- Uses Husky for Git hooks and lint-staged for pre-commit linting
- Follows conventional commit format via commitlint