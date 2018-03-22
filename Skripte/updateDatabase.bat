@echo off

cd ..\JukeboxAPI
call dotnet ef database update -p ..\Jukebox.Data.SqLite\Jukebox.Data.SqLite.csproj
cd ..\Skripte