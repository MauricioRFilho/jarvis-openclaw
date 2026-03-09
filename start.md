Autonomous Forge

1. Objetivo do Sistema
Desenvolver uma infraestrutura baseada em agentes autônomos (OpenClaw) capaz de receber briefings técnicos e entregar repositórios completos, testados e documentados diretamente no perfil GitHub MauricioOpenClaw.

2. Pilares de Arquitetura
2.1. O Motor (Claw-Engine)
Orquestrador: Utilização do Core do OpenClaw para execução de tarefas.

Modelos de Linguagem (LLMs): * Primary: Gemini 1.5 Pro (pelo contexto de 2M de tokens, ideal para projetos inteiros).

Failover: Groq (Llama 3 70B) para tarefas rápidas de refatoração e linting.

2.2. O Ambiente de Execução (The Sandbox)
Isolamento: Uso de Docker Containers para cada execução de projeto. O agente não deve ter acesso ao sistema host, apenas ao volume do projeto.

Ferramental: Imagem Docker pré-instalada com Node.js, Go, Python, Git e CLI do Vercel/Fly.io.

2.3. O Fluxo de Entrega (Deployment Pipeline)
Git Automation: O agente deve ter permissão para criar repositórios, gerenciar branches e realizar commits.

CI/CD: Geração automática de GitHub Actions em cada projeto para garantir que o código gerado "passa" no build.

3. Escopo de Funcionalidades (MVP)
Fase 1: Recebimento e Planejamento
[ ] Ingestão de Briefing: Interface simples onde Mauricio insere o architecture.md.

[ ] Validação de Escopo: O agente analisa se o projeto é viável e gera uma lista de tarefas (Backlog).

Fase 2: Geração de Código (The Forge)
[ ] Scaffolding: Criação da estrutura de pastas (Clean Architecture).

[ ] Core Coding: Escrita dos arquivos .ts, .go, .py seguindo os padrões sênior de Mauricio.

[ ] UI Generation: Implementação de Tailwind CSS com a paleta Stealth Architect.

Fase 3: Qualidade e Documentação
[ ] Auto-Testing: O agente deve escrever e rodar pelo menos 3 testes unitários críticos.

[ ] Docs: Geração automática de README.md profissional e API_SPEC.md (se houver backend).

[ ] Linters: Execução de ESLint/Prettier para garantir que o código não pareça "gerado por máquina".

Fase 4: Entrega
[ ] GitHub Push: Envio do código para MauricioOpenClaw/<nome-do-projeto>.

[ ] Final Report: Envio de um relatório no Telegram/Discord de Mauricio com o link do repo pronto.

4. Requisitos de Segurança (Hardened)
Secret Masking: O agente é proibido de subir arquivos .env. Ele deve sempre criar um .env.example.

Command Filtering: Bloqueio de comandos perigosos via shell (ex: rm -rf /, chmod).

Human-in-the-Loop: O agente deve aguardar um "OK" via terminal/chat antes de realizar o git push final.

5. Cronograma de Implementação (Vibe Coding Style)
Dia 1: Setup do Docker e permissões de API (GitHub/Gemini).

Dia 2: Configuração do System Prompt "ClawSmith DNA".

Dia 3: Teste de geração do primeiro projeto (ex: Um CRUD de Alta Performance).

Dia 4: Ajuste do sistema de Failover (Gemini -> Groq).

Dia 5: Automação completa do Pipeline de Push.

6. Stack Tecnológica Sugerida
Runtime: Node.js (TypeScript).

Agent Framework: OpenClaw / LangChain Agents.

Infra: Docker.

Versionamento: GitHub API.