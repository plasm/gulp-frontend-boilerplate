# Gulp Frontend Boilerplate
Boilerplate for Frontend.

It's inspired by:
 - [es6-playground](https://github.com/caesarsol/es6-playground)

### Initial setup

```bash
# Clone the repo
git clone https://github.com/plasm/gulp-frontend-boilerplate
cd gulp-frontend-boilerplate

# Install dependencies
npm install

# To use global command `gulp`
npm install -g gulp
```

### Structure source
```text
.
└── src
    ├── coffeescript
    │  ├── core
    │  │  ├── app.coffee
    │  │  └── plugins.coffee
    │  └── vendor
    │     └── analytics.coffee
    └── fonts
    │  └── fontawesome
    ├── icons
    ├── images
    └── sass
       ├── animations
       ├── components
       ├── fonts
       ├── modules
       ├── patterns
       ├── vendors
       ├── style.sass
       └── README.md

```

### Sass folder
 File/Folder    | Use for
--------------- | --------------------------------------
*style.sass*    | Including all sass files
*vendors/*       | Is for CSS related to some JavaScript libraries
*fonts/*        | Is for fonts *(include font awesome)*
*animations/*   | Is for keyframes animations
*modules/*      | Is for mixins, variables and utilities
*patterns/*     | Is for global styles, buttons, and forms
*components/*   | Is for groups of patterns with small bits of layout
*layouts/*      | Is where page layouts go and any page-specific changes to patterns and components *(include bootstrap twitter grid and utility responsive)*


### Running in the browser
Runs an initial build (development), listens on your files changes, rebuilds them when necessary
and automagically reloads the browser!

### For development
```bash
gulp watch
```
### For production
```bash
gulp production
```
### Includes
- gulp
- browserify
- watchify
- coffeeify
- rimraf
- source
- sass
- browserSyncModule
- autoprefixer
- gutil
- coffee
- symlink
- plumber
- notify
- uglify
- minifyCss
