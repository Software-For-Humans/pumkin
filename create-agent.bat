@echo off
cd /d C:\Users\llabr\Downloads\agentkit
set NODE_ENV=development
set NAME=time-bot
set MODEL=qwen2.5-coder:7b
set SYSTEM_PROMPT=You are a concise assistant. Use the get_time tool when the user asks about time.
set BUILTIN_TOOLS=get_time
set MCP_SERVERS=
set MAX_STEPS=5
set TEMPERATURE=0.1
node_modules\.bin\tsx cli.ts agents:create
echo --- listing agents ---
node_modules\.bin\tsx cli.ts agents:list
