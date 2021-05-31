// Select Dependencies
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();

// Compile scss to css
function scssTask() {
  return src("src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        autoprefixer("last 2 version", { grid: "autoplace" }),
        cssnano(),
      ])
    )
    .pipe(dest("dist/css"));
}

// Image optimization
function optimizeImage() {
  return src("src/images/*")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
}

// Browsersync task
function browsersyncTask(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task files
function watchTask() {
  watch("index.html", browsersyncReload);
  watch("src/scss/*.scss", series(scssTask, browsersyncReload));
  watch("src/images/*.{jpg, png, svg}", optimizeImage);
}

// Default gulp
exports.default = series(scssTask, optimizeImage, browsersyncTask, watchTask);
