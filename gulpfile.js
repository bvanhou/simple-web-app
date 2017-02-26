const src = 'app';
const dev = '.tmp';
const build = 'dist';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const historyApiFallback = require('connect-history-api-fallback');


const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Browserify bundle related
const babelify   = require('babelify');
const browserify = require('browserify');
const buffer     = require('vinyl-buffer');
const gutil      = require('gulp-util');
const livereload = require('gulp-livereload');
const merge      = require('merge');
const rename     = require('gulp-rename');
const source     = require('vinyl-source-stream');
const sourceMaps = require('gulp-sourcemaps');
const watchify   = require('watchify');
const uglify     = require('gulp-uglify');

var config = {
  port: 9002,
  html: src+'/**/*.html',
  images: src+'/images/**/*',
  bower: 'bower.json',
  js: {
    files: src+'/scripts/**/*.js',
    src: src+'/scripts/app.js',
    dev: src+'/scripts/',
    mapDir: '../../maps/',
    dest: build+'/scripts',
    bundle: 'bundle.js'
  },
  styles: {
    src: [src+'/styles/**/*.scss', src+'/styles/*.scss'],
    dir: build+'/styles/',
    mapDir: '../../maps/',
    dest: build+'/styles',
  },
  views: {
    src: src+'/views/**/*.html',
    dir: build+'/views/',
    mapDir: '../../maps/',
    dest: build+'/views',
  }
};


gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    return gulp.src(config.js.src)
      .pipe(browserify())
      .pipe(uglify())
      .pipe(gulp.dest(config.js.dir));
});

gulp.task('html', ['styles', 'bundleForBuild'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('views', () => {
  return gulp.src('app/views/**/*.html')
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist/views'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
      .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'bundle'], () => {
  browserSync({
    notify: true,
    port: config.port,
    server: {
      baseDir: [dev, src],
      middleware: [ historyApiFallback() ],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    config.html,
    config.images
  ]).on('change', reload);


  gulp.watch(config.styles.src, ['styles']).on('change', reload);
  gulp.watch(config.js.files, ['bundleServe']).on('change', reload);
  gulp.watch(config.bower, ['wiredep']).on('change', reload);
});


// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['html', 'images', 'views'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

//////////////////////////////////////////////////////
// Watch Files and browserify bunding: To kick off live reload server
//////////////////////////////////////////////////////
gulp.task('watch', () => {
  livereload.listen();
  var args = merge(watchify.args, { debug : true});
  var bundler = browserify(config.js.src, args)
                 .plugin(watchify, { ignoreWatch: ['**/node_modules'] })
                 .transform(babelify, { presets : [ 'es2015' ] });

  bundler
    .bundle()                                    // Start bundle
    .pipe(source(config.js.src))                 // Entry point
    .pipe(buffer())                              // Convert to gulp pipeline
    .pipe(rename(config.js.bundle))          // Rename output from 'main.js' to 'bundle.js'
    .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
    .on('error', gutil.log)
    .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their own directory
    .pipe(gulp.dest(config.js.outputDir))        // Save 'bundle' to build/
    .pipe(reload({stream: true}));

  bundler.on('update', function () {
    // Add options to add to "base" bundler passed as parameter
    bundler
      .bundle()                                    // Start bundle
      .pipe(source(config.js.src))                 // Entry point
      .pipe(buffer())                              // Convert to gulp pipeline
      .pipe(rename(config.js.bundle))                 // Rename output from 'main.js' to 'bundle.js'
      .pipe(sourceMaps.init({ loadMaps : true }))     // Strip inline source maps
      .pipe(sourceMaps.write(config.js.mapDir))       // Save source maps to their own directory
      .pipe(gulp.dest(config.js.dir))                 // Save 'bundle' to build/
      // .pipe(livereload());                         // Reload browser if relevant
  });
});

gulp.task('bundle', () => {
  var bundler = browserify(config.js.src)  // Pass browserify the entry point
                  .transform(babelify, { presets : [ 'es2015' ] });  // Then, babelify, with ES2015 preset

  // Add options to add to "base" bundler passed as parameter
  bundler
    .bundle()                                    // Start bundle
    .pipe(source(config.js.src))                 // Entry point
    .pipe(buffer())                              // Convert to gulp pipeline
    .pipe(rename(config.js.bundle))              // Rename output from 'main.js' to 'bundle.js'
    .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
    .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their own directory
    .pipe(gulp.dest(config.js.dev))              // Save 'bundle' to build/
    // .pipe(livereload());                      // Reload browser if relevant
})

gulp.task('bundleServe', () => {
  var args = merge(watchify.args, { debug : true});
  var bundler = browserify(config.js.src, args)
                 .plugin(watchify, { ignoreWatch: ['**/node_modules'] })
                 .transform(babelify, { presets : [ 'es2015' ] });

  // Add options to add to "base" bundler passed as parameter
  bundler
    .bundle()                                    // Start bundle
    .pipe(source(config.js.src))                 // Entry point
    .pipe(buffer())
    .pipe($.ngAnnotate())                        // ng-annotate to enable uglification of services injected                      // Convert to gulp pipeline
    .pipe(rename(config.js.bundle))              // Rename output from 'main.js' to 'bundle.js'
    .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
    .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their own directory
    .pipe(gulp.dest(config.js.dev))             // Save 'bundle' to build/
    .pipe(reload({stream: true}));
});

gulp.task('bundleForBuild', function () {
  var bundler = browserify(config.js.src)
                  .transform(babelify, { presets : [ 'es2015' ], comments : true, compact: false });

  bundler
    .bundle()                                    // Start bundle
    .on('error', err => {
      gutil.log("Browserify Error", gutil.colors.red(err.message))
    })
    .pipe(source(config.js.src))                 // Entry point
    .pipe(buffer())                              // Convert to gulp pipeline
    .pipe($.ngAnnotate())                          // ng-annotate to enable uglification of services injected
    .pipe(uglify())
    .pipe(rename(config.js.bundle))              // Rename output from 'main.js' to 'bundle.js'
    .pipe(gulp.dest(config.js.dest))             // Save 'bundle' to build/
})
