const gulp        = require('gulp');
const runSequence = require('run-sequence');
const config      = require('../config');
const del         = require('del');

gulp.task('default', function(cb) {
    del(config.dest.root + '/**/*').then(function () {
        runSequence(
            'nunjucks',
            'iconfont',
            'sass',
            'sprite:svg',
            'sprite:png',
            'watch',
            'copy',
            cb
        );
    });
});
