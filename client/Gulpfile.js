
var gulp       = require('gulp');
var usemin     = require('gulp-usemin');
var ngAnnotate = require('gulp-ng-annotate');
var rev        = require('gulp-rev');
var minifyCss  = require('gulp-minify-css');
var sass       = require('gulp-sass');
var uglify     = require('gulp-uglify');
var imagemin   = require('gulp-imagemin');
var clean      = require('gulp-clean');
var ngHtml2Js  = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var concat     = require("gulp-concat");
var bower      = require('bower');

var paths = {
  app:{
    images           : 'app/common/images/**',
    stylesMain       : 'app/common/main.scss',
    styles           : ['!app/bower_components/**', 'app/**/**.scss'],
    fonts            : 'app/common/fonts/**',
    partials         : ['!app/bower_components/**', 'app/**/**.html'],
    fontAwesomeFonts : [
      'app/bower_components/components-font-awesome/fonts/**',
      'app/bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/**'
    ]
  },
  dist:{
    root     : 'dist',
    images   : 'dist/common/images',
    fonts    : 'dist/common/fonts'
  },
  views:{
    index : 'app/index.html',
  },
  tmp:{
    root   : '.tmp',
    styles : '.tmp/styles',
    js     : '.tmp/js',
    fonts  : '.tmp/common/fonts'
  }
};




/* Clean Directories
 *
 */
gulp.task('clean-dist', function () {
  return gulp.src(paths.dist.root, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-tmp-styles', function () {
  return gulp.src(paths.tmp.styles, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-tmp-js', function () {
  return gulp.src(paths.tmp.js, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-tmp-fonts', function () {
  return gulp.src(paths.tmp.fonts, {read: false})
    .pipe(clean({force: true}));
});




/* Tasks
 *
 */


/*
  Turn sass into css and store in .tmp folder
*/
gulp.task('make-css', ['clean-tmp-styles'], function() {
  return gulp.src(paths.app.stylesMain)
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest(paths.tmp.styles));
});

/*
  Turn templates into js and store in .tmp folder (angular temlate cache)
*/
gulp.task('make-partials-js',['clean-tmp-js'],function(){
  return gulp.src(paths.app.partials)
    .pipe(minifyHtml({
        empty  : true,
        spare  : true,
        quotes : true
    }))
    .pipe(ngHtml2Js({
      moduleName : 'dePartials',
      prefix     : "/"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest(paths.tmp.js));
});




/*
  Usemin (blocks are defined in index.html)
  This guy builds and optimizes all js, css, and js-partials
*/
gulp.task('usemin', function() {
  gulp.src(paths.views.index)
    .pipe(usemin({
      cssVendor:  [minifyCss(),  'concat', rev() ],
      cssClient:  [minifyCss(),  rev() ],
      jsVendor:   [uglify(),     rev() ],
      jsClient:   [ngAnnotate(), uglify(), rev() ],
      jsPartials: [uglify(),     rev() ]
    }))
    .pipe(gulp.dest(paths.dist.root));
});


/*
  Optimize images and store in dist folder
*/
gulp.task('images', function() {
  return gulp.src(paths.app.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.dist.images));
});




/*
  Fonts
*/
gulp.task('fonts',function() {
  return gulp.src(paths.app.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
});

/* Not so clean but whatever */
gulp.task('font-awesome-fonts',function(){
  return gulp.src(paths.app.fontAwesomeFonts)
    .pipe(gulp.dest(paths.dist.fonts));
});

/* Move fonts */
gulp.task('font-awesome-fonts-tmp',['clean-tmp-fonts'],function(){
  return gulp.src(paths.app.fontAwesomeFonts)
    .pipe(gulp.dest(paths.tmp.fonts));
});


/* Helpers
 *
 */

/* Watch Changes to Sass files and generate css */
gulp.task('watch-dev', function() {
  gulp.watch(paths.app.styles,  ['make-css']);
  gulp.watch(paths.app.partials,['make-partials-js']);
});


/* Automatically install new bower dependencies (if they are not already installed) */
gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb();
    });
});






/* Cli Api
 *
 */
gulp.task('dev',['make-css','make-partials-js','watch-dev','font-awesome-fonts-tmp']);


gulp.task('build',['bower','make-css','make-partials-js','clean-dist'],function(){
  gulp.start(
    'usemin',
    'fonts',
    'font-awesome-fonts',
    'images'//,
    //'partials'
  );
});



