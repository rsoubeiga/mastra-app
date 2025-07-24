

import { createTool } from "@mastra/core";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";
import { config } from "../../config";

export const summarizeTool = createTool({
    id: "summarize-articles",
    description: "Summarize a list of articles",
    inputSchema: z.object({
        articles: z.array(z.object({
            title: z.string(),
            url: z.string().url(),
            snippet: z.string().nullable()
        }))
    }),
    outputSchema: z.object({
        summary: z.string()
    }),
    execute: async ({ context }) => {
        const { articles } = context;
        
        // Build the prompt for the LLM
        let prompt = `You are a monitoring agent. Summarize the following information on the requested topic, citing the sources.\n`;
        prompt += `Information found:\n`;
        articles.forEach((art, idx) => {
            prompt += `[${idx+1}] \"${art.title}\" - ${art.snippet}\n URL: ${art.url}\n\n`;
        });
        prompt += `\nNow write a clear and concise summary (a few paragraphs) of the main findings, mentioning the corresponding sources as [${1}], [${2}], ...\n`;
        prompt += `Format the summary in HTML for email. Respond with a valid HTML string.`;

        const { text } = await generateText({
            model: google(config.llm.model),
            prompt
        });
        
        return { summary: text };
    },
});

