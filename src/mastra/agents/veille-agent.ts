import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { webSearchTool } from "../tools/web-search-tool";
import { summarizeTool } from "../tools/summarize-tool";
import { config } from "../../config";

export const veilleAgent = new Agent({
  name: "Veille Agent",
  instructions: `You are a monitoring agent. Your role is to search for information on a given topic and provide a summary of your findings.`,
  tools: { webSearchTool, summarizeTool },
  model: google(config.llm.model),
});
