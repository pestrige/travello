const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const sprite = require('gulp-svgstore');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
const del = require('del');

// Html

const html = () => {
  return gulp.src('./source/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('./build'))
};

exports.html = html;

// Styles

const styles = () => {
  return gulp.src('./source/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
		.pipe(rename('style.min.css'))
		.pipe(sourcemap.write('.'))
    .pipe(gulp.dest('./build/css'));
}

exports.styles = styles;

// Scripts

const scripts = () => {
  return gulp.src('./source/js/*.js')
  .pipe(uglify())
  .pipe(rename(function (path) {
    path.basename += '.min';
  }))
  .pipe(gulp.dest('./build/js'))
}

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src([
    './source/img/**/*.{jpg,png,svg}',
    '!./source/img/icons/sprite/*.svg'])
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 80, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('./build/img'))
}

exports.images = images;

// webP

const createWebp = () => {
  return gulp.src('./source/img/content/**/*.{jpg,png}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('./build/img/content'))
}

exports.createWebp = createWebp;

// SVG Sprites

const createSprite = () => {
  return gulp.src('./source/img/icons/sprite/*.svg')
    .pipe(sprite())
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('./build/img/icons/sprite'))
}

exports.createSprite = createSprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: './build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Clean

const clean = () => del('./build');

// Copy

const copy = (done) => {
  gulp.src([
    './source/fonts/*.{woff2,woff}',
    './source/img/**/*.{jpg,png,svg}',
    '!./source/img/icons/sprite/*.svg'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('./build'))
  done();
};

exports.copy = copy;

// Reload

const reload = done => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('./source/scss/**/*.scss', gulp.series(styles, reload));
  gulp.watch('./source/*.html', gulp.series(html, reload));
  gulp.watch('./source/js/*.js', gulp.series(scripts, reload));
  gulp.watch('./source/img/**/*.{jpg,png,svg}', gulp.series(reload));
}

exports.default = gulp.series(
  clean,
  copy,
  gulp.parallel(
    createSprite,
    createWebp,
    html,
    styles,
    scripts),
  server,
  watcher
);

// Build

const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    images,
    createWebp,
    createSprite,
    html,
    styles,
    scripts
  )
);

exports.build = build;
