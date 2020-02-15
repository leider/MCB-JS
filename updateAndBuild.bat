@echo off
:start
cls
set /p answer=Wirklich updaten? Das dauert bestimmt 15 Minuten (J):
if %answer% == J goto G
if %answer% == j goto G

exit

:G
cls
taskkill /IM MCB-APP.exe
del package-lock.json
git pull
call npm install
call npm run-script build
node electron-build-win
