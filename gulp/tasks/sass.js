var gulp         = require('gulp');
var sass         = require('gulp-sass');
var config         = require('../config');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var base64 = require('gulp-base64-inline');
var sassGlob        = require('gulp-sass-glob');
var processors = [
    autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    })
];
gulp.task('sass', function() {
    return gulp
        .src(config.src.sass + '/*.sass')
        .pipe(sassGlob())
        .pipe(sass({
            outputStyle: config.production ? 'compact' : 'expanded', // nested, expanded, compact, compressed
            precision: 5
        }))
        .on('error', function (err) {
            console.log(err.toString());
        })
        .pipe(base64('..'))
        .pipe(postcss(processors))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('sass:watch', function() {
    gulp.watch(config.src.sass + '/**/*.{sass,scss}', ['sass']);
});