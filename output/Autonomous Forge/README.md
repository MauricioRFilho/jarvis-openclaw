# Autonomous Forge

## Overview

Autonomous Forge is an agent-based infrastructure designed to receive technical briefings and deliver complete, tested, and documented repositories directly to the GitHub profile MauricioOpenClaw.

## Architecture

The system is built around the following pillars:

* **The Motor (Claw-Engine)**: Utilizes the OpenClaw core for task execution, with primary language models powered by Gemini 1.5 Pro and failover support via Groq (Llama 3 70B).
* **The Sandbox (Docker Containers)**: Ensures isolation and security by executing projects within Docker containers, with a pre-installed environment featuring Node.js, Go, Python, Git, and Vercel/Fly.io CLI.
* **The Deployment Pipeline**: Automates GitHub repository creation, branch management, and commit operations, with integrated CI/CD using GitHub Actions.

## Features

The system provides the following functionality:

* **Ingestion and Planning**: Receives and validates project briefings, generating a task backlog.
* **Code Generation**: Creates project scaffolding, writes core code in TypeScript, Go, and Python, and implements UI components using Tailwind CSS.
* **Quality and Documentation**: Generates unit tests, README.md, and API_SPEC.md files, and executes linters to ensure high-quality code.
* **Delivery**: Pushes the generated code to the designated GitHub repository and sends a final report to the user.

## Security

The system prioritizes security, with the following measures:

* **Secret Masking**: Prevents the upload of sensitive files (e.g., .env) and creates .env.example files instead.
* **Command Filtering**: Blocks potentially hazardous shell commands.
* **Human-in-the-Loop**: Requires user confirmation before executing the final git push operation.

## Technical Stack

The system is built using:

* **Runtime**: Node.js (TypeScript)
* **Agent Framework**: OpenClaw / LangChain Agents
* **Infrastructure**: Docker
* **Version Control**: GitHub API

## Setup and Usage

To use Autonomous Forge, follow these steps:

1. Set up Docker and configure API permissions (GitHub/Gemini).
2. Configure the System Prompt "ClawSmith DNA".
3. Test the generation of a sample project.
4. Refine the failover mechanism (Gemini -> Groq).
5. Automate the pipeline for push operations.

## Contributing

Contributions to Autonomous Forge are welcome. Please ensure that all submissions comply with Brazilian laws (LGPD) and adhere to senior-level coding patterns.