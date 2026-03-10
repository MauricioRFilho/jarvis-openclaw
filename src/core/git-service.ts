import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

export class GitService {
  constructor(
    private token?: string,
    private username?: string
  ) {}

  /**
   * Initializes a git repo, commits all files, and pushes to GitHub.
   */
  async publish(projectDir: string, repoName: string) {
    if (!this.token || !this.username) {
      console.warn("⚠️ GitHub token or username missing. Skipping publication.");
      return;
    }

    console.log(`🚀 Publishing ${repoName} to GitHub (${this.username})...`);

    try {
      // 0. Create repository via GitHub API if it doesn't exist
      console.log(`📡 Creating repository ${repoName} via GitHub API...`);
      try {
        const createRepoCmd = `curl -H "Authorization: token ${this.token}" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos -d '{"name":"${repoName}", "private": false}'`;
        execSync(createRepoCmd, { stdio: "ignore" });
        console.log("✅ Repository check/creation handled.");
      } catch (e) {
        console.log("ℹ️ Repository might already exist, proceeding...");
      }

      // 1. Git Init
      this.exec(projectDir, "git init");

      // Configure identity
      this.exec(projectDir, `git config user.email "${this.username}@openclaw.io"`);
      this.exec(projectDir, `git config user.name "${this.username} (OpenClaw)"`);

      // 2. Add and Commit
      this.exec(projectDir, "git add .");
      this.exec(projectDir, `git commit -m "Initial commit by OpenClaw"`);

      // 3. Set Remote
      const remoteUrl = `https://${this.username}:${this.token}@github.com/${this.username}/${repoName}.git`;
      
      // Check if remote exists, if so remove it
      try {
        this.exec(projectDir, "git remote remove origin");
      } catch (e) {
        // Ignore if remote doesn't exist
      }
      
      this.exec(projectDir, `git remote add origin ${remoteUrl}`);

      // 4. Create repo via curl (simple approach) or assume it exists
      // Note: In a production version, we would use octokit to create the repo if it doesn't exist.
      // For now, we assume the user might have created it or we try to push.
      console.log("📤 Pushing to master...");
      this.exec(projectDir, "git branch -M master");
      this.exec(projectDir, "git push -u origin master --force");

      console.log(`✅ Project published: https://github.com/${this.username}/${repoName}`);
    } catch (error: any) {
      console.error("❌ Failed to publish to GitHub:");
      console.error(error.message);
    }
  }

  private exec(cwd: string, command: string) {
    return execSync(command, { cwd, stdio: "inherit" });
  }
}
