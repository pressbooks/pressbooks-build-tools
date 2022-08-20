# Pressbooks Build Tools

[![npm](https://badgen.net/npm/v/pressbooks-build-tools)](https://www.npmjs.com/package/pressbooks-build-tools) [![GitHub release](https://badgen.net/github/release/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/releases/latest) [![license](https://badgen.net/github/license/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/blob/master/LICENSE)

NPM package which includes all asset linting and build tools for Pressbooks projects.

## How To install

```bash
npm i -D pressbooks-build-tools
```

## Usage

### Laravel Mix

Pressbooks Build Tools includes [Laravel Mix](https://laravel-mix.com/), which can be configured and used according to the
project's [documentation](https://laravel-mix.com/docs/6.0/installation#step-2-create-a-mix-configuration-file).

### ESLint

Pressbooks Build Tools includes [ESLint](https://eslint.org). Pressbooks' ESLint configuration can be used in your
project by adding the following to your ESLint configuration:

```javascript
"eslintConfig": {
    "extends": "./node_modules/pressbooks-build-tools/config/eslint.js"
}
```

### Stylelint

Pressbooks Build Tools includes [Stylelint](http://stylelint.io). Pressbooks' Stylelint configuration can be used in your
project by adding the following to your `package.json` file:

```javascript
"stylelint": {
    "extends": "./node_modules/pressbooks-build-tools/config/stylelint.js"
}
```

## Upgrading to 3.0

Version 3.0 of `pressbooks-build-tools` includes Laravel Mix 6.0, and as such will require some [changes to build scripts](https://laravel-mix.com/docs/6.0/upgrade#update-your-npm-scripts) wherever it is used. For example, the build task used in testing this package used to require the following script:

```shell
cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --no-progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js
```

The same build task can now be run using a new `mix` executable with an appropriate flag:

```shell
mix --production
```

For the full list of scripts and their replacements, see the [Laravel Mix documentation](https://laravel-mix.com/docs/6.0/upgrade#update-your-npm-scripts).

## Test Your Changes

This repo includes a boilerplate `webpack.mix.js` configuration used to test that, at the very least, `.js` and `.scss` files compile and that linters run. To run the test do:

```
npm install
npm test
```

Expected: No errors. Everything is fine.
