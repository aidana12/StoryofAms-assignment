var autoprefixer = require('gulp-autoprefixer'),
    bowerFiles = require('main-bower-files'),
    browser = require('browser-sync').create(),
    cleanCss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    run = require('run-sequence'),
    scss = require('gulp-sass'),
    uglify = require('gulp-uglify');

//------ Directories
var pathTo = {
    assets: './src/assets/**/*',
    dist: './dist',
    html: './src/*.html',
    js: './src/js/*.js',
    libCss: './src/lib/**/*.css',
    libJs: './src/lib/**/*.js',
    scss: './src/scss/*.scss'
};

//------ Library
var Lib = {
    js: [
        './node_modules/jquery/dist/jquery.min.js'
    ],
    css: [
        './node_modules/normalize.css/normalize.css'
    ]
};

//------ Main tasks
gulp.task('default', function (cb) {
    run(['cleanDist'], ['build'], ['serve'], ['watch'], cb);
});

gulp.task('prod', function (cb) {
    run(['cleanDist'], ['build'], cb);
});

//------ Sub tasks

//-- Clean Dist
gulp.task('cleanDist', function () {
    return del(pathTo.dist + '/')
});

//-- JS tasks
gulp.task('js', ['jsDep'], function () {
    return gulp.src(pathTo.js)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(pathTo.dist));
});
gulp.task('jsDep', function () {
    return gulp.src(Lib.js)
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(gulp.dest(pathTo.dist));
});

//-- Lib tasks
// gulp.task('bower', function () {
//     return gulp.src(bowerFiles(), {base: './bower_components'})
//         .pipe(gulp.dest('./src/lib/'));
// });

//-- CSS tasks
gulp.task('sass', ['cssDep'], function () {
    return gulp.src(pathTo.scss)
        .pipe(scss.sync({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'not ie < 11'],
            cascade: false
        }))
        .pipe(cleanCss({
            compatibility: 'ie9'
        }))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(pathTo.dist));
});
gulp.task('cssDep', function () {
    return gulp.src(Lib.css)
        .pipe(cleanCss({
            compatibility: 'ie9'
        }))
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(pathTo.dist));
});

//-- Assets tasks
gulp.task('assets', function () {
    return gulp.src(pathTo.assets)
        .pipe(gulp.dest(pathTo.dist + '/assets'));
});

//-- HTML tasks
gulp.task('html', function () {
    return gulp.src(pathTo.html)
        .pipe(gulp.dest(pathTo.dist));
});

//-- Building
gulp.task('build', ['js', 'sass', 'assets', 'html']);

//-- Serving
gulp.task('serve', function() {
    browser.init({
        server: {
            baseDir: './dist'
        }
    });
});

//-- Watching
gulp.task('watch', function () {
    gulp.watch('./src/**/**/**/**/*.*', ['build']);
});



