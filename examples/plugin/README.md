# WordPress Plugin Example

This example demonstrates how to use `pressbooks-build-tools` with the WordPress-specific Vite configuration for a plugin.

## Setup

1. Install the package in your WordPress plugin:

```bash
npm install --save-dev pressbooks-build-tools
```

2. Copy the `vite.config.js` from this example to your plugin root

3. Update your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Configuration

Edit the `vite.config.js` file to customize:

- **input**: Define your entry points (JavaScript and SCSS files)
- **outDir**: Output directory for built assets (default: `dist`)
- **port**: Development server port (default: `3100`)
- **proxy**: Update target to match your local WordPress URL
- **liveReloadPaths**: Files to watch for automatic browser reload

## Development Workflow

1. Start the development server:
```bash
npm run dev
```

2. Make changes to your source files in `assets/src/`

3. Your browser will automatically reload when you save changes to PHP or asset files

## Production Build

Build optimized assets for production:

```bash
npm run build
```

This will generate:
- Minified JavaScript in `dist/scripts/`
- Compiled CSS in `dist/styles/`
- A manifest file for WordPress asset loading
- Source maps for debugging

## Enqueuing Assets in WordPress

The `@kucrut/vite-for-wp` plugin generates a manifest file. Use it to enqueue assets:

```php
<?php
// In your plugin main file
add_action( 'wp_enqueue_scripts', 'my_plugin_enqueue_assets' );

function my_plugin_enqueue_assets() {
    if ( ! function_exists( 'vite_enqueue' ) ) {
        return;
    }

    // Enqueue your built assets
    vite_enqueue(
        'plugin-public',
        plugin_dir_path( __FILE__ ) . 'dist',
        plugin_dir_url( __FILE__ ) . 'dist'
    );
}
```

For more information on enqueuing, see [@kucrut/vite-for-wp documentation](https://github.com/kucrut/vite-for-wp).
