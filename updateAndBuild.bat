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
git pull
git checkout -- package-lock.json
call npm install
call npm run-script build
node electron-build-win
