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
  private apiKeys: Record<string, string | undefined> = {};
  private cooldowns: Record<string, number> = {};
  private primaryProvider: string;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY is missing");
    
    this.gemini = new GoogleGenerativeAI(geminiKey);
    this.apiKeys = {
      gemini: geminiKey,
      groq: process.env.GROQ_API_KEY,
      sambanova: process.env.SAMBANOVA_API_KEY,
      cerebras: process.env.CEREBRAS_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
      deepinfra: process.env.DEEPINFRA_API_KEY,
    };
    this.primaryProvider = (process.env.PRIMARY_LLM || "gemini").toLowerCase();
  }

  async generate(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    const now = Date.now();
    const providers = this.getProviderOrder(now);

    for (const provider of providers) {
      try {
        return await this.callProvider(provider, prompt, systemInstruction);
      } catch (error: any) {
        this.handleRateLimit(provider, error, now);
        console.warn(`⚠️ ${provider.toUpperCase()} failed/throttled. Trying next fallback...`);
      }
    }

    throw new Error("💥 All LLM providers failed or reached their rate limits.");
  }

  private getProviderOrder(now: number): string[] {
    const all = Object.keys(this.apiKeys);
    const ordered: string[] = [];

    if (this.isAvailable(this.primaryProvider, now)) {
      ordered.push(this.primaryProvider);
    }

    for (const p of all) {
      if (p !== this.primaryProvider && this.isAvailable(p, now)) {
        ordered.push(p);
      }
    }

    return ordered;
  }

  private isAvailable(provider: string, now: number): boolean {
    const hasKey = !!this.apiKeys[provider];
    const isNotCooling = now > (this.cooldowns[provider] || 0);
    return hasKey && isNotCooling;
  }

  private handleRateLimit(provider: string, error: any, now: number) {
    const is429 = error.message?.includes("429") || error.message?.includes("quota") || error.response?.status === 429;
    if (is429) {
      console.warn(`🛑 ${provider.toUpperCase()} quota exceeded. 5-minute cooldown.`);
      this.cooldowns[provider] = now + (5 * 60 * 1000);
    }
  }

  private async callProvider(provider: string, prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    switch (provider) {
      case "gemini": return await this.callGemini(prompt, systemInstruction);
      case "groq": return await this.callOpenAICompatible(provider, "https://api.groq.com/openai/v1", "llama-3.3-70b-versatile", prompt, systemInstruction);
      case "sambanova": return await this.callOpenAICompatible(provider, "https://api.sambanova.ai/v1", "Meta-Llama-3.1-70B-Instruct", prompt, systemInstruction);
      case "cerebras": return await this.callOpenAICompatible(provider, "https://api.cerebras.ai/v1", "llama3.1-8b", prompt, systemInstruction);
      case "mistral": return await this.callOpenAICompatible(provider, "https://api.mistral.ai/v1", "mistral-large-latest", prompt, systemInstruction);
      case "openrouter": return await this.callOpenAICompatible(provider, "https://openrouter.ai/api/v1", "deepseek/deepseek-r1:free", prompt, systemInstruction);
      case "deepinfra": return await this.callOpenAICompatible(provider, "https://api.deepinfra.com/v1/openai", "meta-llama/Llama-3.3-70B-Instruct", prompt, systemInstruction);
      default: throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    const modelName = "gemini-2.0-flash";
    try {
      console.log(`🤖 Attempting generation with Gemini (${modelName})...`);
      const model = this.gemini.getGenerativeModel({ model: modelName, systemInstruction });
      const result = await model.generateContent(prompt);
      return { content: (await result.response).text(), provider: "gemini" };
    } catch (error: any) {
      console.error(`❌ Gemini Error: ${error.message}`);
      throw error;
    }
  }

  private async callGroq(prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    return await this.callOpenAICompatible("groq", "https://api.groq.com/openai/v1", "llama-3.3-70b-versatile", prompt, systemInstruction);
  }

  private async callOpenAICompatible(provider: string, baseUrl: string, model: string, prompt: string, systemInstruction?: string): Promise<LLMResponse> {
    try {
      console.log(`🤖 Attempting generation with ${provider.toUpperCase()} (${model})...`);
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model,
          messages: [
            { role: "system", content: systemInstruction || "You are a senior software engineer." },
            { role: "user", content: prompt }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKeys[provider]}`,
            "Content-Type": "application/json"
          }
        }
      );

      return {
        content: response.data.choices[0].message.content,
        provider: provider
      };
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data?.error?.message || error.message || `Unknown ${provider} error`;
      console.error(`❌ ${provider.toUpperCase()} Error [${status}]: ${data}`);
      throw error;
    }
  }
}
