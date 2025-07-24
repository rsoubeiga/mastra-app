import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";
import { webSearchTool } from "../tools/web-search-tool";
import { sendEmailTool } from "../tools/send-email-tool";


const searchStep = createStep({
    id: 'Search the Web',
    description:  'Search the web for the given topic.',
    inputSchema: z.object({
        query: z.string().describe("Topic or search query"),
        numResults: z.number().optional().describe("Number of results to retrieve")
    }),
    outputSchema: z.object({
        results: z.array(z.object({
            title: z.string(),
            url: z.string().url(),
            snippet: z.string().nullable()
        }))
    }),
    execute: async ({ inputData }) => {
        
        const { query, numResults = 5 } = inputData;
        const response = await webSearchTool.execute({ context: { query, numResults }});
        return { results: response };
    },
});

const summarizeStep = createStep({
    id: 'Summarize Findings',
    description:  'Summarize the search results into a concise summary with sources.',
    inputSchema: z.object({
        results: z.array(z.object({
            title: z.string(),
            url: z.string().url(),
            snippet: z.string().nullable()
        }))
    }),
    outputSchema: z.object({
        summary: z.string()
    }),
    execute: async ({ inputData }) => {
        
        const articles = inputData.results;
        // Build the prompt for the LLM
        let prompt = `You are a monitoring agent. Summarize the following information on the requested topic, citing the sources.\n`;
        prompt += `Information found:\n`;
        articles.forEach((art, idx) => {
            prompt += `[${idx+1}] "${art.title}" - ${art.snippet}\n URL: ${art.url}\n\n`;
        });
        prompt += `\nNow write a clear and concise summary (a few paragraphs) of the main findings, mentioning the corresponding sources as [${1}], [${2}], ...\n`;
        // Call the veille agent via Mastra
        const { veilleAgent } = await import("../agents/veille-agent");
        const response = await veilleAgent.generate(prompt);
        // response.text is the generated summary
        return { summary: response.text };
    },
});

const sendEmailStep = createStep({
    id: 'Send Email',
    description: 'Send the summary by email',
    inputSchema: z.object({
        summary: z.string(),
        to: z.string().describe("Email address to send the summary to")
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    execute: async ({ inputData, getInitData }) => {
        
        const { summary } = inputData;
        const to = getInitData().to;
        const response = await sendEmailTool.execute({ context: { summary, to }});
        return { success: response.success };
    },
});


const veilleWorkflow = createWorkflow({
    id: "veille-workflow",
    inputSchema: z.object({
        query: z.string().describe("Topic or search query"),
        numResults: z.number().optional().describe("Number of results to retrieve"),
        to: z.string().describe("Email address to send the summary to")
    }),
    outputSchema: z.object({
        summary: z.string()
    })
})
    .then(searchStep)
    .then(summarizeStep)
    .then(sendEmailStep)
    .commit();
export { veilleWorkflow };