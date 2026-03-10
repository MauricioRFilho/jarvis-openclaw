import axios, { AxiosRequestConfig } from 'axios';
import { env } from '../env';

const githubApiUrl = 'https://api.github.com';
const githubToken = env.GITHUB_TOKEN;
const githubUsername = env.GITHUB_USERNAME;

const axiosConfig: AxiosRequestConfig = {
  headers: {
    Authorization: `Bearer ${githubToken}`,
    'Content-Type': 'application/json',
  },
};

const githubClient = axios.create(axiosConfig);

interface CreateRepositoryParams {
  name: string;
  description: string;
}

async function createRepository({ name, description }: CreateRepositoryParams) {
  try {
    const response = await githubClient.post(`${githubApiUrl}/repos`, {
      name,
      description,
      private: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create repository: ${error.message}`);
  }
}

interface CreateBranchParams {
  owner: string;
  repo: string;
  branch: string;
}

async function createBranch({ owner, repo, branch }: CreateBranchParams) {
  try {
    const response = await githubClient.post(`${githubApiUrl}/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha: await getLatestCommitSha({ owner, repo }),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create branch: ${error.message}`);
  }
}

interface GetLatestCommitShaParams {
  owner: string;
  repo: string;
}

async function getLatestCommitSha({ owner, repo }: GetLatestCommitShaParams) {
  try {
    const response = await githubClient.get(`${githubApiUrl}/repos/${owner}/${repo}/git/refs/heads/main`);
    return response.data.object.sha;
  } catch (error) {
    throw new Error(`Failed to get latest commit SHA: ${error.message}`);
  }
}

interface CommitCodeParams {
  owner: string;
  repo: string;
  branch: string;
  message: string;
  code: string;
}

async function commitCode({ owner, repo, branch, message, code }: CommitCodeParams) {
  try {
    const latestCommitSha = await getLatestCommitSha({ owner, repo });
    const tree = await createTree({ owner, repo, branch, code });
    const commit = await createCommit({ owner, repo, branch, message, tree, latestCommitSha });
    await updateReference({ owner, repo, branch, commit.sha });
  } catch (error) {
    throw new Error(`Failed to commit code: ${error.message}`);
  }
}

interface CreateTreeParams {
  owner: string;
  repo: string;
  branch: string;
  code: string;
}

async function createTree({ owner, repo, branch, code }: CreateTreeParams) {
  try {
    const response = await githubClient.post(`${githubApiUrl}/repos/${owner}/${repo}/git/trees`, {
      tree: [
        {
          path: 'code.ts',
          mode: '100644',
          type: 'blob',
          content: Buffer.from(code).toString('base64'),
        },
      ],
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create tree: ${error.message}`);
  }
}

interface CreateCommitParams {
  owner: string;
  repo: string;
  branch: string;
  message: string;
  tree: any;
  parent: string;
}

async function createCommit({ owner, repo, branch, message, tree, parent }: CreateCommitParams) {
  try {
    const response = await githubClient.post(`${githubApiUrl}/repos/${owner}/${repo}/git/commits`, {
      message,
      tree: tree.sha,
      parents: [parent],
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create commit: ${error.message}`);
  }
}

interface UpdateReferenceParams {
  owner: string;
  repo: string;
  branch: string;
  sha: string;
}

async function updateReference({ owner, repo, branch, sha }: UpdateReferenceParams) {
  try {
    await githubClient.patch(`${githubApiUrl}/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      sha,
    });
  } catch (error) {
    throw new Error(`Failed to update reference: ${error.message}`);
  }
}

export {
  createRepository,
  createBranch,
  getLatestCommitSha,
  commitCode,
};