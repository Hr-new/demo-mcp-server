# Weather MCP Server

A Model Context Protocol (MCP) server that provides real-time weather data and alerts for US locations using the National Weather Service API.

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
