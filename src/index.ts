// call API and fetch data from the API
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  AlertsResponse,
  ForecastPeriod,
  ForecastResponse,
  formatAlert,
  makeNWSRequest,
  PointsResponse,
} from "./helper";

const NWS_API_BASE = "https://api.weather.gov";

// Create server instance
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
});

// Register weather tools
server.registerTool(
  "get_weather",
  {
    title: "Get weather data for a location",
    description:
      "Fetches current weather conditions and 7-day forecast from the National Weather Service for any US location using GPS coordinates",
    inputSchema: {
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .describe("Latitude of the location"),
      longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe("Longitude of the location"),
    },
  },
  async ({ latitude, longitude }) => {
    // Get grid point data
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(
      4
    )},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
          },
        ],
      };
    }

    const forecastUrl = pointsData?.properties?.forecast;
    if (!forecastUrl) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to get forecast URL from grid point data",
          },
        ],
      };
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve forecast data",
          },
        ],
      };
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No forecast periods available",
          },
        ],
      };
    }

    // Format forecast periods
    const formattedForecast = periods.map((period: ForecastPeriod) =>
      [
        `${period.name || "Unknown"}:`,
        `Temperature: ${period.temperature || "Unknown"}°${
          period.temperatureUnit || "F"
        }`,
        `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
        `${period.shortForecast || "No forecast available"}`,
        "---",
      ].join("\n")
    );

    const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join(
      "\n"
    )}`;

    return {
      content: [
        {
          type: "text",
          text: forecastText,
        },
      ],
    };
  }
);

server.registerTool(
  "get_alerts",
  {
    title: "Get weather alerts for a US state.",
    description: "Provides a list of active weather alerts for a US state using the two-letter state code.",
    inputSchema: {
      state: z
        .string()
        .length(2)
        .regex(/^[A-Z]{2}$/)
        .describe("Two-letter US state code (e.g., CA, NY, TX)"),
    },
  },
  async ({ state }) => {
    const url = `${NWS_API_BASE}/alerts/active/area/${state}`;
    const data = await makeNWSRequest<AlertsResponse>(url);
    if (!data || !data.features) {
      return {
        content: [
          {
            type: "text",
            text: "Unable to fetch alerts or no alerts found.",
          },
        ],
      };
    }
    if (!data.features.length) {
      return {
        content: [
          {
            type: "text",
            text: "No active alerts for this state.",
          },
        ],
      };
    }
    const alerts = data.features.map(formatAlert).join("\n---\n");
    return {
      content: [
        {
          type: "text",
          text: alerts,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
