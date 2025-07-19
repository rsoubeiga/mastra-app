import { createTool } from "@mastra/core";
import { z } from "zod";

export const githubRepoTool = createTool({
    id: "get-github-repo-info",
    description: "Get a github public repository stats",
    inputSchema: z.object({
        owner: z.string().describe('User or organization name'),
        repo: z.string().describe('Repository name'),
    }),
    outputSchema: z.object({
        stars: z.number(),
        forks: z.number(),
        issues: z.number(),
        license: z.string().nullable(),
        lastPush: z.string(),
        description: z.string().nullable(),
    }),
    execute: async ({ context }) => {
        const { owner, repo } = context;
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (response.status === 404) {
            throw new Error(`Repository ${owner}/${repo} not found`);
        }
        const data = await response.json();
        return {
            stars: data.stargazers_count,
            forks: data.forks_count,
            issues: data.open_issues_count,
            license: data.license?.name || null,
            lastPush: data.pushed_at,
            description: data.description || null,
        };
    },
})
    