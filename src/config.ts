
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  serpstack: {
    apiKey: process.env.SERPSTACK_ACCESS_KEY,
  },
  database: {
    url: process.env.DATABASE_URL || 'file:../mastra.db',
  },
  llm: {
    provider: 'google',
    model: 'gemini-2.5-pro',
  }
};
