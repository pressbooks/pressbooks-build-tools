# Pressbooks Build Tools

[![npm](https://badgen.net/npm/v/pressbooks-build-tools)](https://www.npmjs.com/package/pressbooks-build-tools) [![GitHub release](https://badgen.net/github/release/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/releases/latest) [![license](https://badgen.net/github/license/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/blob/master/LICENSE)

NPM package which includes all asset linting and build tools for Pressbooks projects.

## How To install

    cd ~/code/pressbooks-dev/site/web/app/plugins/pressbooks
    npm install --no-save pressbooks-build-tools

## Why No Save?

When installing  `pressbooks-build-tools` you install 955+ directories under `node_modules`. These modules are used to compile and copy files to `assets/dist`. These 
`node_modules` are never used in our code, never deployed.

When maintaining dozens & dozens of plugins & themes, 1 dependabot nag about some  module in `pressbooks-build-tools` equals updating many, many GitHub repos to fix code we never 
deploy. It's not fun. For this reason we don't include `pressbooks-build-tools` in our plugins or themes `package.json` file. 

## Test Your Changes

This repo includes a boilerplate `webpack.mix.js` configuration used to test that, at the very least, `.js` and `.scss` files compile. To run the test do:

```
npm install
npm run test
```

Expected: No errors. Everything is fine.