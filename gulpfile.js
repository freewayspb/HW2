"use strict";

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    rename = require("gulp-rename"),
    path = require('path'),
    minifyCss = require('gulp-minify-css'),
    LessPluginCleanCSS = require("less-plugin-clean-css"),
    cleancss = new LessPluginCleanCSS({advanced: true}),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin');

// Компилируем Jade
gulp.task('jade', function () {
    gulp.src(['./app/jade/*.jade', '!./app/jade/_*.jade'])
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./app/jade/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(gulp.dest('./www')) // Записываем собранные файлы
        .pipe(connect.reload()); // даем команду на перезагрузку страницы
});

// Собираем JS
gulp.task('js', function () {
    gulp.src(['./app/js/_modules/*.js', '!./app/js/vendor/**/*.js'])
        .pipe(concat('scripts.js')) // Собираем все JS, кроме тех которые находятся в /app/js/vendor/**
        .pipe(gulp.dest('./www/js/_modules'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('www/js'))
        .pipe(connect.reload()); // даем команду на перезагрузку страницы
});
// собираем и минифицируем JS plugins
gulp.task('compress-plugins', function() {
    gulp.src('./app/js/_plugins/*.js')
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('www/js/_plugins'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('www/js'));
});
// Компилируем LESS

gulp.task('less', function () {
    gulp.src(['./app/less/*.less', '!./app/less/_*.less'])
        .pipe(less())
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(gulp.dest('./www/css'))
        .pipe(connect.reload());
});


// Копируем и минимизируем изображения
gulp.task('images', function () {
    gulp.src('./app/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./www/img'))

});

// Сборка проекта из Вэбинара Дмитрия от 25.12.2014
gulp.task('dist', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('www'));
});
// Work with bower
gulp.task('wiredep', function () {
    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower'
        }))
        .pipe(gulp.dest('www'));
});

// Server
gulp.task('connect', function () {
    connect.server({
        root: 'www',
        livereload: true
    });
    opn('http://localhost:8080/');
});

// html
gulp.task('html', function () {
    gulp.src('app/*.html')
        .pipe(connect.reload());
})

// js
//gulp.task('js', function () {
//    gulp.src('app/js/*.js')
//        .pipe(concat('script.js'))
//        .pipe(gulp.dest('www/js'))
//        .pipe(connect.reload());
//})

// css
gulp.task('css', function () {
    gulp.src('app/css/*.css')
        .pipe(connect.reload());
})

// Слежка за изменением файлов проекта и пересборка
gulp.task('watch', function () {
    //gulp.watch(['app/*.html'], ['html']);
    gulp.watch(['app/css/*.css'], ['css']);
    gulp.watch(['app/less/*.less'], ['less']);
    gulp.watch(['app/js/*.js'], ['js']);
    gulp.watch(['app/js/vendor/*.js'], ['compress-plugins']);
    gulp.watch('bower.json', ['wiredep']);
    gulp.watch(['app/jade/**/*.jade'], ['jade']);
})

// Default
gulp.task('default', ['connect', 'watch']);