import axios from 'axios';
import { GeminiConfig } from '../config';
import { GeminiRequest, GeminiResponse } from './GeminiModels';
import { Logger } from '../utils/logger';

const GEMINI_API_URL = 'https://api.gemini.ai/v1/';
const GEMINI_MODEL = 'gpt-3.5-turbo';
const GEMINI_MAX_TOKENS = 2048;

class GeminiService {
  private readonly config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  async generateCode(prompt: string): Promise<string> {
    const request: GeminiRequest = {
      model: GEMINI_MODEL,
      prompt,
      max_tokens: GEMINI_MAX_TOKENS,
    };

    try {
      const response = await axios.post(GEMINI_API_URL + 'completions', request, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const geminiResponse: GeminiResponse = response.data;
      return geminiResponse.choices[0].text;
    } catch (error) {
      Logger.error('Gemini API error:', error);
      throw error;
    }
  }

  async refactorCode(prompt: string): Promise<string> {
    const request: GeminiRequest = {
      model: GEMINI_MODEL,
      prompt,
      max_tokens: GEMINI_MAX_TOKENS,
    };

    try {
      const response = await axios.post(GEMINI_API_URL + 'completions', request, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const geminiResponse: GeminiResponse = response.data;
      return geminiResponse.choices[0].text;
    } catch (error) {
      Logger.error('Gemini API error:', error);
      throw error;
    }
  }

  async lintCode(prompt: string): Promise<string> {
    const request: GeminiRequest = {
      model: GEMINI_MODEL,
      prompt,
      max_tokens: GEMINI_MAX_TOKENS,
    };

    try {
      const response = await axios.post(GEMINI_API_URL + 'completions', request, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const geminiResponse: GeminiResponse = response.data;
      return geminiResponse.choices[0].text;
    } catch (error) {
      Logger.error('Gemini API error:', error);
      throw error;
    }
  }
}

export default GeminiService;