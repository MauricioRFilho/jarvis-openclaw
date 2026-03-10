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
exports.GitHubService = void 0;
const axios_1 = __importStar(require("axios"));
const logger_1 = require("../utils/logger");
class GitHubService {
    githubConfig;
    githubApiUrl;
    constructor(githubConfig) {
        this.githubConfig = githubConfig;
        this.githubApiUrl = 'https://api.github.com';
    }
    async createRepository(repositoryName) {
        try {
            const response = await axios_1.default.post(`${this.githubApiUrl}/repos`, {
                name: repositoryName,
                description: '',
                private: true,
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubConfig.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                logger_1.logger.error(`Error creating repository: ${error.message}`);
                throw error;
            }
            else {
                logger_1.logger.error('Unknown error creating repository');
                throw error;
            }
        }
    }
    async createBranch(repositoryName, branchName) {
        try {
            await axios_1.default.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/branches`, {
                ref: `refs/heads/${branchName}`,
                sha: '',
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubConfig.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                logger_1.logger.error(`Error creating branch: ${error.message}`);
                throw error;
            }
            else {
                logger_1.logger.error('Unknown error creating branch');
                throw error;
            }
        }
    }
    async commitChanges(repositoryName, branchName, commitMessage, files) {
        try {
            const response = await axios_1.default.get(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/refs/heads/${branchName}`);
            const commitSha = response.data.object.sha;
            const treeResponse = await axios_1.default.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/trees`, {
                base_tree: commitSha,
                tree: Object.keys(files).map((file) => ({
                    path: file,
                    mode: '100644',
                    type: 'blob',
                    content: files[file],
                })),
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubConfig.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const treeSha = treeResponse.data.sha;
            await axios_1.default.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/commits`, {
                message: commitMessage,
                tree: treeSha,
                parents: [commitSha],
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubConfig.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            await axios_1.default.patch(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/refs/heads/${branchName}`, {
                sha: treeSha,
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubConfig.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                logger_1.logger.error(`Error committing changes: ${error.message}`);
                throw error;
            }
            else {
                logger_1.logger.error('Unknown error committing changes');
                throw error;
            }
        }
    }
    async pushChanges(repositoryName, branchName) {
        try {
            await axios_1.default.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/actions/workflows`, {
                name: 'Build and deploy',
                path: '.github/workflows/deploy.yml',
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubConfig.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                logger_1.logger.error(`Error pushing changes: ${error.message}`);
                throw error;
            }
            else {
                logger_1.logger.error('Unknown error pushing changes');
                throw error;
            }
        }
    }
}
exports.GitHubService = GitHubService;
