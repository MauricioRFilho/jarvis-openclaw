# Autonomous Forge

## Introduction
The Autonomous Forge is a system designed to develop and deliver complete, tested, and documented projects based on provided briefings. This system utilizes autonomous agents, leveraging the OpenClaw framework, to execute tasks, generate code, and manage project repositories on GitHub.

## Features

* Receives briefings and generates complete projects
* Utilizes OpenClaw agents for task execution
* Employs Gemini 1.5 Pro and Groq (Llama 3 70B) for language modeling and code generation
* Isolates project execution using Docker containers
* Automates GitHub repository creation, branch management, and commits
* Generates GitHub Actions for continuous integration and deployment
* Performs unit testing, documentation generation, and code linting

## Prerequisites

* Node.js (TypeScript)
* OpenClaw / LangChain Agents
* Docker
* GitHub API

## Setup

1. Clone the repository
2. Install dependencies using `npm install`
3. Configure environment variables in `config/config.json`
4. Build the Docker image using `docker build -t autonomous-forge .`
5. Run the system using `docker run -d autonomous-forge`

## Configuration

* Edit `config/config.json` to configure system settings, such as API keys and GitHub repository settings
* Update `src/agents/openclaw/OpenClaw.ts` to modify agent behavior and task execution
* Modify `src/services/github/GitHubService.ts` to adjust GitHub API interactions

## Contributing

* Fork the repository
* Implement changes and commit using standard commit messages
* Open a pull request to submit changes for review

## License

* [MIT License](https://opensource.org/licenses/MIT)

## Acknowledgments

* OpenClaw framework
* LangChain Agents
* Gemini 1.5 Pro and Groq (Llama 3 70B) language models
* GitHub API and GitHub Actions
* Docker and Node.js (TypeScript) runtime environments