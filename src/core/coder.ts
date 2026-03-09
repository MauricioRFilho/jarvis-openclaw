import { LLMProvider } from "./llm-provider";
import * as fs from "fs";
import * as path from "path";

export interface FileTask {
  path: string;
}

export class Coder {
  constructor(private llm: LLMProvider) {}

  /**
   * Generates implementation for each file in the project structure.
   */
  async generateCode(projectDir: string, structure: any, briefing: string) {
    console.log(`🚀 Starting Core Coding for project at ${projectDir}`);
    
    const files = this.collectFiles(structure);
    console.log(`📊 Total files to implement: ${files.length}`);
    
    for (const file of files) {
      console.log(`📝 Generating code for: ${file.path}`);
      
      const systemPrompt = `You are ClawSmith, a senior software engineer specialized in Clean Architecture and high-performance systems.
Implement the following file based on this project briefing:
---
${briefing}
---
The file you are writing is located at: ${file.path}
The project root contains these files: ${files.map(f => f.path).join(", ")}

Guidelines:
- Follow senior-level patterns.
- Ensure the code is production-ready.
- Output ONLY the raw code. Do NOT enclose in markdown code blocks.
- Do NOT include any explanations or comments outside the code.`;

      try {
        const response = await this.llm.generate(`File: ${file.path}\nImplement the code.`, systemPrompt);
        
        let code = response.content.trim();
        // Fallback cleaning if LLM includes blocks
        if (code.startsWith("```")) {
           code = code.replace(/^```[a-z]*\n/, "").replace(/\n```$/, "");
        }
        
        const fullPath = path.join(projectDir, file.path);
        fs.writeFileSync(fullPath, code);
        console.log(`✅ File ${file.path} implemented.`);
      } catch (error) {
        console.error(`❌ Error implementing ${file.path}:`, error);
      }
    }
    
    console.log("🏁 Core Coding phase complete.");
  }

  private collectFiles(node: any, currentPath: string = ""): FileTask[] {
    let files: FileTask[] = [];
    
    // Process files at this level
    if (node.files && Array.isArray(node.files)) {
      for (const f of node.files) {
        const fileName = f.path || f.name;
        if (fileName && typeof fileName === "string") {
          files.push({ path: path.join(currentPath, fileName) });
        }
      }
    }
    
    // Process subfolders
    if (node.folders && Array.isArray(node.folders)) {
      for (const f of node.folders) {
        const folderName = f.name || (typeof f === "string" ? f : null);
        if (folderName) {
          files = files.concat(this.collectFiles(f, path.join(currentPath, folderName)));
        }
      }
    }
    
    return files;
  }
}
