var gulp = require('gulp');
// var fontSpider = require('gulp-font-spider');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCss = require('gulp-clean-css');
var minifyCss = require('gulp-minify-css');
var del = require('del');


var DEST = 'dist/';
 
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
	
// gulp.task('fontspider', function() {
// 	return gulp.src('./index.html')
// 		.pipe(fontSpider());
// });

// 给js或css文件名加hash
gulp.task('css-rev', () => {
  return gulp.src(['styles/*.css'])
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))             // 添加浏览器前缀
  .pipe(gulp.dest(DEST + 'styles')) // copy original assets to dist dir
  .pipe(minifyCss())
  .pipe(rev())
  .pipe(gulp.dest(DEST + 'styles'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('rev/css')) // write manifest to dist dir
})

gulp.task('usemin', function() {
  return gulp.src(['rev/**/*.json', './*.html'])
    // 替换 html 中的静态文件引用
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
          'styles': 'styles',
          // '/js/': '/dist/js/',
          // 'cdn/': function(manifest_value) {
          //     return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
          // }
      }
    }))
    .pipe(usemin({
      css: [ rev() ],
      html: [ htmlmin({ collapseWhitespace: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ cleanCss(), 'concat' ]
    }))
    .pipe(gulp.dest(DEST));
});


// 启动本地服务，并热加载。
gulp.task('server', function(){
  gulp.src('./') //'app'
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true,
      port: 8000,
      defaultFile: 'index.html'
    }));
})

// gulp.task('default', ['sass:watch', 'fontspider']);

// 开发环境：使用 serve 启动本地服务，并监控sass
gulp.task('dev', ['server', 'sass:watch']);

// 清除 dist 文件夹中的内容
gulp.task('clean:dist', () => {
  // 清除 dist 文件夹中的内容
  del([
    // 这里我们使用一个通配模式来匹配 `dist` 文件夹中的所有东西
    'dist/**/*',
    // 我们不希望删掉这个文件，所以我们取反这个匹配模式
    // '!dist/mobile/deploy.json'
  ])

})

// 构建
gulp.task('copy', ['clean:dist'], () => {
  // 复制静态文件
  return gulp.src('./assets/**/*')
  .pipe(gulp.dest(DEST + 'assets'))
})
gulp.task('build', ['copy', 'css-rev', 'usemin'])