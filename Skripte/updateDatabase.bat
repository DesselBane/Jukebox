@echo off

cd ..\JukeboxAPI
call dotnet ef database update -p ..\SqLite\SqLite.csproj
cd ..\Skripte