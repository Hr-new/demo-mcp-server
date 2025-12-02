#!/bin/bash
# Start MCP Inspector with CORS bypass

# Kill any existing inspector
fuser -k 6277/tcp 2>/dev/null
fuser -k 6274/tcp 2>/dev/null
sleep 1

# Start inspector without auth
cd /home/hitesh/SImform/Lerning/demo-mcp-server
DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector node build/index.js &

# Wait for it to start
sleep 3

# Open Chrome with CORS disabled
google-chrome --disable-web-security --user-data-dir=/tmp/chrome-mcp-testing "http://localhost:6274" &

echo "✅ MCP Inspector started at http://localhost:6274"
