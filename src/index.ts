import * as dotenv from "dotenv";
dotenv.config();

import { LLMProvider } from "./core/llm-provider";
import { Scaffolder, ProjectStructure } from "./core/scaffolder";
import { Coder } from "./core/coder";
import { GitService } from "./core/git-service";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

async function chatMode(llm: LLMProvider) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  console.clear();
  console.log("----------------------------------------------------------------");
  console.log("       🛰️  OPENCLAW: MODO CHAT INTERATIVO (ClawSmith)  🛰️       ");
  console.log("----------------------------------------------------------------");
  console.log("Converse com o arquiteto do projeto. Digite 'exit' para sair.");
  console.log("----------------------------------------------------------------\n");

  const history: { role: string, content: string }[] = [];
  const systemPrompt = `You are ClawSmith, a senior software architect. 
  You are in a chat session with the user. Help them brainstorm, clarify requirements, and design the system.
  Be proactive, technical, and always consider Brazilian laws (LGPD).
  Current project objective is defined in start.md.`;

  const ask = () => {
    rl.question("\n👤 VOCÊ: ", async (input) => {
      if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        console.log("\n👋 Saindo do modo chat...");
        rl.close();
        return;
      }

      history.push({ role: "user", content: input });
      
      try {
        process.stdout.write("🤖 CLAWSMITH: ");
        const prompt = history.map(h => `${h.role === 'user' ? 'User' : 'ClawSmith'}: ${h.content}`).join("\n");
        const response = await llm.generate(prompt, systemPrompt);
        
        console.log(response.content);
        history.push({ role: "assistant", content: response.content });
      } catch (error: any) {
        console.error("\n❌ Erro na resposta:", error.message);
      }

      ask();
    });
  };

  ask();
}

async function main() {
  const llm = new LLMProvider();
  const scaffolder = new Scaffolder();
  const coder = new Coder(llm);
  const git = new GitService(process.env.GITHUB_TOKEN, process.env.GITHUB_USERNAME);

  if (process.env.MODE === "chat") {
    await chatMode(llm);
    return;
  }
  
  // 1. Read Briefing
  const briefingPath = path.join(process.cwd(), "start.md");
  if (!fs.existsSync(briefingPath)) {
    console.error("❌ start.md not found. Place your briefing in the root directory.");
    return;
  }

  const briefing = fs.readFileSync(briefingPath, "utf-8");
  console.log("📖 Briefing loaded. Analyzing project scope...");

  // 2. Initial Analysis / Task Generation / Structure
  const planPrompt = `Briefing: ${briefing}\n\nAnalyze the briefing and generate a detailed project plan in JSON format.
  The agent must act with FULL AUTONOMY to achieve the goals described in the briefing.
  CRITICAL: All generated code, structures, and business logic MUST STRICTLY COMPLY with Brazilian laws (including but not limited to LGPD).
  The JSON must include:
  - "backlog": An array of tasks (id, name, description, dependencies).
  - "structure": A suggested folder and file structure for the project (name, folders, files).
  Files in structure should have an optional "content" field for initial boilerplates.
  
  Output ONLY the JSON.`;

  const systemPrompt = `You are ClawSmith, a senior software architect. Output ONLY raw JSON.`;
  
  let plan: any = null;
  let attempts = 0;
  const maxAttempts = 5;

  while (!plan && attempts < maxAttempts) {
    try {
      console.log(`📡 Analysis attempt ${attempts + 1}/${maxAttempts}...`);
      const response = await llm.generate(planPrompt, systemPrompt);
      
      // Balanced brace extraction
      let content = response.content.trim();
      let start = content.indexOf('{');
      let jsonContent = "";
      
      if (start !== -1) {
        let count = 0;
        for (let i = start; i < content.length; i++) {
          if (content[i] === '{') count++;
          else if (content[i] === '}') {
            count--;
            if (count === 0) {
              jsonContent = content.substring(start, i + 1);
              break;
            }
          }
        }
      }

      if (!jsonContent) throw new Error("No JSON found in response");
      
      plan = JSON.parse(jsonContent);
      console.log(`✅ Plan parsed successfully via ${response.provider.toUpperCase()}`);
    } catch (error: any) {
      attempts++;
      console.warn(`⚠️ Attempt ${attempts} failed to generate valid JSON: ${error.message}`);
      // If it's a parsing error, the next llm.generate call will naturally try another provider 
      // because we can manually trigger a cooldown if we want, but for now we'll just retry.
    }
  }

  if (!plan) {
    throw new Error("💥 Failed to generate a valid JSON plan after multiple attempts.");
  }
  
  try {
    // Save full plan for debug
    fs.writeFileSync("plan.json", JSON.stringify(plan || {}, null, 2));
    
    // Save backlog if exists
    if (plan.backlog) {
      fs.writeFileSync("backlog.json", JSON.stringify(plan.backlog, null, 2));
      console.log("💾 Backlog saved to backlog.json");
    }
    console.log("💾 Plan saved to plan.json");
    
    console.log("🛠️ Phase 3: Scaffolding...");
    let projectDir = "";
    if (plan.structure) {
      console.log("🛠️ Starting scaffolding phase...");
      // Ensure name exists
      if (!plan.structure.name) {
        plan.structure.name = "generated-app-" + Date.now();
      }
      projectDir = await scaffolder.scaffold(plan.structure);
    }
    
    console.log("🛠️ Phase 4: Coding...");
    if (projectDir) {
      await coder.generateCode(projectDir, plan.structure, briefing);
      
      // 5. Publish to GitHub
      console.log("🛠️ Phase 5: Publishing...");
      await git.publish(projectDir, plan.structure.name);
    }
    
    console.log("🏁 OpenClaw work complete! Repositories are ready in output/ folder.");
  } catch (error: any) {
    const errorMsg = error.message || error;
    console.error("💥 Critical error during orchestration:");
    console.error(errorMsg);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

main();
