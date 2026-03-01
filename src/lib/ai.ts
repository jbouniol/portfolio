import {
  ADMIN_CHAT_MODELS,
  DEFAULT_ADMIN_CHAT_MODEL,
  type AdminChatModel,
} from "@/lib/admin-chat-models";
import { fetchWithTimeout } from "@/lib/fetch";

export { ADMIN_CHAT_MODELS, DEFAULT_ADMIN_CHAT_MODEL };
export type { AdminChatModel };

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export function isAdminChatModel(value: string): value is AdminChatModel {
  return ADMIN_CHAT_MODELS.some((model) => model.value === value);
}

export function resolveAdminChatModel(value: unknown): AdminChatModel {
  if (typeof value === "string" && isAdminChatModel(value)) {
    return value;
  }
  return DEFAULT_ADMIN_CHAT_MODEL;
}

function isGeminiModel(model: AdminChatModel) {
  return model.startsWith("gemini-");
}

async function runMistralChat({
  model,
  turns,
  systemPrompt,
  temperature,
  maxTokens,
}: {
  model: AdminChatModel;
  turns: ChatTurn[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY not configured");
  }

  const response = await fetchWithTimeout("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...turns],
      temperature,
      max_tokens: maxTokens,
    }),
    timeoutMs: 25_000,
  });

  if (response.status === 408) {
    throw new Error("Mistral request timed out");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral error: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string" && content.trim()) {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part: { type?: string; text?: string }) => part?.text ?? "")
      .join("")
      .trim();
    if (text) return text;
  }

  throw new Error("Mistral returned empty content");
}

async function runGeminiChat({
  model,
  turns,
  systemPrompt,
  temperature,
  maxTokens,
}: {
  model: AdminChatModel;
  turns: ChatTurn[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: turns.map((turn) => ({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }],
        })),
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
      timeoutMs: 25_000,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error: ${errorText}`);
  }

  const data = await response.json();
  const parts: Array<{ text?: string }> =
    data?.candidates?.[0]?.content?.parts ?? [];
  const content = parts
    .map((part) => part?.text ?? "")
    .join("")
    .trim();

  if (!content) {
    throw new Error("Gemini returned empty content");
  }

  return content;
}

export async function generateAdminChatCompletion({
  model,
  turns,
  systemPrompt,
  temperature = 0.4,
  maxTokens = 1200,
}: {
  model: AdminChatModel;
  turns: ChatTurn[];
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  if (isGeminiModel(model)) {
    return runGeminiChat({ model, turns, systemPrompt, temperature, maxTokens });
  }

  return runMistralChat({
    model,
    turns,
    systemPrompt,
    temperature,
    maxTokens,
  });
}
