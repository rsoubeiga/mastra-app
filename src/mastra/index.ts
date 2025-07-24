
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { githubAgent } from './agents/github-agent';
import { veilleWorkflow } from './workflows/veille-workflow';
import { config } from '../config';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, veilleWorkflow },
  agents: { weatherAgent, githubAgent },
  storage: new LibSQLStore({
    url: config.database.url,
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
