var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-csso'),
    gulpCopy = require('gulp-copy'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    nodemon = require('nodemon'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat-multi'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    babel = require('gulp-babel'),
    jade = require('gulp-jade'),
    concatCss = require('gulp-concat-css');

gulp
    .task('clean', function() {
        return gulp.src('public', { read: false })
            .pipe(clean());
    })
    .task('copy', function() {
        return gulp.src(['assets/vendors/js/*.js', 'assets/vendors/images/*.*'])
            .pipe(gulpCopy('public', { prefix: 2 }));
    })
    .task('concatcss', function() {
        return gulp.src('assets/vendors/css/*.css')
            .pipe(concatCss('libs.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest('public/css'))
            .pipe(livereload());
    })
    .task('jade', function() {
        return gulp.src('assets/views/index.jade')
            .pipe(jade())
            .pipe(gulp.dest('public/'))
            .pipe(livereload());
    })
    .task('sass', function() {
        return gulp.src('assets/css/*.scss')
            .pipe(sass())
            .pipe(minifyCSS())
            .pipe(gulp.dest('public/css'))
            .pipe(livereload());
    })
    .task('concat', function() {
        concat({
                'libs.js': [
                    'assets/js/libs/jquery.min.js'
                ],
                'min.js': [
                    'assets/js/tools/*.js',
                    'assets/js/settings.js',
                    'assets/js/plugins/*.js',
                    'assets/js/app.js'
                ]
            })
            .pipe(uglify())
            .pipe(gulp.dest('public/js'))
            .pipe(livereload());
    })
    .task('webserver', function() {
        gulp.src('public')
            .pipe(webserver({
                host: 'localhost',
                port: 3000,
                livereload: true,
                directoryListing: false
            }));
    })
    .task('watch', function(done) {
        gulp.watch('assets/views/**/*.jade', ['jade']);
        gulp.watch('assets/sass/*.scss', ['sass']);
        gulp.watch('assets/js/react/*.jsx', ['react']);
        gulp.watch('assets/js/*.js', ['concat']);
    })
    .task('default', function(done) {
        runSequence('clean', 'copy', 'concatcss', 'jade', 'sass', 'concat', 'webserver', 'watch', function() {
            done();
        });
    });
