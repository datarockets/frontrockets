var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var filesIn = function(path, ext, arr) {
    var iterator = function(item) {
        return path + '/' + item + '.' + ext;
    };

    return arr.map(iterator);
};

gulp.task('scripts', function() {
    var files = filesIn('src/javascripts', 'js', [
        'patches/**/*',
        'core',
        'core/module',
        'core/modules',
        'core/middleware',
        'core/world',
        'utilities/**/*'
    ]);

    gulp
        .src(files)
        .pipe(plugins.concat('main.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('stylesheets', function() {
    var files = filesIn('src/stylesheets', 'css', [
        'reset'
    ]);

    gulp
        .src(files)
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('dist'));
});

// Export

gulp.task('build', ['scripts', 'stylesheets']);

gulp.task('default', ['build']);
