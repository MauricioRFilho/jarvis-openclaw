import { Injectable } from 'tsyringe';
import { LanguageModelInterface } from './LanguageModelInterface';
import { GeminiModel } from './GeminiModel';
import { GroqModel } from './GroqModel';

@Injectable()
export class LanguageModel implements LanguageModelInterface {
  private primaryModel: GeminiModel;
  private failoverModel: GroqModel;

  constructor() {
    this.primaryModel = new GeminiModel();
    this.failoverModel = new GroqModel();
  }

  async generateCode(input: string): Promise<string> {
    try {
      return await this.primaryModel.generateCode(input);
    } catch (error) {
      console.log('Error occurred in primary model. Failing over to secondary model.');
      return await this.failoverModel.generateCode(input);
    }
  }

  async validateInput(input: string): Promise<boolean> {
    return this.primaryModel.validateInput(input);
  }

  async getAvailableModels(): Promise<string[]> {
    return [this.primaryModel.getName(), this.failoverModel.getName()];
  }
}

class GeminiModel {
  private name: string;

  constructor() {
    this.name = 'Gemini 1.5 Pro';
  }

  async generateCode(input: string): Promise<string> {
    // Implement Gemini 1.5 Pro model logic here
    return `Generated code using ${this.name}: ${input}`;
  }

  async validateInput(input: string): Promise<boolean> {
    // Implement input validation logic for Gemini 1.5 Pro model here
    return true;
  }

  getName(): string {
    return this.name;
  }
}

class GroqModel {
  private name: string;

  constructor() {
    this.name = 'Groq (Llama 3 70B)';
  }

  async generateCode(input: string): Promise<string> {
    // Implement Groq (Llama 3 70B) model logic here
    return `Generated code using ${this.name}: ${input}`;
  }

  async validateInput(input: string): Promise<boolean> {
    // Implement input validation logic for Groq (Llama 3 70B) model here
    return true;
  }

  getName(): string {
    return this.name;
  }
}