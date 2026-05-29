@echo off
cd /d C:\Users\llabr\Downloads\agentkit
set NODE_ENV=development
node_modules\.bin\tsx cli.ts run 23f880d7-2559-4178-99f7-36698d0c7d43 "What is the current time?"
