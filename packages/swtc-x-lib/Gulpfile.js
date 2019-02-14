// gulp jingtum base lib to front enabled js lib
'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path');
var pkg = require('./package.json');
var webpack_config = require('./webpack.config');
var prod_webpack_config = require('./prod.webpack.config')


gulp.task('dev', function() {
	return gulp.src('index.js')
		.pipe(webpack(webpack_config))
		.pipe(gulp.dest('dist/'))
});

gulp.task('production', function() {
	return gulp.src('index.js')
		.pipe(webpack(prod_webpack_config))
		.pipe(gulp.dest('dist/'))
});

