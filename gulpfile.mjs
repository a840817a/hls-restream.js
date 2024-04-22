import gulp from "gulp";
import ts from "gulp-typescript";
import {deleteAsync} from "del";

const tsProject = ts.createProject("tsconfig.json");


// Task which would delete the old dist directory if present
gulp.task("build-clean", function () {
    return deleteAsync(["./dist"]);
});

// Task which would transpile typescript to javascript
gulp.task("typescript", function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
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
gulp.task("default", gulp.series("build-clean", "typescript", "views", "assets"), () => {
    console.log("Done");
});
