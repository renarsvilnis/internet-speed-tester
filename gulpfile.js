var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    // autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    // uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    // rename = require('gulp-rename'),
    // concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat');

// http://markgoodyear.com/2014/01/getting-started-with-gulp/

var IN_BASE = 'src';
var OUT_BASE = 'dist';

var BOWER = 'bower_components';

var IN = {
  STYLES: IN_BASE + '/sass',
  SCRIPTS: IN_BASE + '/js',
  IMAGES: IN_BASE + '/img',
  FONTS: IN_BASE + '/fonts',
};

var OUT = {
  STYLES: OUT_BASE + '/stylesheets',
  SCRIPTS: OUT_BASE + '/javascripts',
  IMAGES: OUT_BASE + '/images',
  FONTS: OUT_BASE + '/fonts',
};


gulp.task('styles', function() {

  return gulp.src([
      BOWER + '/skeleton-scss/scss/skeleton.scss',
      IN.STYLES + '/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({
      style: 'expanded',
      sourcemap: false,
      trace: true,
    }))
    .on('error', function (err) { console.log(err.message); })
    .pipe(plumber.stop())
    .pipe(concat('site.css'))
    .pipe(gulp.dest(OUT.STYLES))
    .pipe(notify({
      message: 'Styles task complete'
    }));
});

gulp.task('scripts', function() {
  return gulp.src([
      BOWER + '/d3/d3.min.js',
      BOWER + '/brototype/brototype.js',
      IN.SCRIPTS + '/**/*.js'
    ])
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
     // .pipe(concat('main.js'))
    // .pipe(gulp.dest('dist/assets/js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(concat('site.js'))
    .pipe(gulp.dest(OUT.SCRIPTS))
    .pipe(notify({
      message: 'Scripts task complete'
    }));
});

gulp.task('images', function() {
  return gulp.src(IN.IMAGES + '/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(OUT.IMAGES))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('fonts', function() {
  return gulp.src(IN.FONTS + '/**/*')
    .pipe(gulp.dest(OUT.FONTS))
    .pipe(notify({ message: 'Fonts task complete' }));
});

gulp.task('clean', function(callback) {
  del([OUT_BASE], callback);
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(IN.STYLES + '/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch(IN.SCRIPTS + '/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch(IN.IMAGES + '/**/*', ['images']);

  // Watch font files
  gulp.watch(IN.FONTS + '/**/*', ['fonts']);

  // Create LiveReload server
  livereload.listen();

  gulp.watch([IN_BASE + '/**']).on('change', livereload.changed);
});


gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'fonts', 'watch');
});
