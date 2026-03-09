import axios, { AxiosError } from 'axios';
import { GitHubConfig } from '../config/GitHubConfig';
import { logger } from '../utils/logger';

interface GitHubResponse {
  id: number;
  name: string;
  full_name: string;
}

class GitHubService {
  private readonly githubConfig: GitHubConfig;
  private readonly githubApiUrl: string;

  constructor(githubConfig: GitHubConfig) {
    this.githubConfig = githubConfig;
    this.githubApiUrl = 'https://api.github.com';
  }

  async createRepository(repositoryName: string): Promise<GitHubResponse> {
    try {
      const response = await axios.post(`${this.githubApiUrl}/repos`, {
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
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error(`Error creating repository: ${error.message}`);
        throw error;
      } else {
        logger.error('Unknown error creating repository');
        throw error;
      }
    }
  }

  async createBranch(repositoryName: string, branchName: string): Promise<void> {
    try {
      await axios.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/branches`, {
        ref: `refs/heads/${branchName}`,
        sha: '',
      }, {
        headers: {
          Authorization: `Bearer ${this.githubConfig.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error(`Error creating branch: ${error.message}`);
        throw error;
      } else {
        logger.error('Unknown error creating branch');
        throw error;
      }
    }
  }

  async commitChanges(repositoryName: string, branchName: string, commitMessage: string, files: { [key: string]: string }): Promise<void> {
    try {
      const response = await axios.get(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/refs/heads/${branchName}`);
      const commitSha = response.data.object.sha;

      const treeResponse = await axios.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/trees`, {
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

      await axios.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/commits`, {
        message: commitMessage,
        tree: treeSha,
        parents: [commitSha],
      }, {
        headers: {
          Authorization: `Bearer ${this.githubConfig.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      await axios.patch(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/git/refs/heads/${branchName}`, {
        sha: treeSha,
      }, {
        headers: {
          Authorization: `Bearer ${this.githubConfig.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error(`Error committing changes: ${error.message}`);
        throw error;
      } else {
        logger.error('Unknown error committing changes');
        throw error;
      }
    }
  }

  async pushChanges(repositoryName: string, branchName: string): Promise<void> {
    try {
      await axios.post(`${this.githubApiUrl}/repos/${this.githubConfig.owner}/${repositoryName}/actions/workflows`, {
        name: 'Build and deploy',
        path: '.github/workflows/deploy.yml',
      }, {
        headers: {
          Authorization: `Bearer ${this.githubConfig.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error(`Error pushing changes: ${error.message}`);
        throw error;
      } else {
        logger.error('Unknown error pushing changes');
        throw error;
      }
    }
  }
}

export { GitHubService };