# Pressbooks Build Tools

[![npm](https://badgen.net/npm/v/pressbooks-build-tools)](https://www.npmjs.com/package/pressbooks-build-tools) [![GitHub release](https://badgen.net/github/release/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/releases/latest) [![license](https://badgen.net/github/license/pressbooks/pressbooks-build-tools)](https://github.com/pressbooks/pressbooks-build-tools/blob/master/LICENSE)

NPM package which includes all asset linting and build tools for Pressbooks projects.

### Test Your Changes

This repo includes a boilerplate `webpack.mix.js` configuration used to test that, at the very least, `.js` and `.scss` files compile. To run the test do:

```
npm install
npm run test
```

Expected: No errors. Everything is fine.

### Global Install

When installing `pressbooks-build-tools` you install 955+ directories under `node_modules`. These modules are used to compile and copy files to `assets/dist`. The files under 
`node_modules` are never deployed. The very time consuming problem with this approach, when maintaining dozens & dozens of plugins & themes, means 1 dependabot nag about some 
module in `pressbooks-build-tools` equals updating many, many GitHub repos. It's not fun. For this reason, we don't include `pressbooks-build-tools` in our plugins or themes. 
Instead:

> The [Node module resolution algorithm](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders) is recursive: When looking for package `A`, it looks in a 
> local `node_modules/A` directory, then in `../node_modules/A`, `../../node_modules/A`, `../../../node_modules/A`, etc. Tooling that follows this specification can transparently 
> find dependencies which have been hoisted.
 
It is recommended to install `pressbooks-build-tools` under [Bedrock](https://github.com/pressbooks/bedrock/)

When installing under Bedrock, add `package.json`, `package-lock.json` and `node_modules` to the `.gitignore` file.