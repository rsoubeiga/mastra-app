// src/mastra/tools/serpstack-tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { config } from "../../config";

export const webSearchTool = createTool({
  id: "web-search",
  description: "Searches for online articles on a given topic using the Serpstack API",
  inputSchema: z.object({
    query: z.string().describe("Topic or search query"),
    numResults: z.number().optional().describe("Number of results to retrieve")
  }),
  outputSchema: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    snippet: z.string().nullable()
  })),
  execute: async ({ context }) => {
    const { query, numResults = 5 } = context;
    const apiKey = config.serpstack.apiKey;
    const params = new URLSearchParams({
      access_key: apiKey ?? "",
      query: query,
      type: "web",
      count: numResults.toString()
    });
    const res = await fetch(`https://api.serpstack.com/search?${params}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Serpstack API error: ${err.error?.info || res.statusText}`);
    }
    const data = await res.json();
    const results = data.webPages?.value ?? data.organic_results ?? [];
    return results.slice(0, numResults).map((item: any) => ({
      title: item.name || item.title,
      url: item.url,
      snippet: item.snippet || item.description || null
    }));
  }
});
