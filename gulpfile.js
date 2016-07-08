var gulp         = require('gulp');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var babel        = require("gulp-babel");
var minifyCss    = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var delay        = 500;
var dest         = "./dest/";

gulp.task('default',function(){

	gulp.src('./src/**/*.html').pipe(gulp.dest(dest));

	gulp.src(['./src/**/*.scss','./src/lib/**/*.css'])
		.pipe(sass().on('error',sass.logError))
		.pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
    	}))
		.pipe(concat('style.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest(dest+'css'));

	gulp.src(['./src/**/*.otf',
		'./src/**/*.eot',
		'./src/**/*.svg',
		'./src/**/*.ttf',
		'./src/**/*.woff',
		'./src/**/*.woff2',
		'./src/**/*.png',
		'./src/**/*.jpg',
		'./src/**/*.gif'])
		.pipe(gulp.dest(dest));
});

gulp.watch(['./src/**/*.scss','./src/lib/**/*.css'],function(event){
	console.log('rebuild file:'+event.path);
	setTimeout(function(){
		gulp.src(['./src/**/*.scss','./src/lib/**/*.css'])
			.pipe(sass().on('error',sass.logError))
			.pipe(autoprefixer({
	            browsers: ['last 2 versions', 'Android >= 4.0', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
	            cascade: true, //是否美化属性值 默认：true 像这样：
	            //-webkit-transform: rotate(45deg);
	            //        transform: rotate(45deg);
	            remove:true //是否去掉不必要的前缀 默认：true 
        	}))
			.pipe(concat('style.min.css'))
			.pipe(minifyCss())
			.pipe(gulp.dest(dest+'css'));
	},delay);
});

gulp.watch('./src/**/*.html',function(event){
	console.log('rebuild file:'+event.path);
	setTimeout(function(){
		gulp.src('./src/**/*.html').pipe(gulp.dest(dest));
	},delay);
})