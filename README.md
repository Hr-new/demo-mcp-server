# Weather MCP Server

A Model Context Protocol (MCP) server that provides real-time weather data and alerts for US locations using the National Weather Service API.

## What is MCP (Model Context Protocol)?

**Model Context Protocol (MCP)** is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). It enables AI assistants like Claude, GitHub Copilot, and others to securely connect to external data sources, APIs, and tools.

### Key Benefits of MCP:

- **Unified Interface**: One protocol works across multiple AI platforms (Claude, Copilot, etc.)
- **Secure Context Sharing**: Controlled access to external data and services
- **Extensibility**: Easy to add custom tools and data sources
- **Standardized Communication**: Uses JSON-RPC over stdio transport
- **Tool Registration**: Dynamic tool discovery and invocation

### MCP Architecture:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   AI Client     │ ◄─────► │   MCP Server    │ ◄─────► │  External API   │
│ (Copilot/Claude)│  stdio  │  (Your Tools)   │  HTTP   │ (Weather/DB/etc)│
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

The MCP server acts as a bridge between AI clients and external services, exposing tools that the AI can invoke to fetch real-time data.

## Features

- **Weather Forecasts**: Get 7-day weather forecasts for any US location using GPS coordinates
- **Weather Alerts**: Retrieve active weather alerts for any US state using two-letter state codes
- **Real-time Data**: Fetches current data from the National Weather Service API

## Tools

### 1. `get_weather`
Fetches current weather conditions and 7-day forecast for a US location.

**Parameters:**
- `latitude` (number): Latitude of the location (-90 to 90)
- `longitude` (number): Longitude of the location (-180 to 180)

**Example:**
```
Get weather for San Francisco: latitude 37.7749, longitude -122.4194
```
### 2. `get_alerts`
Retrieves active weather alerts for a US state.

**Parameters:**
- `state` (string): Two-letter US state code (e.g., CA, NY, TX)

**Example:**
```
Get alerts for California: CA
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup

1. **Clone the repository:**
```bash
cd /path/to/demo-mcp-server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

## Usage

### With GitHub Copilot (VS Code)

1. **Configure MCP in VS Code:**

Create or edit `~/.config/Code/User/mcp.json`:
```json
{
  "servers": {
    "demo-weather": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/home/hitesh/SImform/Lerning/demo-mcp-server/build/index.js"
      ]
    }
  },
  "inputs": []
}
```

2. **Reload VS Code:**
- Press `Ctrl+Shift+P`
- Type: `Developer: Reload Window`

3. **Use in Copilot Chat:**
```
@demo-weather What's the weather in Miami?
@demo-weather Get forecast for 40.7128, -74.006
@demo-weather Get alerts for New York (NY)
```

### With Claude Desktop

1. **Configure Claude Desktop:**

Create or edit `~/.config/Claude/claude_desktop_config.json`:
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

2. **Restart Claude Desktop**

3. **Use the tools:**
```
What's the weather forecast for San Francisco at 37.7749, -122.4194?
Get weather alerts for California
```

### With MCP Inspector (Development/Testing)

1. **Start the inspector:**
```bash
DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector node build/index.js
```

2. **Open Chrome with CORS disabled:**
```bash
google-chrome --disable-web-security --user-data-dir=/tmp/chrome-mcp-testing "http://localhost:6274"
```

Or use the provided script:
```bash
./start-inspector.sh
```

## Development

### Project Structure
```
demo-mcp-server/
├── src/
│   ├── index.ts          # Main MCP server with tool definitions
│   └── helper.ts         # API request helpers and types
├── build/                # Compiled JavaScript output
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Building

After making changes to the source code:
```bash
npm run build
```

### Adding New Tools

1. Edit `src/index.ts`
2. Register a new tool using `server.registerTool()`
3. Build the project: `npm run build`
4. Reload your MCP client (VS Code, Claude Desktop, etc.)

## Creating Your Own MCP Server

Want to build your own MCP server? Here's a step-by-step guide:

### 1. Project Setup

```bash
# Create a new project
mkdir my-mcp-server
cd my-mcp-server

# Initialize npm project
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node

# Initialize TypeScript
npx tsc --init
```

### 2. Basic MCP Server Structure

Create `src/index.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});

// Register a tool
server.registerTool(
  "my_tool",
  {
    title: "My Custom Tool",
    description: "Description of what this tool does",
    inputSchema: {
      param1: z.string().describe("First parameter description"),
      param2: z.number().describe("Second parameter description"),
    },
  },
  async ({ param1, param2 }) => {
    // Your tool logic here
    const result = `Processed: ${param1} and ${param2}`;
    
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

### 3. Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

### 4. Add Build Script

Update `package.json`:

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

### 5. Build and Test

```bash
# Build the project
npm run build

# Test with MCP inspector
npx @modelcontextprotocol/inspector node build/index.js
```

### 6. Tool Design Best Practices

**Use Zod for Input Validation:**
```typescript
inputSchema: {
  email: z.string().email().describe("User email address"),
  age: z.number().min(0).max(150).describe("User age"),
  status: z.enum(["active", "inactive"]).describe("Account status"),
}
```

**Provide Clear Descriptions:**
- Tool titles should be concise (3-7 words)
- Descriptions should explain what the tool does and when to use it
- Parameter descriptions help the AI understand what to provide

**Handle Errors Gracefully:**
```typescript
try {
  const data = await fetchExternalAPI();
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
} catch (error) {
  return {
    content: [{
      type: "text",
      text: `Error: ${error.message}`
    }],
    isError: true
  };
}
```

### 7. Common MCP Server Use Cases

- **Database Queries**: Connect to PostgreSQL, MongoDB, etc.
- **API Integrations**: Weather, stock prices, news, social media
- **File Operations**: Read/write files, search codebases
- **System Information**: Server stats, process monitoring
- **Custom Business Logic**: Internal tools, calculations, workflows

### 8. Resources

- **MCP Documentation**: https://modelcontextprotocol.io
- **MCP SDK**: https://github.com/modelcontextprotocol/sdk
- **Example Servers**: https://github.com/modelcontextprotocol/servers
- **Zod Documentation**: https://zod.dev

## API Information

This server uses the **National Weather Service API**:
- **Base URL:** https://api.weather.gov
- **Documentation:** https://www.weather.gov/documentation/services-web-api
- **Coverage:** United States only
- **Rate Limits:** No authentication required, reasonable use expected

## Troubleshooting

### CORS Issues with MCP Inspector

The mcp-inspector has hardcoded CORS settings. Solutions:
- Use Chrome with `--disable-web-security` flag (development only)
- Set `DANGEROUSLY_OMIT_AUTH=true` to disable authentication
- Use Claude Desktop or VS Code instead (no CORS issues)

### Tool Not Showing Up

1. Rebuild the project: `npm run build`
2. Kill any running MCP processes: `pkill -f demo-mcp-server`
3. Reload your MCP client
4. Wait 5-10 seconds for registration

### Location Not Supported

The NWS API only supports US locations. Ensure:
- Coordinates are within the United States
- Latitude is between -90 and 90
- Longitude is between -180 and 180

## License

ISC

## Author

Demo MCP Server for Weather Data
