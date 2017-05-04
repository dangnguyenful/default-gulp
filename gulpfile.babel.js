import gulp from 'gulp';
import sass from 'gulp-sass';
import minifyCSS from 'gulp-csso';
import gulpCopy from 'gulp-copy';
import clean from 'gulp-clean';
import runSequence from 'run-sequence';
import watch from 'gulp-watch';
import concat from 'gulp-concat-multi';
import uglify from 'gulp-uglify';
import livereload from 'gulp-livereload';
import webserver from 'gulp-webserver';
import babel from 'gulp-babel';
import jade from 'gulp-jade';
import concatCss from 'gulp-concat-css';

gulp
    .task('clean', () => gulp.src('public', { read: false })
    .pipe(clean()))
    .task('copy', () => gulp.src(['assets/vendors/js/*.js', 'assets/vendors/images/*.*'])
    .pipe(gulpCopy('public', { prefix: 2 })))
    .task('concatcss', () => gulp.src('assets/vendors/css/*.css')
    .pipe(concatCss('libs.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'))
    .pipe(livereload()))
    .task('jade', () => gulp.src('assets/views/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('public/'))
    .pipe(livereload()))
    .task('sass', () => gulp.src('assets/css/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'))
    .pipe(livereload()))
    .task('concat', () => {
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
    .task('webserver', () => {
        gulp.src('public')
            .pipe(webserver({
                host: 'localhost',
                port: 3000,
                livereload: true,
                directoryListing: false
            }));
    })
    .task('watch', done => {
        gulp.watch('assets/views/**/*.jade', ['jade']);
        gulp.watch('assets/sass/*.scss', ['sass']);
        gulp.watch('assets/js/react/*.jsx', ['react']);
        gulp.watch('assets/js/*.js', ['concat']);
    })
    .task('default', done => {
        runSequence('clean', 'copy', 'concatcss', 'jade', 'sass', 'concat', 'webserver', 'watch', () => {
            done();
        });
    });
