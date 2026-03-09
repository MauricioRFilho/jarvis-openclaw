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
    } catch (error: any) {
      console.error("⚠️ Gemini failed, triggering failover to Groq...");
      if (error.response?.data) console.error("Gemini Error Detail:", JSON.stringify(error.response.data, null, 2));
      
      if (this.groqApiKey) {
        try {
          return await this.callGroq(prompt, systemInstruction);
        } catch (groqError: any) {
          if (groqError.response?.data) console.error("Groq Error Detail:", JSON.stringify(groqError.response.data, null, 2));
          throw groqError;
        }
      }
      throw error;
    }
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    try {
      const model = this.gemini.getGenerativeModel({ 
        model: "gemini-1.5-flash", // More stable for some regions
        systemInstruction: systemInstruction 
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        content: response.text(),
        provider: "gemini"
      };
    } catch (error: any) {
      const msg = error.message || "Unknown Gemini error";
      console.error(`❌ Gemini Call Error: ${msg}`);
      throw error;
    }
  }

  private async callGroq(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
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
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data?.error?.message || error.message || "Unknown Groq error";
      console.error(`❌ Groq Call Error [${status}]: ${data}`);
      throw error;
    }
  }
}
