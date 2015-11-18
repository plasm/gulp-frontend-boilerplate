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

let browserSync = browserSyncModule.create()

const config = {
  inFiles: {
    html: 'src/*.html',
    js:   ['src/coffeescript/application.coffee'],
    css:  'src/sass/style.{sass,scss,css}'
  },
  out_development: 'development/',
  out_production: 'production/',
  outFiles: {
    js:   'app.js',
  },
}

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
//
// DEVELOPMENT TASK
//
// -------------------------------------------------------

// -------------------------------------------------------
// Utility: A `rm -rf` util for nodejs
gulp.task('clean', function (cb) {
  return rimraf(config.out_development, cb)
})

// -------------------------------------------------------
// Development: Open server
gulp.task('server', function () {
  return browserSync.init({
    server: {baseDir: config.out_development},
    ui: false,
  })
})

// -------------------------------------------------------
// Development: Create Symlink
gulp.task('symlink', function () {
  return gulp.src(['src/images/', 'src/fonts/', 'src/icons/'])
  .pipe( symlink( [
      config.out_development + 'images',
      config.out_development + 'fonts',
      config.out_development + 'icons'
    ], {force: true} )
  )
})


// -------------------------------------------------------
// Development: Compile Js
gulp.task('js', function () {
    return getBundler().bundle()
    .pipe(plumber({errorHandler: (err) => {
        notify.onError({ title: "Gulp", subtitle: "Failure!", message: "Error: <%= error.message %>", sound: "Beep" })(err)
        this.emit("end")
      }
    }))
    .pipe(source(config.outFiles.js))
    .pipe(gulp.dest(config.out_development))
    .pipe(notify({ message: 'Js compiled' }))
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Compile Sass
gulp.task('sass', function () {
  return gulp.src(config.inFiles.css)
    .pipe(plumber({errorHandler: (err) => {
        notify.onError({ title: "Gulp", subtitle: "Failure!", message: "Error: <%= error.message %>", sound: "Beep" })(err)
        this.emit("end")
      }
    }))
    .pipe(sass({includePaths: 'node_modules/'}))
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(gulp.dest(config.out_development))
    .pipe(notify({ message: 'Sass compiled' }))
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Copy HTML files
gulp.task('html', function () {
  return gulp.src(config.inFiles.html)
    .pipe(gulp.dest(config.out_development)) // Just copy.
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
gulp.task('watch', ['symlink', 'js', 'sass', 'html',  'server'], function () {
  // FIXME: initial development is done two times
  getBundler().on('update', () => gulp.start('js'))
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
// Production: Copy And Compress JS
gulp.task('uglify-js', function() {
  return gulp.src(config.out_development + '*.js')
    .pipe(uglify())
    .pipe(gulp.dest(config.out_production))
    .pipe(notify({ message: 'Minify JS task complete' }))
});

// -------------------------------------------------------
// Production: Copy And Compress CSS
gulp.task('minify-css', function() {
  return gulp.src(config.out_development + '*.css')
    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(gulp.dest(config.out_production))
    .pipe(notify({ message: 'Minify CSS task complete' }))
});

// -------------------------------------------------------
// Production: Copy HTML files
gulp.task('copy:html', function () {
  return gulp.src(['src/*.html'])
  .pipe(gulp.dest(config.out_production))
  .pipe(notify({ message: 'Copy HTML task complete' }))
});

// -------------------------------------------------------
// Production: Copy Images files
gulp.task('copy:images', function () {
  return gulp.src(['src/images/**/*'])
  .pipe(gulp.dest(config.out_production + 'images'))
  .pipe(notify({ message: 'Copy images task complete' }))
});

// -------------------------------------------------------
// Production: Copy Fonts files
gulp.task('copy:fonts', function () {
  return gulp.src(['src/fonts/**/*'])
  .pipe(gulp.dest(config.out_production + 'fonts'))
  .pipe(notify({ message: 'Copy fonts task complete' }))
});

// -------------------------------------------------------
// Production: Copy Icons files
gulp.task('copy:icons', function () {
  return gulp.src(['src/icons/**/*'])
  .pipe(gulp.dest(config.out_production + 'icons'))
  .pipe(notify({ message: 'Copy icons task complete' }))
});
// -------------------------------------------------------
gulp.task('production', ['copy:html', 'copy:images', 'copy:fonts', 'copy:icons', 'minify-css', 'uglify-js'], function () {})
