let gulp = require('gulp');
let del = require('del');
let exec = require('gulp-exec');
let pathToElectron = require('electron-rebuild');
let merge = require('merge-stream');

const electronVersion = '1.8.6';

// Genral stuff

gulp.task('clean-all', ['clean-electron-angular', 'clean-api-angular', 'clean-win32', 'clean-win64', 'clean-linux'], () => {
  console.log('All clean now!');
});

gulp.task('clean-electron-angular', () => {
  return del(__dirname + '/jukebox/dist');
});

gulp.task('clean-api-angular', () => {
  return del(__dirname + '/JukeboxAPI/wwwroot');
});

gulp.task('build-electron-angular', () => {
  return gulp.src(__dirname)
    .pipe(exec('ng build --bh ./'));
});

gulp.task('build-api-angular', () => {
  return gulp.src(__dirname + '/jukebox')
    .pipe(exec(`ng build --op=${__dirname}/JukeboxAPI/wwwroot`));
});

// Linux Build
gulp.task('build-linux', ['build-api-linux', 'copy-electron-linux', 'copy-package-json-linux', 'copy-angular-linux'], () => {
  console.log('Linux build complete');
});

gulp.task('clean-linux', () => {
  return del(__dirname + '/out/linux');
});

gulp.task('copy-prebuilts-linux', ['clean-linux'], () => {
  return gulp.src(__dirname + '/prebuilt/linux/**/*')
    .pipe(gulp.dest(__dirname + '/out/linux/'));
});

gulp.task('build-api-linux', ['build-api-angular', 'copy-prebuilts-linux'], () => {
  return gulp.src(__dirname)
    .pipe(exec(`cd JukeboxAPI && dotnet publish -r linux-x64 -c Release -o ${__dirname}/out/linux/resources/app/api/linux/`));
});

gulp.task('copy-electron-linux', ['copy-prebuilts-linux'], () => {
  return gulp.src(__dirname + '/jukebox/main.js')
    .pipe(gulp.dest(__dirname + '/out/linux/resources/app/'))
});

gulp.task('copy-package-json-linux', ['copy-prebuilts-linux'], () => {
  return gulp.src(__dirname + '/package.json')
    .pipe(gulp.dest(__dirname + '/out/linux/resources/app/'));

});

gulp.task('copy-angular-linux', ['build-electron-angular', 'copy-prebuilts-linux'], () => {
  return gulp.src(__dirname + '/jukebox/dist/**/*')
    .pipe(gulp.dest(__dirname + '/out/linux/resources/app/dist/'));
});


// Win 32 Build
gulp.task('build-win32', ['build-api-win32', 'copy-electron-win32', 'copy-package-json-win32', 'copy-angular-win32'], () => {
  console.log('Win 32 build complete');
});

gulp.task('clean-win32', () => {
  return del(__dirname + '/out/win32');
});

gulp.task('copy-prebuilts-win32', ['clean-win32'], () => {
  return gulp.src(__dirname + '/prebuilt/win32/**/*')
    .pipe(gulp.dest(__dirname + '/out/win32/'));
});

gulp.task('build-api-win32', ['build-api-angular', 'copy-prebuilts-win32'], () => {
  return gulp.src(__dirname)
    .pipe(exec(`cd JukeboxAPI && dotnet publish -r win10-x86 -c Release -o ${__dirname}/out/win32/resources/app/api/win/`));
});

gulp.task('copy-electron-win32', ['copy-prebuilts-win32'], () => {
  return gulp.src(__dirname + '/jukebox/main.js')
    .pipe(gulp.dest(__dirname + '/out/win32/resources/app/'))
});

gulp.task('copy-package-json-win32', ['copy-prebuilts-win32'], () => {
  return gulp.src(__dirname + '/package.json')
    .pipe(gulp.dest(__dirname + '/out/win32/resources/app/'));

});

gulp.task('copy-angular-win32', ['build-electron-angular', 'copy-prebuilts-win32'], () => {
  return gulp.src(__dirname + '/jukebox/dist/**/*')
    .pipe(gulp.dest(__dirname + '/out/win32/resources/app/dist/'));
});

// Win 64 Build

gulp.task('build-win64', [
    'build-api-win64',
    'copy-electron-win64',
    'copy-package-json-win64',
    'copy-angular-win64',
    'copy-rebuilt-electron-modules-win64',
    'copy-node_modules-win64'
], () => {
  console.log('Win 64 build complete');
});

gulp.task('clean-win64', () => {
  return del(__dirname + '/out/win64');
});

gulp.task('copy-prebuilts-win64', ['clean-win64'], () => {
  return gulp.src(__dirname + '/prebuilt/win64/**/*')
    .pipe(gulp.dest(__dirname + '/out/win64/'));
});

gulp.task('rebuild-electron-modules-win64', ['copy-prebuilts-win64'], () => {
    return pathToElectron.rebuild({
        buildPath: __dirname,
        arch: 'x64',
        electronVersion: electronVersion
    });
});

gulp.task('copy-rebuilt-electron-modules-win64', ['rebuild-electron-modules-win64'], () => {
    let appmodel = gulp.src(`${__dirname}/node_modules/@nodert-win10-au/windows.applicationmodel/bin/win32-x64-57/windows.applicationmodel.node`)
        .pipe(gulp.dest(__dirname + '/out/win64/'));

    let dataXmlDom = gulp.src(__dirname + '/node_modules/@nodert-win10-au/windows.data.xml.dom/bin/win32-x64-57/windows.data.xml.dom.node')
        .pipe(gulp.dest(__dirname + '/out/win64/'));

    let foundation = gulp.src(__dirname + '/node_modules/@nodert-win10-au/windows.foundation/bin/win32-x64-57/windows.foundation.node')
        .pipe(gulp.dest(__dirname + '/out/win64/'));

    let uiNotifications = gulp.src(__dirname + '/node_modules/@nodert-win10-au/windows.ui.notifications/bin/win32-x64-57/windows.ui.notifications.node')
        .pipe(gulp.dest(__dirname + '/out/win64/'));

    let uiStartscreen = gulp.src(__dirname + '/node_modules/@nodert-win10-au/windows.ui.startscreen/bin/win32-x64-57/windows.ui.startscreen.node')
        .pipe(gulp.dest(__dirname + '/out/win64/'));

    return merge(appmodel, dataXmlDom, foundation, uiNotifications, uiStartscreen);
});

gulp.task('build-api-win64', ['build-api-angular', 'copy-prebuilts-win64'], () => {
  return gulp.src(__dirname)
    .pipe(exec(`cd JukeboxAPI && dotnet publish -r win10-x64 -c Release -o ${__dirname}/out/win64/resources/app/api/win/`));
});

gulp.task('copy-electron-win64', ['copy-prebuilts-win64'], () => {
    return gulp.src(__dirname + '/jukebox/main.js')
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

gulp.task('copy-node_modules-win64', ['copy-prebuilts-win64'], () => {
    let windowsNotifications = gulp.src(__dirname + '/node_modules/electron-windows-notifications/**/*')
        .pipe(gulp.dest(__dirname + '/out/win64/resources/app/node_modules/electron-windows-notifications/'));
    let debug = gulp.src(__dirname + '/node_modules/debug/**/*')
        .pipe(gulp.dest(__dirname + '/out/win64/resources/app/node_modules/debug/'));
    let ms = gulp.src(__dirname + '/node_modules/ms/**/*')
        .pipe(gulp.dest(__dirname + '/out/win64/resources/app/node_modules/ms/'));


    return merge(windowsNotifications, debug, ms);
});

// Default Task

gulp.task('default', () => {
    console.log('Tasks are : \n\t build-win64 \n\t build-win32 \n\t build-linux \n\t clean-all');
});
