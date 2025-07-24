import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

export const veilleAgent = new Agent({
  name: "Veille Agent",
  instructions: `You are a monitoring agent. Summarize the following information on the requested topic, citing sources. For each source, mention the corresponding number in brackets from the list. Add sources link at the end of the summary and format the summary in HTML for email
  Respond with a valid HTML string`,
  model: google("gemini-2.5-pro"),
});
