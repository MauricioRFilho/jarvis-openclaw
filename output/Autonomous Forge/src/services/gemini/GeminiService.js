"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
const GEMINI_API_URL = 'https://api.gemini.ai/v1/';
const GEMINI_MODEL = 'gpt-3.5-turbo';
const GEMINI_MAX_TOKENS = 2048;
class GeminiService {
    config;
    constructor(config) {
        this.config = config;
    }
    async generateCode(prompt) {
        const request = {
            model: GEMINI_MODEL,
            prompt,
            max_tokens: GEMINI_MAX_TOKENS,
        };
        try {
            const response = await axios_1.default.post(GEMINI_API_URL + 'completions', request, {
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            const geminiResponse = response.data;
            return geminiResponse.choices[0].text;
        }
        catch (error) {
            logger_1.Logger.error('Gemini API error:', error);
            throw error;
        }
    }
    async refactorCode(prompt) {
        const request = {
            model: GEMINI_MODEL,
            prompt,
            max_tokens: GEMINI_MAX_TOKENS,
        };
        try {
            const response = await axios_1.default.post(GEMINI_API_URL + 'completions', request, {
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            const geminiResponse = response.data;
            return geminiResponse.choices[0].text;
        }
        catch (error) {
            logger_1.Logger.error('Gemini API error:', error);
            throw error;
        }
    }
    async lintCode(prompt) {
        const request = {
            model: GEMINI_MODEL,
            prompt,
            max_tokens: GEMINI_MAX_TOKENS,
        };
        try {
            const response = await axios_1.default.post(GEMINI_API_URL + 'completions', request, {
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            const geminiResponse = response.data;
            return geminiResponse.choices[0].text;
        }
        catch (error) {
            logger_1.Logger.error('Gemini API error:', error);
            throw error;
        }
    }
}
exports.default = GeminiService;
