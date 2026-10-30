import gulp from "gulp";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {deleteAsync} from "del";


// Task which would delete the old dist directory if present
gulp.task("build-clean", function () {
    return deleteAsync(["./dist"]);
});

// Task which would transpile typescript to javascript
gulp.task("typescript", function () {
    return promisify(execFile)("./node_modules/.bin/tsc", ["-p", "tsconfig.json"]);
});

gulp.task("video-js", function () {
    return gulp.src("./node_modules/@videojs/cdn/**/*").pipe(gulp.dest("./dist/website/assets/video-js"));
});

gulp.task("bootstrap", function () {
    return gulp.src("./node_modules/bootstrap/dist/**/*").pipe(gulp.dest("./dist/website/assets/bootstrap"));
});

// Task which would just create a copy of the current views directory in dist directory
gulp.task("views", function () {
    return gulp.src("./src/website/views/**/*.ejs").pipe(gulp.dest("./dist/website/views"));
});

// Task which would just create a copy of the current static assets directory in dist directory
gulp.task("assets", function () {
    return gulp.src("./src/website/assets/**/*").pipe(gulp.dest("./dist/website/assets"));
});

// The default task which runs at start of the gulpfile.mjs
gulp.task("default", gulp.series("build-clean", "typescript", "video-js", "bootstrap", "views", "assets"), () => {
    console.log("Done");
});
