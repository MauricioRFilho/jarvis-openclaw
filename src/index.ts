import { LLMProvider } from "./core/llm-provider";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const llm = new LLMProvider();
  
  // 1. Read Briefing (start.md or architecture.md)
  const briefingPath = path.join(process.cwd(), "start.md");
  if (!fs.existsSync(briefingPath)) {
    console.error("❌ start.md not found. Place your briefing in the root directory.");
    return;
  }

  const briefing = fs.readFileSync(briefingPath, "utf-8");
  console.log("📖 Briefing loaded. Analyzing project scope...");

  // 2. Initial Analysis / Task Generation
  const systemPrompt = "You are ClawSmith, a senior software architect. Analyze the briefing and generate a detailed implementation backlog in JSON format.";
  
  try {
    const response = await llm.generate(`Briefing: ${briefing}\n\nGenerate the JSON backlog.`, systemPrompt);
    console.log(`✅ Analysis complete via ${response.provider.toUpperCase()}`);
    console.log("--- BACKLOG ---");
    console.log(response.content);
    
    // Save backlog
    fs.writeFileSync("backlog.json", response.content);
    console.log("💾 Backlog saved to backlog.json");
    
  } catch (error) {
    console.error("💥 Critical error during orchestration:", error);
  }
}

main();
