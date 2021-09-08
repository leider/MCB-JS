@echo off
:start
cls
set /p answer=Wirklich updaten? Das dauert bestimmt 5 Minuten (J):
if %answer% == J goto G
if %answer% == j goto G

exit

:G
cls
taskkill /IM MCB-APP.exe
git checkout -- package-lock.json
git pull
call npm ci
call npm run-script build
node electron-build-win
