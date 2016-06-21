import gulp from 'gulp'
import browserify from 'browserify'
import watchify from 'watchify'
import coffeeify from 'coffeeify'
import rimraf from 'rimraf'
import source from 'vinyl-source-stream'
import sass from 'gulp-sass'
import browserSyncModule from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
import gutil from 'gulp-util'
import coffee from 'gulp-coffee'
import symlink from 'gulp-symlink'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import uglify from 'gulp-uglify'
import minifyCss from 'gulp-minify-css'
import pug from 'gulp-pug'
import haml from 'gulp-haml'
import rename from 'gulp-rename'
import buffer from 'vinyl-buffer'

let browserSync = browserSyncModule.create()

const config = {
  inFiles: {
    html: 'src/*.html',
    pug: 'src/*.pug',
    haml: 'src/*.haml',
    js:   ['src/coffeescript/application.coffee'],
    css:  'src/sass/style.{sass,scss,css}'
  },
  out_development: 'development/',
  out_production: 'production/',
  outFiles: {
    js:   'app.js',
    css:  'style.css',
  },
}

let out_directory = config.out_development

gutil.log('- - - - - - - - - - - - - - -')
gutil.log('          Starting!          ')
gutil.log('')
gutil.log(' _._     _,-\'""`-._')
gutil.log('(,-.`._,\'(       |\`-/|')
gutil.log('    `-.-\' \ )-`( , o o)')
gutil.log('-bf-      `-    \`_`"\'-')
gutil.log('')
gutil.log('- - - - - - - - - - - - - - -')

function getBundler() {
  if (!global.bundler) {
    let conf = {
      entries: config.inFiles.js,
      paths: ['./node_modules', './src'],
      debug: true,
    }
    Object.assign(conf, watchify.args)

    global.bundler = watchify(browserify(conf)).transform(coffeeify)
  }
  return global.bundler
}

// -------------------------------------------------------
// Set development directory
gulp.task('set-development', function () {
  out_directory = config.out_development
})

// -------------------------------------------------------
// Set production directory
gulp.task('set-production', function () {
  out_directory = config.out_production
})

// -------------------------------------------------------
//
// DEVELOPMENT TASK
//
// -------------------------------------------------------

// -------------------------------------------------------
// Utility: A `rm -rf` util for nodejs
gulp.task('clean', function (cb) {
  return rimraf(out_directory, cb)
})

// -------------------------------------------------------
// Development: Open server
gulp.task('server', function () {
  return browserSync.init({
    server: {baseDir: out_directory},
    ui: false,
    notify: false
  })
})

// -------------------------------------------------------
// Development: Create Symlink
gulp.task('symlink', function () {
  return gulp.src(['src/images/', 'src/fonts/', 'src/icons/'])
  .pipe( symlink( [
      out_directory + 'images',
      out_directory + 'fonts',
      out_directory + 'icons'
    ], {force: true} )
  )
})

// -------------------------------------------------------
// Development: Compile Js and stream to browser
gulp.task('js', function () {
    return getBundler().bundle()
    .pipe(plumber({errorHandler: (err) => {
        notify.onError({ title: "Gulp", subtitle: "Failure!", message: "Error: <%= error.message %>", sound: "Beep" })(err)
        this.emit("end")
      }
    }))
    .pipe(source(config.outFiles.js))
    .pipe(gulp.dest(out_directory))
    .pipe(notify({ message: 'Js compiled' }))
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Compile Sass and stream to browser
gulp.task('sass', function () {
  return gulp.src(config.inFiles.css)
    .pipe(plumber({errorHandler: (err) => {
        notify.onError({ title: "Gulp", subtitle: "Failure!", message: "Error: <%= error.message %>", sound: "Beep" })(err)
        this.emit("end")
      }
    }))
    .pipe(sass({includePaths: 'node_modules/'}))
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(gulp.dest(out_directory))
    .pipe(notify({ message: 'Sass compiled' }))
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Copy HTML files
gulp.task('html', function () {
  return gulp.src(config.inFiles.html)
    .pipe(gulp.dest(out_directory)) // Just copy.
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Compile Pug files
gulp.task('pug', function () {
  return gulp.src(config.inFiles.pug)
    .pipe(pug())
    .pipe(gulp.dest(out_directory)) // Just copy.
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Compile Pug files
gulp.task('haml', function () {
  return gulp.src(config.inFiles.haml)
    .pipe(haml())
    .pipe(gulp.dest(out_directory)) // Just copy.
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
gulp.task('watch', ['symlink', 'js', 'sass', 'pug', 'html', 'server'], function () {
  // FIXME: initial development is done twice
  getBundler().on('update', () => gulp.start('js'))
  gulp.watch('**/*.pug', ['pug'])
  gulp.watch('**/*.coffee', ['js'])
  gulp.watch('**/*.{sass,scss,css}', ['sass'])
  gulp.watch(config.inFiles.html, ['html'])
})

// -------------------------------------------------------
//
// PRODUCTION TASK
//
// -------------------------------------------------------

// -------------------------------------------------------
// Production: Compile JS
gulp.task('compile-js', function () {
  browserify({
      entries: ['src/coffeescript/application.coffee'],
      debug: true,
      extensions: [".coffee"],
      transform: ["coffeeify"]
    })
    .bundle()
    .pipe(source(config.outFiles.js))
    .pipe(gulp.dest(out_directory))
    .pipe(notify({ message: 'Compile JS task complete' }))
});

// -------------------------------------------------------
// Production: Copy And Compress JS
gulp.task('uglify-js', function() {
  browserify({
      entries: ['src/coffeescript/application.coffee'],
      debug: true,
      extensions: [".coffee"],
      transform: ["coffeeify"]
    })
    .bundle()
    .pipe(source(config.outFiles.js))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(out_directory))
    .pipe(notify({ message: 'Compile JS task complete' }))
});

// -------------------------------------------------------
// Production: Compile SASS
gulp.task('compile-sass', function () {
  return gulp.src(config.inFiles.css)
    .pipe(sass({includePaths: 'node_modules/'}))
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(gulp.dest(out_directory))
    .pipe(notify({ message: 'SASS compiled' }))
})

// -------------------------------------------------------
// Production: Copy And Compress CSS
gulp.task('minify-css', function() {
  return gulp.src(config.inFiles.css)
    .pipe(sass({includePaths: 'node_modules/'}))
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(rename(config.outFiles.css))
    .pipe(gulp.dest(out_directory))
    .pipe(notify({ message: 'Minify CSS task complete' }))
});

// -------------------------------------------------------
// Production: Copy HTML files
gulp.task('copy:html', ['pug', 'haml'], function () {
  return gulp.src(['src/*.html'])
  .pipe(gulp.dest(out_directory))
  .pipe(notify({ message: 'Copy HTML task complete' }))
});

// -------------------------------------------------------
// Production: Copy Images files
gulp.task('copy:images', function () {
  return gulp.src(['src/images/**/*'])
  .pipe(gulp.dest(out_directory + 'images'))
  .pipe(notify({ message: 'Copy images task complete' }))
});

// -------------------------------------------------------
// Production: Copy Fonts files
gulp.task('copy:fonts', function () {
  return gulp.src(['src/fonts/**/*'])
  .pipe(gulp.dest(out_directory + 'fonts'))
  .pipe(notify({ message: 'Copy fonts task complete' }))
});

// -------------------------------------------------------
// Production: Copy Icons files
gulp.task('copy:icons', function () {
  return gulp.src(['src/icons/**/*'])
  .pipe(gulp.dest(out_directory + 'icons'))
  .pipe(notify({ message: 'Copy icons task complete' }))
});
// -------------------------------------------------------

gulp.task('build:unminified', ['copy:html', 'copy:images', 'copy:fonts', 'copy:icons', 'compile-sass', 'compile-js'], function () {})
gulp.task('build:minified', ['copy:html', 'copy:images', 'copy:fonts', 'copy:icons', 'minify-css', 'uglify-js'], function () {})

gulp.task('production', ['set-production', 'build:minified'], function () {})
gulp.task('production:minified', ['set-production', 'build:minified'], function () {})
gulp.task('production:unminified', ['set-production', 'build:unminified'], function () {})

