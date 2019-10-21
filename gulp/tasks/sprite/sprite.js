// Load in our dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var config         = require('../../config');


gulp.task('sprite:png', function() {
    var spriteData = gulp.src(config.src.pngIcons + '/*.png')
        .pipe(spritesmith({
            imgName: 'spritesheet.png',
            cssName: '_sprite-png.sass',
            cssTemplate: 'gulp/tasks/sprite/sass.template.mustache'
        }));

    // Deliver spritesheets to `dist/` folder as they are completed
    spriteData.img.pipe(gulp.dest(config.dest.img + '/'));

    // Deliver CSS to `./` to be imported by `index.scss`
    spriteData.css.pipe(gulp.dest(config.src.sassGen + '/'));
});