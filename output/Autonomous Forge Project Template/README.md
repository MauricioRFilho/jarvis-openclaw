# Autonomous Forge - MauricioOpenClaw

## Project Overview

The Autonomous Forge is an autonomous agent system, built upon the OpenClaw framework, designed to ingest technical briefings and generate complete, tested, and documented repositories directly to the MauricioOpenClaw GitHub profile. The system leverages cutting-edge Large Language Models (LLMs) for code generation, comprehensive testing methodologies, and stringent security measures to deliver high-quality, production-ready code.

## Architecture

The architecture of the Autonomous Forge is built around three core pillars:

1.  **The Motor (Claw-Engine):**

    *   **Orchestrator:** OpenClaw Core.
    *   **Primary LLM:** Gemini 1.5 Pro (context window for large projects).
    *   **Failover LLM:** Groq (Llama 3 70B) for refactoring and linting.

2.  **The Execution Environment (The Sandbox):**

    *   **Isolation:** Docker Containers (Restricted access to the host system).
    *   **Tooling:** Pre-installed with Node.js, Go, Python, Git, Vercel/Fly.io CLI.

3.  **The Delivery Pipeline:**

    *   **Git Automation:** Repository creation, branch management, and automated commits.
    *   **CI/CD:** Automatic generation of GitHub Actions workflows.

## Functional Scope (MVP)

The Minimum Viable Product (MVP) encompasses the following phases:

### Phase 1: Briefing Ingestion and Planning

*   [x] **Ingestion of Briefing:** A mechanism to input `architecture.md`.
*   [x] **Scope Validation:** Analysis of project feasibility and generation of a task Backlog.

### Phase 2: Code Generation (The Forge)

*   [x] **Scaffolding:** Project structure adhering to Clean Architecture principles.
*   [x] **Core Coding:** Generation of `.ts`, `.go`, `.py` files based on best practices.
*   [x] **UI Generation:** Implementation of Tailwind CSS with a Stealth Architect-inspired palette.

### Phase 3: Quality Assurance and Documentation

*   [x] **Auto-Testing:** Generation and execution of critical unit tests.
*   [x] **Documentation:** Creation of a professional `README.md` and `API_SPEC.md` (if applicable).
*   [x] **Linting:** Code linting and formatting with ESLint/Prettier.

### Phase 4: Delivery

*   [x] **GitHub Push:** Code pushed to `MauricioOpenClaw/<project-name>`.
*   [x] **Final Report:** Notification sent to Telegram/Discord with the repository link.

## Security Requirements

*   **Secret Masking:** Prevents `.env` file commits; generates `.env.example` instead.
*   **Command Filtering:** Blocks hazardous shell commands (e.g., `rm -rf /`).
*   **Human-in-the-Loop:** Requires manual approval before the final `git push`.

## Technology Stack

*   **Runtime:** Node.js (TypeScript).
*   **Agent Framework:** OpenClaw / LangChain Agents.
*   **Infrastructure:** Docker.
*   **Version Control:** GitHub API.

## Contributing

Contributions are welcome! Please refer to the project's contribution guidelines for more information.

## License
[MIT](LICENSE)