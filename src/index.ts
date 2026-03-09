import * as dotenv from "dotenv";
dotenv.config();

import { LLMProvider } from "./core/llm-provider";
import { Scaffolder, ProjectStructure } from "./core/scaffolder";
import { Coder } from "./core/coder";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const llm = new LLMProvider();
  const scaffolder = new Scaffolder();
  const coder = new Coder(llm);
  
  // 1. Read Briefing
  const briefingPath = path.join(process.cwd(), "start.md");
  if (!fs.existsSync(briefingPath)) {
    console.error("❌ start.md not found. Place your briefing in the root directory.");
    return;
  }

  const briefing = fs.readFileSync(briefingPath, "utf-8");
  console.log("📖 Briefing loaded. Analyzing project scope...");

  // 2. Initial Analysis / Task Generation / Structure
  const systemPrompt = `You are ClawSmith, a senior software architect. 
Analyze the briefing and generate a detailed project plan in JSON format.
The JSON must include:
- "backlog": An array of tasks (id, name, description, dependencies).
- "structure": A suggested folder and file structure for the project (name, folders, files).
Files in structure should have an optional "content" field for initial boilerplates.

Output ONLY the JSON.`;
  
  try {
    const response = await llm.generate(`Briefing: ${briefing}\n\nGenerate the JSON plan.`, systemPrompt);
    console.log(`✅ Analysis complete via ${response.provider.toUpperCase()}`);
    
    // Clean markdown code blocks if any
    let content = response.content.trim();
    if (content.startsWith("```json")) content = content.substring(7);
    if (content.endsWith("```")) content = content.substring(0, content.length - 3);
    
    const plan = JSON.parse(content.trim());
    
    // Save full plan for debug
    fs.writeFileSync("plan.json", JSON.stringify(plan, null, 2));
    
    // Save backlog
    fs.writeFileSync("backlog.json", JSON.stringify(plan.backlog, null, 2));
    console.log("💾 Plan saved to plan.json and backlog.json");
    
    // 3. Scaffolding
    let projectDir = "";
    if (plan.structure) {
      console.log("🛠️ Starting scaffolding phase...");
      projectDir = await scaffolder.scaffold(plan.structure);
    }
    
    // 4. Core Coding
    if (projectDir) {
      await coder.generateCode(projectDir, plan.structure, briefing);
    }
    
  } catch (error: any) {
    const errorMsg = error.message || error;
    console.error("💥 Critical error during orchestration:");
    console.error(errorMsg);
  }
}

main();
