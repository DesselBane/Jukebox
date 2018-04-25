
set angularDir="%~dp0..\jukebox"
set dotnetDir="%~dp0..\JukeboxAPI"
set skriptDir="%~dp0"
set projectDir="%~dp0..\"
set apiWebRootDir="%~dp0..\JukeboxAPI\wwwroot"
set angularApiDestinationDir="%~dp0..\jukebox\api\win64"
set angularApiDestinationRelPath=..\jukebox\api\win64
set angularApiDestinationOutDir=%~dp0..\out\win64\resources\app\api
set electronResourceDir="%~dp0..\out\win64\resources\app"

echo Setting up Folders
cd %projectDir%
rmdir /S /Q out
mkdir out
xcopy /e /y /q prebuilt\win64 out\win64\

if not exist %electronResourceDir% mkdir %electronResourceDir%
if not exist %angularApiDestinationOutDir% mkdir %angularApiDestinationOutDir%

echo Building Angular App
cd %angularDir%
call ng build --op=%apiWebRootDir%
call ng build --bh ./ --op=%electronResourceDir%\dist

echo Publishing dotnet API
cd %dotnetDir%
dotnet publish -r win10-x64 -c Release -o %angularApiDestinationOutDir%

echo Copying resources to electron Pre-Built

cd %angularDir%
copy main.js %electronResourceDir%
copy package.json %electronResourceDir%

cd %skriptDir%


