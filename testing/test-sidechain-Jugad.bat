@ECHO OFF 
REM cd base
REM first run Local host at 3000 manually then run this file as Test.bat 5 [number of nodes]
REM store and run the file from base directory with number of nodes as argument
REM Script runs both the test files change 
::  %1 is argument from command line i.e number of nodes to be created
ECHO Mainchain
ECHO starting on port:: 3000
set PORT=3000
start /HIGH cmd /k npm run beta

ECHO Number of Sidechains:: %1 
@set a=3001
@set b=%1
@set /a "c=%a%+%b%"
echo %c% %a%
REM start cmd /k npm run dev

FOR /L %%A IN (%a%,1,%c%) DO (
    ECHO Sidechain
    ECHO starting on port:: %%A
    timeout /t 5 /nobreak
    set PORT=%%A
    REM Create nodes
    start /HIGH cmd /k npm run beta 
)

ECHO waiting for api-test-sidechain
timeout /t 9 /nobreak
start /HIGH cmd /k npm run api-test-side %1


PAUSE