import plumber from "gulp-plumber";

export const json = () =>{
    return app.gulp.src(app.path.src.json)
        .pipe(plumber())
        .pipe(app.gulp.dest(app.path.build.json))
}