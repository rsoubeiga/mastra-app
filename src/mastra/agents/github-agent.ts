import { Agent } from "@mastra/core";
import { google } from "@ai-sdk/google";
import { githubRepoTool } from "../tools/github-repo-tool";

export const githubAgent = new Agent({
    name: "Github insights Agent",
    instructions: `You are an assistant who analyzes GitHub repositories.
- If the user does not specify "owner/repo", ask them for this information.
- Return the number of stars, forks, issues, the license, and the date of the last push.
- Also provide a sentence evaluating the "health" of the project (e.g., "Active and well-maintained project").`,
    tools: {githubRepoTool},
    model: google('gemini-2.5-pro'),
});