# My Mastra App

This project is an AI agent application built with Mastra, designed to automate various tasks including GitHub interactions, weather information retrieval, email sending, text summarization, and web searching.

## Features

*   **GitHub Agent**: Interact with GitHub repositories (e.g., create issues, pull requests).
*   **Weather Agent**: Retrieve weather information.
*   **Email Sending**: Send emails using Nodemailer.
*   **Summarization Tool**: Summarize text content.
*   **Web Search Tool**: Perform web searches.
*   **Workflows**: Orchestrate agents and tools for complex tasks (e.g., `veille-workflow`, `weather-workflow`).

## Technologies Used

*   **Mastra**: A framework for building AI agents.
*   **AI SDK (Google)**: For AI model integration.
*   **Node.js**: JavaScript runtime environment.
*   **TypeScript**: Superset of JavaScript for type safety.
*   **Nodemailer**: For email functionalities.
*   **Zod**: For schema validation.
*   **Dotenv**: For environment variable management.
*   **LibSQL**: For database interactions (likely for Mastra's internal use).
*   **Mastra Loggers**: For logging.
*   **Mastra Memory**: For agent memory management.

## Installation

To set up the project, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rsoubeiga/mastra-app.git
    cd mastra-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add necessary environment variables (e.g., API keys for AI services, email credentials). Refer to the `src/config.ts` file and agent implementations for required variables.

## Usage

This project uses `mastra` CLI commands for development, building, and starting the application.

*   **Development Mode**:
    ```bash
    npm run dev
    ```
    This will start the application in development mode, typically with hot-reloading and detailed logging.

*   **Build the Application**:
    ```bash
    npm run build
    ```
    This command compiles the TypeScript code into JavaScript, preparing it for production deployment.

*   **Start the Application**:
    ```bash
    npm run start
    ```
    This command runs the compiled application.

## Project Structure

The core logic of the application resides in the `src` directory:

```
src/
├───config.ts           # Configuration settings and environment variable loading
└───mastra/
    ├───index.ts        # Main entry point for Mastra agents
    ├───utils.ts        # Utility functions
    ├───agents/         # Definitions of various AI agents
    │   ├───github-agent.ts
    │   ├───veille-agent.ts
    │   └───weather-agent.ts
    ├───services/       # Business logic and external service integrations
    │   └───weather-service.ts
    ├───tools/          # Tools that agents can use to perform actions
    │   ├───github-repo-tool.ts
    │   ├───send-email-tool.ts
    │   ├───summarize-tool.ts
    │   ├───weather-tool.ts
    │   └───web-search-tool.ts
    └───workflows/      # Predefined sequences of agent and tool interactions
        ├───veille-workflow.ts
        └───weather-workflow.ts
```
