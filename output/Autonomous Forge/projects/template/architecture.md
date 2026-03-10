# Architecture
## Overview
The Autonomous Forge system is designed to receive briefings and deliver complete, tested, and documented repositories. The system consists of three main components: the Motor (Claw-Engine), the Ambiente de Execução (The Sandbox), and the Fluxo de Entrega (Deployment Pipeline).

## Components
### Motor (Claw-Engine)
The Motor is the core of the Autonomous Forge system, responsible for executing tasks. It utilizes the Gemini 1.5 Pro language model as its primary model, with Groq (Llama 3 70B) as a failover for quick refactoring and linting tasks.

### Ambiente de Execução (The Sandbox)
The Sandbox is a Docker container-based environment where projects are executed. Each project has its own isolated container, ensuring that the agent does not have access to the host system. The Docker image is pre-installed with Node.js, Go, Python, Git, and the Vercel/Fly.io CLI.

### Fluxo de Entrega (Deployment Pipeline)
The Deployment Pipeline is responsible for automating the delivery of projects. It includes Git automation, allowing the agent to create repositories, manage branches, and commit changes. The pipeline also generates GitHub Actions for each project to ensure that the generated code passes the build process.

## Workflow
The Autonomous Forge system follows a four-phase workflow:

### Fase 1: Recebimento e Planejamento
* Ingestão de Briefing: The system receives a briefing in the form of an `architecture.md` file.
* Validação de Escopo: The agent analyzes the briefing to determine the project's viability and generates a backlog of tasks.

### Fase 2: Geração de Código (The Forge)
* Scaffolding: The system creates the project's folder structure based on Clean Architecture principles.
* Core Coding: The agent writes the project's core code in languages such as TypeScript, Go, or Python, following senior-level patterns.
* UI Generation: The system generates the project's UI using Tailwind CSS with the Stealth Architect palette.

### Fase 3: Qualidade e Documentação
* Auto-Testing: The agent writes and runs at least three critical unit tests for the project.
* Docs: The system generates a professional `README.md` file and an `API_SPEC.md` file (if the project has a backend).
* Linters: The agent executes ESLint/Prettier to ensure the code does not appear machine-generated.

### Fase 4: Entrega
* GitHub Push: The system pushes the completed project to the `MauricioOpenClaw` GitHub repository.
* Final Report: The agent sends a report to Mauricio via Telegram/Discord with a link to the completed repository.

## Security
The Autonomous Forge system prioritizes security, with features such as:

* Secret Masking: The agent is forbidden from uploading `.env` files and instead creates a `.env.example` file.
* Command Filtering: The system blocks dangerous shell commands (e.g., `rm -rf /`, `chmod`).
* Human-in-the-Loop: The agent waits for a manual "OK" via terminal/chat before performing the final `git push`.