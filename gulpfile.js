let gulp = require('gulp');
let del = require('del');
let exec = require('gulp-exec');

const angularDir = __dirname + '/jukebox';
const apiDir = __dirname + '/JukeboxAPI';
const apiWebRootDir = apiDir + '/wwwroot';
const outputDir = __dirname + '/out';
const apiWin64OutDir = outputDir + '/win64/resources/app/api/win/';
const apiWin32OutDir = outputDir + '/win32/resources/app/api/win/';
const apiLinuxOutDir = outputDir + '/linux/resources/app/api/linux/';
const electronWin64PrebuiltDir = __dirname + '/prebuilt/win64/';


// Genral stuff

gulp.task('clean', () => {
  return del(outputDir);
});

gulp.task('build-electron-angular', () => {
  return gulp.src(angularDir)
    .pipe(exec('ng build --bh ./'));
});

gulp.task('build-api-angular', () => {
  return gulp.src(angularDir)
    .pipe(exec(`ng build --op=${apiWebRootDir}`));
});

// Win 64 Build

gulp.task('win64-build', ['build-api-win64', 'copy-electron-win64', 'copy-package-json-win64', 'copy-angular-win64'], () => {
  console.log('Win 64 build complete');
});

gulp.task('copy-prebuilts-win64', ['clean'], () => {
  return gulp.src(electronWin64PrebuiltDir + '/**/*')
    .pipe(gulp.dest(outputDir + '/win64/'));
});

gulp.task('build-api-win64', ['build-api-angular', 'copy-prebuilts-win64'], () => {
  return gulp.src(apiDir)
    .pipe(exec(`cd JukeboxAPI && dotnet publish -r win10-x64 -c Release -o ${apiWin64OutDir}`));
});

gulp.task('copy-electron-win64', ['copy-prebuilts-win64'], () => {
  return gulp.src(angularDir + '/main.js')
    .pipe(gulp.dest(__dirname + '/out/win64/resources/app/'))
});

gulp.task('copy-package-json-win64', ['copy-prebuilts-win64'], () => {
  return gulp.src(__dirname + '/package.json')
    .pipe(gulp.dest(__dirname + '/out/win64/resources/app/'));

});

gulp.task('copy-angular-win64', ['build-electron-angular', 'copy-prebuilts-win64'], () => {
  return gulp.src(__dirname + '/jukebox/dist/**/*')
    .pipe(gulp.dest(__dirname + '/out/win64/resources/app/dist/'));
});


// Default Task

gulp.task('default', ['win64-build'], () => {

});
