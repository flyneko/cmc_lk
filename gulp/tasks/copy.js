const fs = require('fs');
const gulp   = require('gulp');
const config = require('../config.js');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const svgo = require('gulp-svgo');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const rename = require("gulp-rename");
const vendors = JSON.parse(fs.readFileSync(config.src.root + '/vendors.json'));

gulp.task('copy:temp', function() {
    return gulp
        .src(config.src.temp + '/**/*.*')
        .pipe(gulp.dest(config.dest.temp));
});

gulp.task('copy:fonts', function() {
    return gulp
        .src(config.src.fonts + '/**/*.{ttf,eot,woff,woff2}')
        .pipe(rename(function (path) {
            path.basename = path.dirname;
        }))
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy:js', function() {
    return gulp
        .src(config.src.js + '/**/*.*')
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('copy:libs', function() {
    var js = [],
        css = [];

    for (var vendor in vendors) {
        vendors[vendor].forEach(function (j) {
            j = config.root + '/node_modules/' + vendor + '/' + j;
            if (/\.css$/i.test(j))
                css.push(j);
            if (/\.js$/i.test(j))
                js.push(j);

            var pathArr = j.split('/');
            gulp.src(j + '/**/*').pipe(gulp.dest(config.dest.vendors + '/' + vendor + '/' + pathArr[pathArr.length - 1]));

            //if (fs.lstatSync(j).isDirectory()) {
             //   var pathArr = j.split('/');
             //   gulp.src(j + '/**/*').pipe(gulp.dest(config.dest.vendors + '/' + vendor + '/' + pathArr[pathArr.length - 1]));
            //}
        })
    }

    gulp.src(js)
        .pipe(concat('vendors.min.js'))
        .pipe(minify({ ext: {min: '.js'}, noSource: true}))
        .pipe(gulp.dest(config.dest.js));
    gulp.src(css)
        .pipe(concat('vendors.min.css'))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('copy:img', function() {
    return gulp
        .src([
            config.src.img + '/**/*.{jpg,png,jpeg,svg,gif}',
            '!' + config.src.img + '/svgo/**/*.*'
        ])
        .pipe(svgo())
        .pipe(gulp.dest(config.dest.img));
});

gulp.task('copy', [
    'copy:img',
    'copy:fonts',
    'copy:js',
    'copy:libs',
    'copy:temp'
]);

gulp.task('copy:watch', function() {
    gulp.watch(config.src.img + '/**/*.*', ['copy:img']);
    gulp.watch(config.src.js + '/**/*.*', ['copy:js']);
    gulp.watch(config.src.root + '/vendors.json', ['copy:libs']);
    gulp.watch(config.src.temp + '/**/*.*', ['copy:temp']);
});
