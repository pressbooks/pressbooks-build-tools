# WordPress Theme Example (Pressbooks Book)

This example demonstrates how to use `pressbooks-build-tools` with the WordPress-specific Vite configuration for a theme. This configuration is ported from the [pressbooks-book theme webpack.mix.js](https://github.com/pressbooks/pressbooks-book/blob/dev/webpack.mix.js).

## Setup

1. Install the package in your WordPress theme:

```bash
npm install --save-dev pressbooks-build-tools vite-plugin-static-copy
```

2. Copy the `vite.config.js` from this example to your theme root

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

## What's Included

This configuration handles:

### JavaScript Entry Points
- `book.js` - Main book functionality
- `pane.js` - Pane/sidebar functionality
- `collapse-sections.js` - Section collapsing
- `lightbox.js` - Lightbox functionality

### Vendor Libraries
- `sharer.js` - Social sharing
- `lity.js` - Lightbox library
- `details-element-polyfill.js` - Polyfill for `<details>` element

### Styles
- `book.scss` - Main theme styles
- `web-house-style.scss` - Legacy web house styles
- `lity.css` - Lightbox styles (copied from node_modules)

### Static Assets
- Images from `assets/src/images/` copied to `dist/images/`
- Lity CSS file copied to `dist/styles/`

## Migration from Laravel Mix

### Before (webpack.mix.js)
```javascript
mix
  .scripts('node_modules/sharer.js/sharer.js', 'dist/scripts/sharer.js')
  .js('assets/src/scripts/book.js', 'dist/scripts/book.js')
  .sass('assets/src/styles/book.scss', 'dist/styles')
  .copy('node_modules/lity/dist/lity.css', 'dist/styles/lity.css')
  .copyDirectory('assets/src/images', 'dist/images')
  .version()
```

### After (vite.config.js)
```javascript
createWpViteConfig({
  input: {
    sharer: 'node_modules/sharer.js/sharer.js',
    book: 'assets/src/scripts/book.js',
    'book-styles': 'assets/src/styles/book.scss',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'node_modules/lity/dist/lity.css', dest: 'styles' },
        { src: 'assets/src/images', dest: 'images' },
      ],
    }),
  ],
})
```

## Development Workflow

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3200`
   - The dev server proxies requests to your WordPress site
   - Changes to JS/CSS files trigger hot module replacement
   - Changes to PHP files trigger a full page reload

3. Make changes to your source files in `assets/src/`

## Production Build

Build optimized assets for production:

```bash
npm run build
```

This will generate:
- Minified JavaScript in `dist/scripts/`
- Compiled CSS in `dist/styles/`
- Optimized images in `dist/images/`
- A manifest file for cache-busting
- Source maps for debugging

## Enqueuing Assets in WordPress

Use the `@kucrut/vite-for-wp` helper functions to enqueue assets:

```php
<?php
// In your theme's functions.php
add_action( 'wp_enqueue_scripts', 'pressbooks_book_enqueue_assets' );

function pressbooks_book_enqueue_assets() {
    if ( ! function_exists( 'vite_enqueue' ) ) {
        return;
    }

    // Enqueue book script and styles
    vite_enqueue(
        'book',
        get_stylesheet_directory() . '/dist',
        get_stylesheet_directory_uri() . '/dist'
    );

    // Enqueue lightbox functionality
    vite_enqueue(
        'lightbox',
        get_stylesheet_directory() . '/dist',
        get_stylesheet_directory_uri() . '/dist'
    );
}
```

## Configuration Options

Update the configuration in `vite.config.js` to customize:

- **input**: Add or remove entry points
- **outDir**: Change output directory (default: `dist`)
- **port**: Change dev server port (default: `3200`)
- **proxy**: Update to match your local WordPress URL
- **plugins**: Add additional Vite plugins

## Key Differences from Laravel Mix

1. **Entry Points**: All entry points defined in one `input` object
2. **Versioning**: Built-in via manifest file (no separate `.version()` call)
3. **Source Maps**: Automatically generated in development
4. **HMR**: Hot Module Replacement works out of the box
5. **Speed**: Significantly faster build times with Vite
6. **Modern Output**: ES modules by default with legacy fallback

## Resources

- [@kucrut/vite-for-wp Documentation](https://github.com/kucrut/vite-for-wp)
- [Vite Documentation](https://vitejs.dev/)
- [vite-plugin-static-copy](https://github.com/sapphi-red/vite-plugin-static-copy)
