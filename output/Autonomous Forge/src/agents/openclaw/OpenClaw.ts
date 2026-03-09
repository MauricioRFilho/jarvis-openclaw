import { GitHubService } from '../services/github/GitHubService';
import { GeminiService } from '../services/gemini/GeminiService';
import { DockerService } from '../services/docker/DockerService';
import { Config } from '../config/config';
import { Logger } from '../utils/logger';
import { LangChainAgent } from 'langchain';
import * as fs from 'fs';

class OpenClaw {
  private githubService: GitHubService;
  private geminiService: GeminiService;
  private dockerService: DockerService;
  private config: Config;
  private logger: Logger;
  private agent: LangChainAgent;

  constructor() {
    this.githubService = new GitHubService();
    this.geminiService = new GeminiService();
    this.dockerService = new DockerService();
    this.config = new Config();
    this.logger = new Logger();
    this.agent = new LangChainAgent();
  }

  async ingestBriefing(architectureMd: string): Promise<void> {
    try {
      const projectDefinition = this.parseArchitectureMd(architectureMd);
      await this.createProject(projectDefinition);
    } catch (error) {
      this.logger.error('Error ingesting briefing:', error);
    }
  }

  async createProject(projectDefinition: any): Promise<void> {
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
    } catch (error) {
      this.logger.error('Error creating project:', error);
    }
  }

  async scaffoldProject(projectPath: string, projectName: string): Promise<void> {
    try {
      // Scaffold project with Clean Architecture
      const scaffold = this.geminiService.scaffoldProject(projectName);
      fs.writeFileSync(`${projectPath}/src/index.ts`, scaffold);
    } catch (error) {
      this.logger.error('Error scaffolding project:', error);
    }
  }

  async writeCode(projectPath: string, projectDefinition: any): Promise<void> {
    try {
      // Write code for project using Gemini
      const code = this.geminiService.writeCode(projectDefinition);
      fs.writeFileSync(`${projectPath}/src/index.ts`, code);
    } catch (error) {
      this.logger.error('Error writing code:', error);
    }
  }

  async generateUI(projectPath: string): Promise<void> {
    try {
      // Generate UI with Tailwind CSS
      const ui = this.geminiService.generateUI();
      fs.writeFileSync(`${projectPath}/src/index.html`, ui);
    } catch (error) {
      this.logger.error('Error generating UI:', error);
    }
  }

  async writeTests(projectPath: string): Promise<void> {
    try {
      // Write tests for project
      const tests = this.geminiService.writeTests();
      fs.writeFileSync(`${projectPath}/src/tests/index.ts`, tests);
    } catch (error) {
      this.logger.error('Error writing tests:', error);
    }
  }

  async runTests(projectPath: string): Promise<void> {
    try {
      // Run tests for project
      const testResult = this.geminiService.runTests();
      this.logger.info('Test result:', testResult);
    } catch (error) {
      this.logger.error('Error running tests:', error);
    }
  }

  async generateDocumentation(projectPath: string): Promise<void> {
    try {
      // Generate documentation for project
      const documentation = this.geminiService.generateDocumentation();
      fs.writeFileSync(`${projectPath}/README.md`, documentation);
    } catch (error) {
      this.logger.error('Error generating documentation:', error);
    }
  }

  async createGitHubRepository(projectName: string, projectPath: string): Promise<void> {
    try {
      // Create GitHub repository
      const repository = await this.githubService.createRepository(projectName);
      this.logger.info('Repository created:', repository);

      // Push code to GitHub repository
      await this.githubService.pushCode(projectPath, projectName);
      this.logger.info('Code pushed to repository:', projectName);
    } catch (error) {
      this.logger.error('Error creating GitHub repository:', error);
    }
  }

  private parseArchitectureMd(architectureMd: string): any {
    // Parse architecture.md file to extract project definition
    // For now, just return a dummy project definition
    return {
      name: 'Dummy Project',
      description: 'This is a dummy project',
    };
  }
}

export { OpenClaw };