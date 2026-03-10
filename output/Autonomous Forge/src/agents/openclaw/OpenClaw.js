"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenClaw = void 0;
const GitHubService_1 = require("../services/github/GitHubService");
const GeminiService_1 = require("../services/gemini/GeminiService");
const DockerService_1 = require("../services/docker/DockerService");
const config_1 = require("../config/config");
const logger_1 = require("../utils/logger");
const langchain_1 = require("langchain");
const fs = __importStar(require("fs"));
class OpenClaw {
    githubService;
    geminiService;
    dockerService;
    config;
    logger;
    agent;
    constructor() {
        this.githubService = new GitHubService_1.GitHubService();
        this.geminiService = new GeminiService_1.GeminiService();
        this.dockerService = new DockerService_1.DockerService();
        this.config = new config_1.Config();
        this.logger = new logger_1.Logger();
        this.agent = new langchain_1.LangChainAgent();
    }
    async ingestBriefing(architectureMd) {
        try {
            const projectDefinition = this.parseArchitectureMd(architectureMd);
            await this.createProject(projectDefinition);
        }
        catch (error) {
            this.logger.error('Error ingesting briefing:', error);
        }
    }
    async createProject(projectDefinition) {
        try {
            const projectName = projectDefinition.name;
            const projectPath = `projects/${projectName}`;
            // Create project directory
            fs.mkdirSync(projectPath, { recursive: true });
            // Create Docker container for project
            const container = await this.dockerService.createContainer(projectName);
            // Initialize project with Clean Architecture
            await this.scaffoldProject(projectPath, projectName);
            // Write code for project
            await this.writeCode(projectPath, projectDefinition);
            // Generate UI with Tailwind CSS
            await this.generateUI(projectPath);
            // Write tests and run them
            await this.writeTests(projectPath);
            await this.runTests(projectPath);
            // Generate documentation
            await this.generateDocumentation(projectPath);
            // Create GitHub repository and push code
            await this.createGitHubRepository(projectName, projectPath);
        }
        catch (error) {
            this.logger.error('Error creating project:', error);
        }
    }
    async scaffoldProject(projectPath, projectName) {
        try {
            // Scaffold project with Clean Architecture
            const scaffold = this.geminiService.scaffoldProject(projectName);
            fs.writeFileSync(`${projectPath}/src/index.ts`, scaffold);
        }
        catch (error) {
            this.logger.error('Error scaffolding project:', error);
        }
    }
    async writeCode(projectPath, projectDefinition) {
        try {
            // Write code for project using Gemini
            const code = this.geminiService.writeCode(projectDefinition);
            fs.writeFileSync(`${projectPath}/src/index.ts`, code);
        }
        catch (error) {
            this.logger.error('Error writing code:', error);
        }
    }
    async generateUI(projectPath) {
        try {
            // Generate UI with Tailwind CSS
            const ui = this.geminiService.generateUI();
            fs.writeFileSync(`${projectPath}/src/index.html`, ui);
        }
        catch (error) {
            this.logger.error('Error generating UI:', error);
        }
    }
    async writeTests(projectPath) {
        try {
            // Write tests for project
            const tests = this.geminiService.writeTests();
            fs.writeFileSync(`${projectPath}/src/tests/index.ts`, tests);
        }
        catch (error) {
            this.logger.error('Error writing tests:', error);
        }
    }
    async runTests(projectPath) {
        try {
            // Run tests for project
            const testResult = this.geminiService.runTests();
            this.logger.info('Test result:', testResult);
        }
        catch (error) {
            this.logger.error('Error running tests:', error);
        }
    }
    async generateDocumentation(projectPath) {
        try {
            // Generate documentation for project
            const documentation = this.geminiService.generateDocumentation();
            fs.writeFileSync(`${projectPath}/README.md`, documentation);
        }
        catch (error) {
            this.logger.error('Error generating documentation:', error);
        }
    }
    async createGitHubRepository(projectName, projectPath) {
        try {
            // Create GitHub repository
            const repository = await this.githubService.createRepository(projectName);
            this.logger.info('Repository created:', repository);
            // Push code to GitHub repository
            await this.githubService.pushCode(projectPath, projectName);
            this.logger.info('Code pushed to repository:', projectName);
        }
        catch (error) {
            this.logger.error('Error creating GitHub repository:', error);
        }
    }
    parseArchitectureMd(architectureMd) {
        // Parse architecture.md file to extract project definition
        // For now, just return a dummy project definition
        return {
            name: 'Dummy Project',
            description: 'This is a dummy project',
        };
    }
}
exports.OpenClaw = OpenClaw;
