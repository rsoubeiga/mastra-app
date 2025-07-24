import nodemailer from "nodemailer";
import { createTool } from "@mastra/core";
import z from "zod";

export const sendEmailTool = createTool({
    id: "send-email",
    description: "Envoie un email avec le rapport de veille",
    inputSchema: z.object({
        summary: z.string(),
        to: z.string().describe("Adresse du destinataire"),
    }),
    outputSchema: z.object({
        success: z.boolean(),
    }),
    execute: async ({ context }) => {
        if (!context) {
            throw new Error('Input data not found');
        }
        const { summary, to } = context;

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: "Rapport de veille - " + new Date().toLocaleDateString(),
            html: summary
        });
        return { success: true };
    },
});