var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

gulp.task('css', function() {
  return gulp.src('src/*.css')
    .pipe(concat('jquery.analogtimepicker.css'))
    .pipe(gulp.dest('dist'))
    .pipe(minifyCss())
    .pipe(rename('jquery.analogtimepicker.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('jquery.analogtimepicker.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('jquery.analogtimepicker.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['css', 'js']);