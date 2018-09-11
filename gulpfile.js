let gulp = require('gulp');
let del = require('del');
let exec = require('gulp-exec');
let pathToElectron = require('electron-rebuild');
let rename = require('gulp-rename');
let vinylPaths = require('vinyl-paths');

const electronVersion = '2.0.9';

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
      .pipe(exec('ng build --base-href ./'));
});

gulp.task('build-api-angular', () => {
  return gulp.src(__dirname + '/jukebox')
      .pipe(exec(`ng build --output-path=${__dirname}/JukeboxAPI/wwwroot`));
});

// Linux Build
gulp.task('build-linux', [
    'build-api-linux',
    'copy-electron-linux',
    'copy-package-json-linux',
    'copy-angular-linux',
    'rename-exe-linux'
], () => {
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


gulp.task('rename-exe-linux', ['copy-prebuilts-linux'], () => {
    return gulp.src(__dirname + '/out/linux/electron')
        .pipe(vinylPaths(del))
        .pipe(rename('Jukebox'))
        .pipe(gulp.dest(__dirname + '/out/linux/'));
});


// Win 32 Build
gulp.task('build-win32', [
    'build-api-win32',
    'copy-electron-win32',
    'copy-package-json-win32',
    'copy-angular-win32',
    'rebuild-electron-modules-win32',
    'rename-exe-win32'
], () => {
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

gulp.task('rebuild-electron-modules-win32', ['copy-prebuilts-win32'], () => {
    return pathToElectron.rebuild({
        buildPath: __dirname,
        arch: 'ia32',
        electronVersion: electronVersion
    });
});

gulp.task('rename-exe-win32', ['copy-prebuilts-win32'], () => {
    return gulp.src(__dirname + '/out/win32/electron.exe')
        .pipe(vinylPaths(del))
        .pipe(rename('Jukebox.exe'))
        .pipe(gulp.dest(__dirname + '/out/win32/'));
});

// Win 64 Build

gulp.task('build-win64', [
    'build-api-win64',
    'copy-electron-win64',
    'copy-package-json-win64',
    'copy-angular-win64',
    'rename-exe-win64'
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

gulp.task('rename-exe-win64', ['copy-prebuilts-win64'], () => {
    return gulp.src(__dirname + '/out/win64/electron.exe')
        .pipe(vinylPaths(del))
        .pipe(rename('Jukebox.exe'))
        .pipe(gulp.dest(__dirname + '/out/win64/'));
});

// Development

gulp.task('clean-dev', () => {
    return del(__dirname + '/jukebox/api');
});

gulp.task('build-api-dev', ['clean-dev', 'build-api-angular'], () => {
    return gulp.src(__dirname)
        .pipe(exec(`cd JukeboxAPI && dotnet publish -r win10-x64 -c Release -o ${__dirname}/jukebox/api/win/`));
});

// Default Task

gulp.task('default', () => {
    console.log('Tasks are : \n\t build-win64 \n\t build-win32 \n\t build-linux \n\t clean-all');
});
