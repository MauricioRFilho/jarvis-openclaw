import {
  Octokit,
  RestEndpointMethodTypes,
} from '@octokit/octokit';

import { config } from 'dotenv';
import { readFileSync } from 'fs';

config();

class GitHubAPI {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      baseUrl: 'https://api.github.com',
    });
  }

  async createRepository(repoName: string, description: string): Promise<any> {
    try {
      const response = await this.octokit.repos.create({
        name: repoName,
        description: description,
        private: true,
        auto_init: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating repository:', error);
      throw error;
    }
  }

  async createBranch(repoName: string, branchName: string): Promise<any> {
    try {
      const response = await this.octokit.repos.createBranch({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        branch: branchName,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async commitFile(repoName: string, branchName: string, filePath: string, fileContent: string, commitMessage: string): Promise<any> {
    try {
      const response = await this.octokit.repos.createCommit({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        branch: branchName,
        message: commitMessage,
        content: fileContent,
        path: filePath,
      });
      return response.data;
    } catch (error) {
      console.error('Error committing file:', error);
      throw error;
    }
  }

  async getRepositoryContents(repoName: string, filePath: string): Promise<any> {
    try {
      const response = await this.octokit.repos.getContents({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        path: filePath,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting repository contents:', error);
      throw error;
    }
  }

  async pushChanges(repoName: string, branchName: string, commitMessage: string): Promise<any> {
    try {
      const response = await this.octokit.repos.createCommit({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        branch: branchName,
        message: commitMessage,
      });
      return response.data;
    } catch (error) {
      console.error('Error pushing changes:', error);
      throw error;
    }
  }

  async createPullRequest(repoName: string, title: string, body: string, head: string, base: string): Promise<any> {
    try {
      const response = await this.octokit.pulls.create({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        title: title,
        body: body,
        head: head,
        base: base,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating pull request:', error);
      throw error;
    }
  }

  async mergePullRequest(repoName: string, pullNumber: number): Promise<any> {
    try {
      const response = await this.octokit.pulls.merge({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        pull_number: pullNumber,
      });
      return response.data;
    } catch (error) {
      console.error('Error merging pull request:', error);
      throw error;
    }
  }

  async createGitHubActions(repoName: string, workflowFile: string): Promise<any> {
    try {
      const response = await this.octokit.repos.createFile({
        owner: 'MauricioOpenClaw',
        repo: repoName,
        path: `.github/workflows/${workflowFile}`,
        message: `Create GitHub Actions workflow file: ${workflowFile}`,
        content: Buffer.from(readFileSync(`projects/template/workflows/${workflowFile}`)).toString('base64'),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating GitHub Actions workflow file:', error);
      throw error;
    }
  }
}

export default GitHubAPI;