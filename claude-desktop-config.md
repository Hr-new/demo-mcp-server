# Configure MCP Server in Claude Desktop

Add this to your Claude Desktop config file:

**Location:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/home/hitesh/SImform/Lerning/demo-mcp-server/build/index.js"]
    }
  }
}
```

Then restart Claude Desktop to use your MCP server directly without the inspector.
