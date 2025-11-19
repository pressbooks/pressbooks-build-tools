# Pressbooks Build Tools

[![npm](https://badgen.net/npm/v/pressbooks-build-tools)](https://www.npmjs.com/package/pressbooks-build-tools) [![GitHub release](https://badgen.net/github/release/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/releases/latest) [![license](https://badgen.net/github/license/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/blob/master/LICENSE)

NPM package which includes all asset linting and build tools for Pressbooks projects.

## Installation

```bash
npm i -D pressbooks-build-tools
```

## Usage

### Quick Start

1. **Install the package:**
```bash
npm i -D pressbooks-build-tools
```

2. **Create a `vite.config.js` in your project root:**
```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Import the WordPress-optimized Vite config
import baseConfig from 'pressbooks-build-tools/vite-wp';

export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'assets/src/scripts/main.js'),
        styles: resolve(__dirname, 'assets/src/styles/main.scss'),
      },
    },
  },
});
```

3. **Add scripts to your `package.json`:**
```json
{
  "scripts": {
    "build": "pressbooks-build-tools build",
    "dev": "pressbooks-build-tools dev",
    "preview": "pressbooks-build-tools preview",
    "lint": "pressbooks-build-tools lint",
    "fix": "pressbooks-build-tools fix",
    "test": "pressbooks-build-tools test"
  },
  "eslintConfig": {
    "extends": "pressbooks-build-tools/eslint"
  },
  "stylelint": {
    "extends": "pressbooks-build-tools/stylelint"
  }
}
```

4. **Use the commands:**
```bash
# Development with hot reload
npm run dev

# Build for production  
npm run build

# Lint code (both JavaScript and SCSS)
npm run lint

# Auto-fix linting issues
npm run fix

# Run tests (lint + build)
npm run test
```

### Available Commands

| Command | Description | Example Usage |
|---------|-------------|---------------|
| `build` | Build assets for production | `pressbooks-build-tools build` |
| `dev` | Start development server with hot reload | `pressbooks-build-tools dev` |
| `preview` | Preview production build locally | `pressbooks-build-tools preview` |
| `lint` | Run linting on JavaScript and SCSS files | `pressbooks-build-tools lint` |
| `fix` | Auto-fix ESLint issues in JavaScript files | `pressbooks-build-tools fix` |
| `test` | Run linting and build tasks | `pressbooks-build-tools test` |

### Customizing Lint Directories

By default, the lint command scans:
- **Scripts:** `config/*.js`, `assets/src/scripts/**/*.js`
- **Styles:** `**/*.scss`

You can customize which directories to scan:

```bash
# Lint custom script directories
pressbooks-build-tools lint --scripts "src/**/*.js" --scripts "lib/**/*.js"

# Lint custom style directories  
pressbooks-build-tools lint --styles "assets/css/**/*.scss" --styles "themes/**/*.scss"

# Combine custom patterns
pressbooks-build-tools lint --scripts "src/**/*.js" --styles "assets/**/*.scss"

# Add additional ESLint/Stylelint options
pressbooks-build-tools lint --scripts "src/**/*.js" --fix --max-warnings 0
```

You can also create custom scripts in your `package.json`:

```json
{
  "scripts": {
    "lint": "pressbooks-build-tools lint",
    "lint:theme": "pressbooks-build-tools lint --scripts 'theme/assets/**/*.js' --styles 'theme/assets/**/*.scss'",
    "lint:admin": "pressbooks-build-tools lint --scripts 'admin/js/**/*.js' --styles 'admin/css/**/*.scss'",
    "lint:custom": "pressbooks-build-tools lint --scripts 'src/**/*.js' --styles 'assets/**/*.scss'"
  }
}
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

### Linting Configuration

#### ESLint (JavaScript/TypeScript)

Pressbooks Build Tools includes [ESLint](https://eslint.org) with a comprehensive configuration. The ESLint config is provided as a `.cjs` file (CommonJS format) because ESLint requires CommonJS when used in ES modules projects.

Add to your `package.json`:
```json
{
  "eslintConfig": {
    "extends": "pressbooks-build-tools/eslint"
  }
}
```

Or create a separate `.eslintrc.cjs` file:
```javascript
module.exports = {
  extends: ['pressbooks-build-tools/eslint'],
  // Add your custom rules here
  rules: {
    // Override or add rules as needed
  }
}
```

#### Stylelint (CSS/SCSS)

Pressbooks Build Tools includes [Stylelint](http://stylelint.io) for CSS and SCSS linting. The Stylelint config is a regular `.js` file since Stylelint handles both CommonJS and ES modules seamlessly.

Add to your `package.json`:
```json
{
  "stylelint": {
    "extends": "pressbooks-build-tools/stylelint"
  }
}
```

Or create a separate `.stylelintrc.js` file:
```javascript
module.exports = {
  extends: ['pressbooks-build-tools/stylelint'],
  rules: {
    // Add your custom rules here
  }
}
```

#### Why Different File Formats?

- **ESLint config (`.cjs`)**: Uses CommonJS format because ESLint has specific requirements when working with ES modules projects
- **Stylelint config (`.js`)**: Uses regular JavaScript format as Stylelint handles both module systems transparently

## Examples

### Basic Plugin Setup

Here's a complete example for a WordPress plugin:

**Directory structure:**
```
my-plugin/
├── assets/
│   ├── src/
│   │   ├── scripts/
│   │   │   ├── main.js
│   │   │   └── admin.js
│   │   └── styles/
│   │       ├── main.scss
│   │       └── admin.scss
│   └── dist/           # Generated by build
├── vite.config.js
└── package.json
```

**package.json:**
```json
{
  "name": "my-plugin",
  "scripts": {
    "build": "pressbooks-build-tools build",
    "dev": "pressbooks-build-tools dev",
    "lint": "pressbooks-build-tools lint",
    "fix": "pressbooks-build-tools fix",
    "test": "pressbooks-build-tools test"
  },
  "devDependencies": {
    "pressbooks-build-tools": "^5.0.0"
  },
  "eslintConfig": {
    "extends": "pressbooks-build-tools/eslint"
  },
  "stylelint": {
    "extends": "pressbooks-build-tools/stylelint"
  }
}
```

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import baseConfig from 'pressbooks-build-tools/vite-wp';

export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    rollupOptions: {
      input: {
        'my-plugin': resolve(__dirname, 'assets/src/scripts/main.js'),
        'my-plugin-admin': resolve(__dirname, 'assets/src/scripts/admin.js'),
        'my-plugin-styles': resolve(__dirname, 'assets/src/styles/main.scss'),
        'my-plugin-admin-styles': resolve(__dirname, 'assets/src/styles/admin.scss'),
      },
    },
  },
});
```

### Theme Setup

**vite.config.js for a theme:**
```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import baseConfig from 'pressbooks-build-tools/vite-wp';

export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    rollupOptions: {
      input: {
        'theme': resolve(__dirname, 'assets/src/scripts/theme.js'),
        'theme-styles': resolve(__dirname, 'assets/src/styles/style.scss'),
        'editor-styles': resolve(__dirname, 'assets/src/styles/editor.scss'),
      },
    },
  },
  server: {
    ...baseConfig.server,
    port: 3200, // Custom port for this theme
  },
});
```

**Custom lint patterns for theme:**
```json
{
  "scripts": {
    "lint:theme": "pressbooks-build-tools lint --scripts 'assets/src/**/*.js' --styles 'assets/src/**/*.scss'"
  }
}
```

### Advanced Configuration

**vite.config.js with custom plugins and copying:**
```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import baseConfig from 'pressbooks-build-tools/vite-wp';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/some-lib/dist/*',
          dest: 'vendor/some-lib'
        },
        {
          src: 'assets/src/images/*',
          dest: 'images'
        }
      ]
    })
  ],
  build: {
    ...baseConfig.build,
    rollupOptions: {
      input: {
        'app': resolve(__dirname, 'assets/src/scripts/app.js'),
        'vendor': resolve(__dirname, 'assets/src/scripts/vendor.js'),
        'app-styles': resolve(__dirname, 'assets/src/styles/app.scss'),
      },
    },
  },
  server: {
    ...baseConfig.server,
    port: 3300,
    proxy: {
      '/wp-admin': {
        target: 'https://my-local-site.test',
        changeOrigin: true,
        secure: false
      }
    }
  },
});
```

### Multiple Entry Points Example

**For complex plugins with multiple components:**
```javascript
// vite.config.js
export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    rollupOptions: {
      input: {
        // Frontend
        'public': resolve(__dirname, 'assets/src/scripts/public.js'),
        'public-styles': resolve(__dirname, 'assets/src/styles/public.scss'),
        
        // Admin
        'admin': resolve(__dirname, 'assets/src/scripts/admin.js'),
        'admin-styles': resolve(__dirname, 'assets/src/styles/admin.scss'),
        
        // Gutenberg blocks
        'blocks': resolve(__dirname, 'assets/src/scripts/blocks.js'),
        'blocks-styles': resolve(__dirname, 'assets/src/styles/blocks.scss'),
        
        // Vendor libraries
        'vendor': resolve(__dirname, 'assets/src/scripts/vendor.js'),
      },
    },
  },
});
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
