/* eslint-disable indent,no-unused-vars,semi */
var gulp = require('gulp'),

  sass = require('gulp-sass'),
  gulpRemoveHtml = require('gulp-remove-html'),

  combineMq = require('gulp-combine-mq'),
  cleanCss = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),

  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnanoPost = require('cssnano'),
  cssnano = require('gulp-cssnano'),
  zindex = require('postcss-zindex'),
  duplicates = require('postcss-discard-duplicates'),
  uncss = require('postcss-uncss'),

  babel = require('gulp-babel'),
    concat = require('gulp-concat'),

  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  gulpif = require('gulp-if'),
  styleInject = require('gulp-style-inject'),
  rename = require('gulp-rename'),

  changed = require('gulp-changed'),
  cache = require('gulp-cache'),
  del = require('del'),

  imagemin = require('gulp-imagemin'),
  imageminPngquant = require('imagemin-pngquant'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  webp = require('gulp-webp'),

  browserSync = require('browser-sync'),

  runSequence = require('run-sequence');

var paths = {
  mainHtml: 'Full/index.html',
  mainScss: 'Full/scss/main__template.scss',
  headerScss: 'Full/scss/header__template.scss',
  footerScss: 'Full/scss/footer__template.scss',
  allScss: 'Full/scss/**/*.scss',
  allJs: 'Full/js/*.js',
  allPhp: 'Full/**/*.php',
  allCss: 'Full/css/*.css'
};
var plugins = [
  autoprefixer(['last 2 versions', '>5%', 'IE 8', 'IE 9']),
  cssnanoPost({
    preset: 'advanced',
    safe: 'true'
  }),
  zindex(),
  duplicates(),
  uncss({
    html: [paths.mainHtml],
    ignore: ['.is-active', 'is-active', '.is-hide', ':after', ':before']
  })
];

gulp.task('sassNow', function () {
  return gulp.src(paths.mainScss)
        .pipe(sourcemaps.init())
        .pipe(changed('Full/css'))
        .pipe(sass()).on('error', console.log.bind(console))
        .pipe(postcss(plugins))
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(combineMq({
          beautify: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('Full/css'))
        .pipe(browserSync.reload({
          stream: true
        }))
});
gulp.task('sassHeader', function () {
  return gulp.src(paths.headerScss)
        .pipe(changed('Full/css'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(combineMq({
          beautify: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('Full/css'))
        .pipe(browserSync.reload({
          stream: true
        }))
});
gulp.task('sassFooter', function () {
  return gulp.src(paths.footerScss)
        .pipe(changed('Full/css'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(combineMq({
          beautify: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('Full/css'))
        .pipe(browserSync.reload({
          stream: true
        }))
});

// eslint-disable-next-line quotes
gulp.task("images", function () {
  return gulp.src('Full/img/**/*.+(png|jpg|gif|svg|ico)')
        .pipe(imagemin({
          progressive: true,
          use: [
            imageminPngquant({
              quality: '65-80'
            }),
            imageminMozjpeg({
              progressive: true
            })
          ]
        })
        )
        .pipe(gulp.dest('Clean/img'))
});
gulp.task('convertInWebP', function () {
  // return gulp.src('Full/**/*.{jpg,png}')
  return gulp.src([ '!Full/img/favicon/**/*', 'Full/**/*.{jpg,png}'])
        .pipe(webp({
          quality: 70,
          method: 6
        }))
        .pipe(gulp.dest('Clean/'))
});
gulp.task('fontsTransition', function () {
  return gulp.src('Full/fonts/**/*')
        .pipe(gulp.dest('Clean/fonts'))
});
gulp.task('videoTransition', function () {
  return gulp.src('Full/video/**/*')
        .pipe(gulp.dest('Clean/video'))
});
gulp.task('phpTransition', function () {
  return gulp.src('Full/**/*.php')
        .pipe(gulp.dest('Clean/'))
});
gulp.task('baseFileTransition', function () {
  return gulp.src('Full/*.+(png|jpg|txt|php|ttf)')
        .pipe(gulp.dest('Clean/'))
});
gulp.task('accessTransition', function () {
  return gulp.src('Full/*.htaccess')
        .pipe(gulp.dest('Clean/'))
});
gulp.task('webpTransition', function () {
  return gulp.src('Full/**/*.+(webp)')
        .pipe(gulp.dest('Clean/'))
});
gulp.task('useref', function () {
  return gulp.src('Full/*html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano({zindex: false})))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('./Clean'))
});
gulp.task('clean', function () {
  return del.sync('Clean').then(function (cb) {
    return cache.clearAll(cb)
  })
});
gulp.task('clean:dist', function () {
  return del.sync(['Clean/**/*'])
})
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'Full/'
    }
  })
});
gulp.task('inlineStyle', function () {
  return gulp.src('Clean/index.html')
        .pipe(styleInject({
          encapsulated: true,
          read: false,
          path: 'Clean/'
        }))
        .pipe(gulp.dest('Clean'))
});
gulp.task('cleaningProductHtml', function () {
  return gulp.src('Clean/*.html')
        .pipe(gulpRemoveHtml())
        .pipe(gulp.dest('Clean/'))
});
gulp.task('createIndexPhp', function () {
  return gulp.src('Clean/index.html')
        .pipe(rename('index.php'))
        .pipe(gulp.dest('Clean/'))
});

gulp.task('babel', function () {
    return gulp.src('Full/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        // .pipe(concat("main.js"))
        .pipe(gulp.dest('Full/js/afterBabel'))
});

gulp.task('watch', ['browserSync', 'sassNow', 'babel', 'images', 'fontsTransition', 'videoTransition', 'baseFileTransition'], function () {
  gulp.watch(paths.allJs, ['babel'])
  gulp.watch(paths.allScss, ["sassNow"]);
  gulp.watch(paths.mainHtml).on('change', browserSync.reload)  
  gulp.watch(paths.allPhp).on('change', browserSync.reload)
  gulp.watch(paths.allJs).on('change', browserSync.reload)
});

gulp.task('default', function (callback) {
  runSequence(['sassNow', 'browserSync', 'convertInWebP', 'watch'],
        callback
    )
});
gulp.task('build', function (callback) {
  runSequence(
        'clean:dist',
        ['sassHeader', 'sassFooter'],
        // 'babel',
        ['useref', 'images', 'convertInWebP', 'fontsTransition', 'videoTransition', 'baseFileTransition', 'phpTransition', 'webpTransition', 'accessTransition'],
        // 'babel',
        'inlineStyle',
        'cleaningProductHtml',
        callback
    )
});
