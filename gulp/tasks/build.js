var gulp        = require('gulp');
var runSequence = require('run-sequence');
var config      = require('../config');

function build(cb) {
    runSequence(
        'nunjucks',
        'iconfont',
        'sass',
        'sprite:svg',
        'sprite:png',
        'copy',
        cb
    );
}

gulp.task('build', function(cb) {
    config.setEnv('production');
    config.logEnv();
    build(function () {
        runSequence('tinypng', cb)
    });
});

gulp.task('build:dev', function(cb) {
    config.setEnv('development');
    config.logEnv();
    build(cb);
});
