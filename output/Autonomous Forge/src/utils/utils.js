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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectViability = void 0;
exports.generateProjectStructure = generateProjectStructure;
exports.writeToFile = writeToFile;
exports.copyFile = copyFile;
exports.removeFile = removeFile;
exports.runDockerContainer = runDockerContainer;
exports.stopDockerContainer = stopDockerContainer;
exports.execCmd = execCmd;
exports.generateHash = generateHash;
exports.sleep = sleep;
exports.filterCommands = filterCommands;
exports.getGitHubRepositoryUrl = getGitHubRepositoryUrl;
exports.getGitHubToken = getGitHubToken;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const config_json_1 = __importDefault(require("../../config/config.json"));
const dockerCommand = 'docker';
const dockerContainerName = 'autonomous-forge-container';
const githubService = new (require('../services/github/GitHubService').GitHubService)();
const geminiService = new (require('../services/gemini/GeminiService').GeminiService)();
function validateProject() { }
Viability(projectData, any);
boolean;
{
    // Implement the logic to validate project viability
    // For now, it's just a placeholder
    return true;
}
function generateProjectStructure(projectName) {
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
function writeToFile(filepath, data) {
    fs.writeFileSync(filepath, data);
}
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
}
function removeFile(filepath) {
    fs.unlinkSync(filepath);
}
function runDockerContainer() {
    const dockerRunCmd = `${dockerCommand} run -d --name ${dockerContainerName} -v ${process.cwd()}/:/app -w /app node:latest`;
    execCmd(dockerRunCmd);
}
function stopDockerContainer() {
    const dockerStopCmd = `${dockerCommand} stop ${dockerContainerName}`;
    execCmd(dockerStopCmd);
}
function execCmd(cmd) {
    require('child_process').execSync(cmd);
}
function generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function filterCommands(allowedCommands) {
    return (cmd) => allowedCommands.includes(cmd);
}
function getGitHubRepositoryUrl(repoName) {
    return `https://github.com/${config_json_1.default.github.username}/${repoName}`;
}
function getGitHubToken() {
    return config_json_1.default.github.token;
}
