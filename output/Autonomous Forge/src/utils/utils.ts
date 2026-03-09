import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import config from '../../config/config.json';

const dockerCommand = 'docker';
const dockerContainerName = 'autonomous-forge-container';
const githubService = new (require('../services/github/GitHubService').GitHubService)();
const geminiService = new (require('../services/gemini/GeminiService').GeminiService)();

function validateProject Viability(projectData: any): boolean {
    // Implement the logic to validate project viability
    // For now, it's just a placeholder
    return true;
}

function generateProjectStructure(projectName: string): string {
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    const cleanArchitectureDirs = ['domain', 'application', 'infrastructure', 'presentation'];
    cleanArchitectureDirs.forEach((dir) => {
        const dirPath = path.join(projectPath, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    });
    return projectPath;
}

function writeToFile(filepath: string, data: string): void {
    fs.writeFileSync(filepath, data);
}

function copyFile(src: string, dest: string): void {
    fs.copyFileSync(src, dest);
}

function removeFile(filepath: string): void {
    fs.unlinkSync(filepath);
}

function runDockerContainer(): void {
    const dockerRunCmd = `${dockerCommand} run -d --name ${dockerContainerName} -v ${process.cwd()}/:/app -w /app node:latest`;
    execCmd(dockerRunCmd);
}

function stopDockerContainer(): void {
    const dockerStopCmd = `${dockerCommand} stop ${dockerContainerName}`;
    execCmd(dockerStopCmd);
}

function execCmd(cmd: string): void {
    require('child_process').execSync(cmd);
}

function generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterCommands(allowedCommands: string[]): (cmd: string) => boolean {
    return (cmd: string) => allowedCommands.includes(cmd);
}

function getGitHubRepositoryUrl(repoName: string): string {
    return `https://github.com/${config.github.username}/${repoName}`;
}

function getGitHubToken(): string {
    return config.github.token;
}

export {
    validateProjectViability,
    generateProjectStructure,
    writeToFile,
    copyFile,
    removeFile,
    runDockerContainer,
    stopDockerContainer,
    execCmd,
    generateHash,
    sleep,
    filterCommands,
    getGitHubRepositoryUrl,
    getGitHubToken,
};