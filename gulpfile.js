var gulp = require("gulp"),

    sass = require("gulp-sass"),
    pug = require("pug"),
    htmlmin = require("gulp-htmlmin"),
    gulpRemoveHtml = require('gulp-remove-html'),

    uncss = require("gulp-uncss"),
    autoprefixer = require("gulp-autoprefixer"),
    combineMq = require("gulp-combine-mq"),
    cleanCss = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),

    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    styleInject = require("gulp-style-inject"),
    rename = require("gulp-rename"),

    changed = require('gulp-changed'),
    cache = require("gulp-cache"),
    del = require("del"),

    imagemin = require("gulp-imagemin"),
    imageminSvgo = require("imagemin-svgo"),
    imageminPngquant = require('imagemin-pngquant'),
    imageminWebp = require('imagemin-webp'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    webp = require('gulp-webp'),

    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),

    browserSync = require("browser-sync"),
    connect = require('gulp-connect-php'),

    runSequence = require("run-sequence");

var paths = {
    mainHtml: "Full/index.html",
    allHtml: "Full/**/*.html",
    mainScss: "Full/scss/main__template.scss",
    headerScss: "Full/scss/header__template.scss",
    footerScss: "Full/scss/footer__template.scss",
    allScss: "Full/scss/**/*.scss",
    allJs: "Full/js/**/*.js",
    mainPhp: "Full/index.php",
    allPhp: "Full/**/*.php",
    allCss: "Full/css/*.css"
}

gulp.task("sassNow", function () {
    return gulp.src(paths.mainScss)
        .pipe(changed('Full/css'))
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', console.log.bind(console))
        .pipe(autoprefixer({browsers: ['last 2 versions', '>5%', 'IE 8', 'IE 9']}))
        .pipe(cleanCss({compatibility: "ie8"}))
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(uncss({
            html: [paths.mainHtml],
            ignore: [/\.is-active/, /\.is-hide/]
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("Full/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task("sassHeader", function () {
    return gulp.src(paths.headerScss)
        .pipe(changed('Full/css'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 2 versions', '>5%', 'IE 8', 'IE 9']}))
        .pipe(cleanCss({compatibility: "ie8"}))
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(uncss({
            html: [paths.mainHtml],
            ignore: [/\.is-active/, /\.is-hide/]
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("Full/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task("sassFooter", function () {
    return gulp.src(paths.footerScss)
        .pipe(changed('Full/css'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 2 versions', '>5%', 'IE 8', 'IE 9']}))
        .pipe(cleanCss({compatibility: "ie8"}))
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(uncss({
            html: [paths.mainHtml],
            ignore: [/\.is-active/, /\.is-hide/]
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("Full/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task("images", function () {
    return gulp.src("Full/img/**/*.+(png|jpg|gif|svg|ico)")
        .pipe(cache(imagemin({
            progressive: true,
            progressive: true,
            imageminSvgo: {removeViewBox: false, cleanupAttrs: false},
            use: [
                    imageminPngquant({
                        quality: '65-80'
                    }),
                    imageminMozjpeg({
                        progressive: true
                    })
                ]
            })
        ))
        .pipe(gulp.dest("Clean/img"));
});
gulp.task('convertInWebP', function () {
    return gulp.src('Full/**/*.{jpg,png}')
        .pipe(webp({
            quality: 70,
            method: 6
        }))
        .pipe(gulp.dest('Clean/'))
});

gulp.task("fontsTransition", function () {
    return gulp.src("Full/fonts/**/*")
        .pipe(gulp.dest("Clean/fonts"))
});
gulp.task("videoTransition", function () {
    return gulp.src("Full/video/**/*")
        .pipe(gulp.dest("Clean/video"))
});
gulp.task("phpTransition", function () {
    return gulp.src("Full/**/*.php")
        .pipe(gulp.dest("Clean/"))
});
gulp.task("baseFileTransition", function () {
    return gulp.src("Full/*.+(png|jpg|txt|php|ttf)")
        .pipe(gulp.dest("Clean/"))
});
gulp.task("accessTransition", function () {
    return gulp.src("Full/*.htaccess")
        .pipe(gulp.dest("Clean/"))
});
gulp.task("webpTransition", function () {
    return gulp.src("Full/**/*.+(webp)")
        .pipe(gulp.dest("Clean/"))
});

gulp.task("useref", function () {
    return gulp.src("Full/*html")
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano({zindex: false})))
        .pipe(gulp.dest('./Clean'));
});
gulp.task("clean", function () {
    return del.sync("Clean").then(function (cb) {
        return cache.clearAll(cb);
    });
});
gulp.task("clean:dist", function () {
    return del.sync(['Clean/**/*']);
});
gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: "Full/"
        }
        // proxy: "jump.dev"
    })
});
gulp.task("inlineStyle", function () {
    return gulp.src("Clean/index.html")
        .pipe(styleInject({
            encapsulated: true,
            read: false,
            path: 'Clean/'
        }))
        .pipe(gulp.dest("Clean"));
});
gulp.task('cleaningProductHtml', function () {
    return gulp.src('Clean/*.html')
        .pipe(gulpRemoveHtml())
        .pipe(gulp.dest('Clean/'));
});
gulp.task("createIndexPhp", function () {
    return gulp.src('Clean/index.html')
        .pipe(rename('index.php'))
        .pipe(gulp.dest('Clean/'));
})


gulp.task("watch", ["browserSync", "sassNow", "images", "fontsTransition", "videoTransition", "baseFileTransition"], function () {
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
        ['sassHeader', 'sassFooter', 'useref', 'images', 'convertInWebP', 'fontsTransition', 'videoTransition', "baseFileTransition", "phpTransition", "webpTransition", "accessTransition"],
        'inlineStyle',
        'cleaningProductHtml',
        // If need convert in index.php
        // 'createIndexPhp',
        callback
    )
});

