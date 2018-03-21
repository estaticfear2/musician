"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const del = require("del");
const debug = require("gulp-debug");
const newer = require("gulp-newer");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
var htmlmin = require("gulp-htmlmin");
var uglify = require('gulp-uglify');
var minify = require("gulp-csso");

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

function lazyRequireTask(taskName, path) {
  gulp.task(taskName, function(callback){
    let task = require(path).call(this);
    
    return task(callback);
  });
}

lazyRequireTask("hello", "./tasks/hello");

gulp.task("styles", function() {
  return gulp.src("sass/style.scss")
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "Styles",
          message: err.message
        };
      })
    }))
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulpif(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("clean", function(){
  return del("build");
});

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

gulp.task("js", function () {
  return gulp.src([
    "js/*.js"
  ])
  .pipe(uglify())
  .pipe(gulp.dest("build/js"));
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**"
  ],               
    {base: "."},
    {since: gulp.lastRun("copy")}
    )
  .pipe(newer("build"))
  .pipe(debug({title: "copy"}))
  .pipe(gulp.dest("build"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(svgmin({
      plugins: [{
        removeUselessDefs: true
      }, {
        removeEditorsNSData: true
      }, {
        convertStyleToAttrs: true
      }, {
        removeUselessStrokeAndFill: true
      }, {
        cleanupIDs: true
      }, {
        removeStyleElement: true
      }, {
        removeUnknownsAndDefaults: true
      }, {
        removeMetadata: true
      }]
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("build", gulp.series("clean", "html", "js", gulp.parallel("styles", "copy"), gulp.series("symbols")));

gulp.task("watch", function() {
  gulp.watch("sass/**/*.scss", gulp.series("styles"));
  gulp.watch("*.html", gulp.series("html"));
  gulp.watch("js/*.js", gulp.series("js"));
});

gulp.task("serve", function() {
  browserSync.init({
    server: "build"
  });  
  browserSync.watch("build/**/*.*").on("change", browserSync.reload);
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));

