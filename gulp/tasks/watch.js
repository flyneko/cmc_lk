var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch',  ['nunjucks:watch', 'sass:watch', 'sprite:svg:watch', 'iconfont:watch', 'copy:watch']);
