import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export interface LLMResponse {
  content: string;
  usage?: any;
  provider: string;
}

export class LLMProvider {
  private gemini: GoogleGenerativeAI;
  private groqApiKey: string | undefined;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY is missing");
    
    this.gemini = new GoogleGenerativeAI(geminiKey);
    this.groqApiKey = process.env.GROQ_API_KEY;
  }

  async generate(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    try {
      console.log("🤖 Attempting generation with Gemini...");
      return await this.callGemini(prompt, systemInstruction);
    } catch (error) {
      console.error("⚠️ Gemini failed, triggering failover to Groq...", error);
      if (this.groqApiKey) {
        return await this.callGroq(prompt, systemInstruction);
      }
      throw error;
    }
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    const model = this.gemini.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: systemInstruction 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      content: response.text(),
      provider: "gemini"
    };
  }

  private async callGroq(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemInstruction || "You are a senior software engineer." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${this.groqApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      provider: "groq"
    };
  }
}
