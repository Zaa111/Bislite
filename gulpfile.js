'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var del = require('del');
var server = require("browser-sync").create();
var htmlmin = require('gulp-htmlmin');


gulp.task('style', function() {
    return gulp.src('source/less/style.less')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(server.stream());
});


gulp.task('images', function() {
    return gulp.src('source/img/**/*.{png,jpg,svg}')
        .pipe(imagemin([
            imagemin.optipng({ optimizayionLevel: 3 }),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('source/img'));
});


gulp.task('webp', function() {
    return gulp.src('source/img/**/*.{png,jpg}')
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest('source/img'));
});


gulp.task('html', function() {
    return gulp.src('source/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        // .pipe(rename(function(path) {
        //     path.basename += '.min'
        //   }))
        .pipe(gulp.dest('build'));
});


gulp.task('clean', function() {
    return del('build');
});


gulp.task('copy', function() {
    return gulp.src([
        'source/fonts/**/*.{woff,woff2}',
        'source/img/**',
        'source/js/**'
    ], {
        base: 'source'
    })
        .pipe(gulp.dest('build'));
});


gulp.task('serve', function() {
    server.init({
        server: 'build/',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });
    gulp.watch("source/less/**/*.less",gulp.series('style'));
    gulp.watch("source/*.html",gulp.series('html','refresh'));
});


gulp.task("refresh", function(done) {
    server.reload();
    done();
});


gulp.task('build',gulp.series('clean','copy','style','images','webp','html'));
gulp.task('start',gulp.series('build','serve'));