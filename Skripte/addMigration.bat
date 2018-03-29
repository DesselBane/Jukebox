@echo off

set migrationName=%1

cd ..\JukeboxAPI
call dotnet build
call dotnet ef migrations add %migrationName% -p ..\Jukebox.Data.SqLite\Jukebox.Data.SqLite.csproj --no-build
cd ..\Skripte