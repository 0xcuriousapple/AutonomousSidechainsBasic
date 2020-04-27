@ECHO OFF 
ECHO Mainchain test
ECHO Number of Transactions:: %1*100 
REM start cmd /k npm run dev

ECHO starting on port:: 3000
set PORT=3000
start cmd /k npm run beta


ECHO waiting for api-test-mainchain
timeout /t 5 /nobreak
start cmd /k npm run api-test-main %1


PAUSE