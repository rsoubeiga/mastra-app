

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

        const articlesText = articles
            .map((art, idx) => `Article [${idx + 1}]:\nTitle: ${art.title}\nSnippet: ${art.snippet}\nURL: ${art.url}`)
            .join('\n\n');

        const prompt = `\nYou are a professional monitoring agent. Your task is to write a summary of the provided articles and format it as a clean, valid HTML document for an email report.\n\nHere are the articles to summarize:\n--------------------\n${articlesText}\n--------------------\n\nPlease follow these instructions exactly:\n\n1.  **Summarize:** Write a concise summary of the main findings from the articles.\n2.  **Cite:** As you write the summary, cite the articles using their numbers in brackets (e.g., [1], [2]).\n3.  **Format:** The entire output MUST be a single, valid HTML string. Do not include markdown or any text outside the HTML structure.\n4.  **Structure:** The HTML must follow this structure precisely:\n    - Start with an <h1> containing the text "Rapport de Veille".\n    - Follow with the summary paragraphs, each enclosed in <p> tags.\n    - After the summary, add an <h2> containing the text "Sources".\n    - Finally, create an unordered list (<ul>). For each article, add a list item (<li>) containing a hyperlink (<a>) to the article's URL. The link text must be the article's title, prefixed with its number (e.g., "[1] Article Title").\n\nExample of a source list item:\n<li><a href="https://example.com/article-url">[1] Example Article Title</a></li>\n\nNow, generate the complete HTML report based on all the articles provided.\n`;

        const { text } = await generateText({
            model: google(config.llm.model),
            prompt
        });
        
        return { summary: text };
    },
});

