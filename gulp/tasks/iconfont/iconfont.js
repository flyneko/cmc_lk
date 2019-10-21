var gulp         = require('gulp');
var iconfont     = require('gulp-iconfont');
var svgmin       = require('gulp-svgmin');
var consolidate  = require('gulp-consolidate');
var _            = require('lodash');
var config       = require('../../config');
// var runTimestamp = Math.round(Date.now() / 1000);

var fontProps = {
    fontName: 'iconfont',
    fontPath:  '../fonts/iconfont/',
    className: 'ticon',
    random: Math.round(Math.random() * 1000000000)
};

gulp.task('iconfont', function() {
    return gulp.src([config.src.svgFont + '/*.svg'])
        .pipe(svgmin())
        .pipe(iconfont({
            fontName: fontProps.fontName,
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            // appendUnicode: true,
            // timestamp: runTimestamp,
            normalize: true,
            fontHeight: 1001,
            fontStyle: 'normal',
            fontWeight: 'normal'
        }))
        .on('glyphs', function(glyphs, options) {
            props = _.assign(fontProps, { glyphs: glyphs });
            gulp.src(__dirname + '/_iconfont.scss')
                .pipe(consolidate('lodash', props))
                .pipe(gulp.dest(config.src.sassGen));
            // generate icons preview
            gulp.src(__dirname + '/iconfont.html')
                .pipe(consolidate('lodash', props))
                .pipe(gulp.dest(config.dest.root + '/_icons/'));
        })
        .pipe(gulp.dest(config.dest.fonts + '/' + fontProps.fontName));
});

gulp.task('iconfont:watch', function() {
    gulp.watch(config.src.svgFont + '/*.svg', ['iconfont']);
});
