import * as fs from "fs";
import * as path from "path";

export interface FileNode {
  name?: string;
  path?: string;
  content?: string;
}

export interface FolderNode {
  name: string;
  folders?: FolderNode[];
  files?: FileNode[];
}

export interface ProjectStructure {
  name: string;
  folders?: (string | FolderNode)[];
  files?: FileNode[];
}

export class Scaffolder {
  /**
   * Scaffolds the project structure in the specified base directory.
   * Handles nested folder/file structures recursively.
   */
  async scaffold(structure: ProjectStructure, baseDir: string = "output") {
    const projectDir = path.join(process.cwd(), baseDir, structure.name);
    
    console.log(`🏗️ Scaffolding project: ${structure.name} at ${projectDir}`);
    
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // Process top-level folders
    if (structure.folders && Array.isArray(structure.folders)) {
      for (const node of structure.folders) {
        this.processFolder(node, projectDir);
      }
    }

    // Process top-level files
    if (structure.files && Array.isArray(structure.files)) {
      for (const file of structure.files) {
        this.processFile(file, projectDir);
      }
    }
    
    console.log("✅ Scaffolding complete.");
    return projectDir;
  }

  private processFolder(node: string | FolderNode, parentPath: string) {
    if (typeof node === "string") {
      const folderPath = path.join(parentPath, node);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`📁 Created folder: ${folderPath.replace(process.cwd(), "")}`);
      }
    } else if (node && typeof node === "object" && node.name) {
      const folderPath = path.join(parentPath, node.name);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`📁 Created folder: ${folderPath.replace(process.cwd(), "")}`);
      }

      if (node.folders && Array.isArray(node.folders)) {
        for (const subFolder of node.folders) {
          this.processFolder(subFolder, folderPath);
        }
      }

      if (node.files && Array.isArray(node.files)) {
        for (const file of node.files) {
          this.processFile(file, folderPath);
        }
      }
    } else {
      console.warn("⚠️ Skipping invalid folder node:", node);
    }
  }

  private processFile(file: FileNode, parentPath: string) {
    const fileName = file.path || file.name;
    if (!fileName || typeof fileName !== "string") {
      console.warn("⚠️ Skipping invalid file entry:", file);
      return;
    }

    const filePath = path.join(parentPath, fileName);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.content || "");
    console.log(`📄 Created file: ${filePath.replace(process.cwd(), "")}`);
  }
}
