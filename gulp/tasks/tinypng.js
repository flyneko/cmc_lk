var gulp   = require('gulp');
var config = require('../config.js');
var tinypng = require('gulp-tinypng');

gulp.task('tinypng', function() {
    return gulp
        .src([
            config.src.img + '/**/*.{jpg,png,jpeg,gif}',
            '!' + config.src.img + '/svgo/**/*.*'
        ])
        .pipe(tinypng('wbS74Clk8brcwdwsvaFbJL198jsee3Qr'))
        .pipe(gulp.dest(config.dest.img));
});