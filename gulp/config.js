var util = require('gulp-util');

var production = util.env.production || util.env.prod || false;
var destPath = 'build';

var config = {
    env       : 'development',
    production: production,
    root:       __dirname + '/..',
    src: {
        root         : 'src',
        templates    : 'src/nunj',
        sass         : 'src/sass',
        sassGen      : 'src/sass/generated',
        vendors      : 'src/vendors',
        temp         : 'src/temp',
        fonts        : 'src/fonts',
        js           : 'src/js',
        img          : 'src/img',
        svgIcons     : 'src/icons/svg',
        svgFont      : 'src/icons/svg-font',
        pngIcons     : 'src/icons/png'

    },
    dest: {
        root : destPath,
        html : destPath,
        css  : destPath + '/assets/css',
        js   : destPath + '/assets/js',
        img  : destPath + '/assets/img',
        fonts: destPath + '/assets/fonts',
        vendors: destPath + '/assets/vendors',
        temp : destPath + '/temp'
    },

    setEnv: function(env) {
        if (typeof env !== 'string') return;
        this.env = env;
        this.production = env === 'production';
        process.env.NODE_ENV = env;
    },

    logEnv: function() {
        util.log(
            'Environment:',
            util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
        );
    },

    errorHandler: require('./util/handle-errors')
};

config.setEnv(production ? 'production' : 'development');

module.exports = config;
