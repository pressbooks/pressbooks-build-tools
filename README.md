# Pressbooks Build Tools

[![npm](https://badgen.net/npm/v/pressbooks-build-tools)](https://www.npmjs.com/package/pressbooks-build-tools) [![GitHub release](https://badgen.net/github/release/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/releases/latest) [![license](https://badgen.net/github/license/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/blob/master/LICENSE)

NPM package which includes all asset linting and build tools for Pressbooks projects.

## Installation

```bash
npm i -D pressbooks-build-tools
```

## Usage

### Vite Build System

Pressbooks Build Tools now uses [Vite](https://vitejs.dev/) for fast, modern asset building. To use it in your project:

#### 1. Create a `vite.config.js` in your project root:

```javascript
import { createViteConfig } from 'pressbooks-build-tools'
import { resolve } from 'path'

export default createViteConfig({
  input: {
    'my-plugin': resolve(__dirname, 'assets/src/scripts/main.js'),
    'my-plugin-styles': resolve(__dirname, 'assets/src/styles/main.scss')
  },
  // Optional customizations
  outDir: 'assets/dist',
  port: 3200,
  proxy: {
    '/wp-admin': {
      target: 'https://my-site.test',
      changeOrigin: true,
      secure: false
    }
  }
})
```

#### 2. Add scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "pressbooks-build-tools build",
    "dev": "pressbooks-build-tools dev",
    "watch": "pressbooks-build-tools dev",
    "preview": "pressbooks-build-tools preview",
    "lint": "pressbooks-build-tools lint",
    "lint:scripts": "pressbooks-build-tools lint:scripts",
    "lint:styles": "pressbooks-build-tools lint:styles",
    "fix": "pressbooks-build-tools fix",
    "test": "pressbooks-build-tools test"
  }
}
```

#### 3. Use npm scripts or CLI commands directly:

```bash
# Development with hot reload
npm run dev
# or directly: pressbooks-build-tools dev

# Build for production  
npm run build
# or directly: pressbooks-build-tools build

# Lint code
npm run lint
# or directly: pressbooks-build-tools lint

# Auto-fix linting issues
npm run fix
# or directly: pressbooks-build-tools fix

# Run tests (lint + build)
npm run test
# or directly: pressbooks-build-tools test
```

#### Configuration Options

The `createViteConfig` function accepts these options:

- `input` - Entry points for your assets (required)
- `outDir` - Output directory (default: `'assets/dist'`)
- `port` - Development server port (default: `3100`)
- `host` - Development server host (default: `'localhost'`)
- `proxy` - Development server proxy configuration
- `copyTargets` - Array of files/directories to copy during build (see below)
- `plugins` - Additional Vite plugins to include
- `config` - Additional Vite configuration to merge

#### File Copying with copyTargets

For copying static files (equivalent to Laravel Mix's `.copy()` and `.copyDirectory()`):

```javascript
export default createViteConfig({
  // ... other options ...
  copyTargets: [
    // Copy individual files
    { 
      src: 'node_modules/some-lib/dist/file.js', 
      dest: 'scripts', 
      rename: 'new-name.js' 
    },
    // Copy directories
    { 
      src: 'assets/src/images/*', 
      dest: 'images' 
    },
    // Copy with glob patterns
    { 
      src: 'node_modules/@vendor/package/dist/**/*', 
      dest: 'vendor/package' 
    }
  ]
})
```

#### Migrating .scripts() Concatenation

Laravel Mix's `.scripts()` method concatenated multiple files. In Vite, create wrapper files instead:

```javascript
// assets/src/scripts/vendor/jquery-plugins.js
import 'jquery-ui/dist/jquery-ui.min.js';
import 'jquery-validation/dist/jquery.validate.min.js';
import 'select2/dist/js/select2.min.js';

// Then add to your vite.config.js:
input: {
  'jquery-plugins': resolve(__dirname, 'assets/src/scripts/vendor/jquery-plugins.js')
}
```

### ESLint

Pressbooks Build Tools includes [ESLint](https://eslint.org). Pressbooks' ESLint configuration can be used in your
project by adding the following to your ESLint configuration:

```json
"eslintConfig": {
    "extends": "./node_modules/pressbooks-build-tools/config/eslint.cjs"
}
```

### Stylelint

Pressbooks Build Tools includes [Stylelint](http://stylelint.io). Pressbooks' Stylelint configuration can be used in your
project by adding the following to your `package.json` file:

```json
"stylelint": {
    "extends": "./node_modules/pressbooks-build-tools/config/stylelint.js"
}
```

## Migration from Laravel Mix

If you're upgrading from a previous version that used Laravel Mix:

1. **Remove old files**: Delete `webpack.mix.js` from your project
2. **Update package.json**: Replace Mix scripts with Vite scripts (see above)
3. **Create vite.config.js**: Use the new configuration format
4. **Update asset paths**: Vite uses different output paths than Mix

### Asset Structure

Your project should have this structure:

```
your-plugin/
├── assets/
│   ├── src/
│   │   ├── scripts/
│   │   │   └── main.js
│   │   └── styles/
│   │       └── main.scss
│   └── dist/           # Generated by build
├── vite.config.js      # New config file
└── package.json        # Updated scripts
```

## Development

This repo includes test assets to verify that `.js` and `.scss` files compile and linters run. To test your changes:

```
npm install
npm test
```

Expected: No errors. Everything is fine.
