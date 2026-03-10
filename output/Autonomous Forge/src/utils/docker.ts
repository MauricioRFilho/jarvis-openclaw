import { Docker } from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';

interface DockerOptions {
  image: string;
  workingDir: string;
  cmd: string[];
  env: { [key: string]: string };
}

class DockerUtils {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async createContainer(options: DockerOptions): Promise<string> {
    const container = await this.docker.createContainer({
      Image: options.image,
      WorkingDir: options.workingDir,
      Cmd: options.cmd,
      Env: Object.keys(options.env).map((key) => `${key}=${options.env[key]}`),
      Tty: true,
    });

    return container.id;
  }

  async startContainer(containerId: string): Promise<void> {
    const container = this.docker.getContainer(containerId);
    await container.start();
  }

  async stopContainer(containerId: string): Promise<void> {
    const container = this.docker.getContainer(containerId);
    await container.stop();
  }

  async removeContainer(containerId: string): Promise<void> {
    const container = this.docker.getContainer(containerId);
    await container.remove();
  }

  async createVolume(projectName: string): Promise<string> {
    const volumeName = `autonomous-forge-${projectName}`;
    await this.docker.createVolume({ Name: volumeName });
    return volumeName;
  }

  async removeVolume(volumeName: string): Promise<void> {
    const volume = await this.docker.getVolume(volumeName);
    await volume.remove();
  }

  async copyFileToContainer(containerId: string, filePath: string, targetPath: string): Promise<void> {
    const container = this.docker.getContainer(containerId);
    await container.copy({ Resource: filePath }, targetPath);
  }

  async copyFileFromContainer(containerId: string, filePath: string, targetPath: string): Promise<void> {
    const container = this.docker.getContainer(containerId);
    const data = await container.copy({ Resource: filePath });
    fs.writeFileSync(targetPath, data);
  }

  async execCommandInContainer(containerId: string, cmd: string[]): Promise<string> {
    const container = this.docker.getContainer(containerId);
    const exec = await container.exec({ Cmd: cmd, Tty: true });
    const output = await new Promise((resolve, reject) => {
      let data = '';
      exec.stdout.on('data', (chunk) => {
        data += chunk.toString();
      });
      exec.stdout.on('end', () => {
        resolve(data);
      });
      exec.stderr.on('data', (chunk) => {
        reject(chunk.toString());
      });
    });
    return output;
  }
}

export default DockerUtils;