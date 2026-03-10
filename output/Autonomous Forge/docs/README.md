# Autonomous Forge

## Overview
The Autonomous Forge is an infrastructure based on autonomous agents (OpenClaw) capable of receiving technical briefings and delivering complete, tested, and documented repositories directly to the MauricioOpenClaw GitHub profile.

## Features
- Receives technical briefings and generates complete projects
- Writes code in Node.js, Go, and Python
- Implements Clean Architecture and high-performance systems
- Automatically tests and documents the generated code
- Deploys the generated code to GitHub

## Requirements
- Docker
- Node.js (TypeScript)
- GitHub API
- OpenClaw agents
- LangChain agents

## Getting Started
1. Set up a Docker environment
2. Install the required dependencies, including Node.js, OpenClaw, and LangChain
3. Configure the GitHub API and Docker permissions
4. Create a new briefing and run the Autonomous Forge agent

## Project Structure
- `package.json`: Project dependencies and scripts
- `docker-compose.yml`: Docker configuration
- `src/agents/ClawSmithAgent.ts`: Autonomous Forge agent implementation
- `src/utils/docker.ts`: Docker utility functions
- `src/utils/github.ts`: GitHub API utility functions
- `tests/ClawSmithAgent.test.ts`: Autonomous Forge agent tests
- `docs/README.md`: Project documentation

## Security
- Secret masking: The agent does not upload `.env` files and creates a `.env.example` instead
- Command filtering: The agent blocks potentially dangerous shell commands
- Human-in-the-loop: The agent requires manual approval before pushing the generated code to GitHub

## Compliance
The Autonomous Forge complies with Brazilian laws (LGPD) and ensures the secure handling of personal identifiable information (PII).