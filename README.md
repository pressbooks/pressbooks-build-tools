# Pressbooks Build Tools

[![npm](https://badgen.net/npm/v/pressbooks-build-tools)](https://www.npmjs.com/package/pressbooks-build-tools) [![GitHub release](https://badgen.net/github/release/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/releases/latest) [![license](https://badgen.net/github/license/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/blob/master/LICENSE)

NPM package which includes all asset linting and build tools for Pressbooks projects.

## How To install

    cd ~/code/pressbooks-dev/site/web/app/plugins/pressbooks
    npm install --no-save pressbooks-build-tools

## Why No Save?

When installing  `pressbooks-build-tools` you install 955+ directories under `node_modules`. These modules are used to compile and copy files to `assets/dist`. These 
`node_modules` are never used in our code, never deployed.

When maintaining dozens & dozens of plugins & themes, 1 dependabot nag about some module in `pressbooks-build-tools` equals updating many, many GitHub repos to fix code we never 
deploy. It's not fun. For this reason we don't include `pressbooks-build-tools` in our plugins or themes `package.json` file.

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
npm run test
```

Expected: No errors. Everything is fine.
