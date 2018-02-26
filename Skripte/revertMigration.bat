@echo off

cd ../JukeboxAPI

call dotnet build
call dotnet ef migrations remove -p ..\SqLite\SqLite.csproj --no-build

cd ..\Skripte