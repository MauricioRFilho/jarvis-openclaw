import { ClawSmithAgent } from '../src/agents/ClawSmithAgent';
import { DockerUtils } from '../src/utils/docker';
import { GitHubUtils } from '../src/utils/github';
import { config } from 'dotenv';
import { beforeEach, expect, jest, test } from '@jest/globals';

config();

describe('ClawSmithAgent', () => {
  let agent: ClawSmithAgent;

  beforeEach(() => {
    agent = new ClawSmithAgent();
  });

  test('should create a new project', async () => {
    // Arrange
    const projectName = 'test-project';
    const projectDescription = 'Test project for ClawSmithAgent';

    // Act
    await agent.createProject(projectName, projectDescription);

    // Assert
    const projectExists = await DockerUtils.projectExists(projectName);
    expect(projectExists).toBe(true);
  });

  test('should generate code for a new project', async () => {
    // Arrange
    const projectName = 'test-project';
    const projectDescription = 'Test project for ClawSmithAgent';

    // Act
    await agent.generateCode(projectName, projectDescription);

    // Assert
    const files = await DockerUtils.getProjectFiles(projectName);
    expect(files).toContain('architecture.md');
    expect(files).toContain('README.md');
    expect(files).toContain('src');
  });

  test('should commit and push code to GitHub', async () => {
    // Arrange
    const projectName = 'test-project';
    const projectDescription = 'Test project for ClawSmithAgent';

    // Act
    await agent.commitAndPushCode(projectName, projectDescription);

    // Assert
    const repoExists = await GitHubUtils.repoExists(projectName);
    expect(repoExists).toBe(true);
  });

  test('should handle errors when creating a new project', async () => {
    // Arrange
    const projectName = 'test-project';
    const projectDescription = 'Test project for ClawSmithAgent';
    jest.spyOn(DockerUtils, 'createProject').mockRejectedValue(new Error('Failed to create project'));

    // Act and Assert
    await expect(agent.createProject(projectName, projectDescription)).rejects.toThrowError(
      'Failed to create project'
    );
  });

  test('should handle errors when generating code for a new project', async () => {
    // Arrange
    const projectName = 'test-project';
    const projectDescription = 'Test project for ClawSmithAgent';
    jest.spyOn(DockerUtils, 'generateCode').mockRejectedValue(new Error('Failed to generate code'));

    // Act and Assert
    await expect(agent.generateCode(projectName, projectDescription)).rejects.toThrowError(
      'Failed to generate code'
    );
  });

  test('should handle errors when committing and pushing code to GitHub', async () => {
    // Arrange
    const projectName = 'test-project';
    const projectDescription = 'Test project for ClawSmithAgent';
    jest.spyOn(GitHubUtils, 'commitAndPushCode').mockRejectedValue(new Error('Failed to commit and push code'));

    // Act and Assert
    await expect(agent.commitAndPushCode(projectName, projectDescription)).rejects.toThrowError(
      'Failed to commit and push code'
    );
  });
});