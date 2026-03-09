import { fetchWithTimeout } from "@/lib/fetch";

type AskAIProvider = "mistral" | "openai";

interface AskAICompletionResult {
  content: string;
  provider: AskAIProvider;
  model: string;
}

class AskAIProviderError extends Error {
  provider: AskAIProvider;
  status?: number;

  constructor({
    provider,
    message,
    status,
  }: {
    provider: AskAIProvider;
    message: string;
    status?: number;
  }) {
    super(message);
    this.name = "AskAIProviderError";
    this.provider = provider;
    this.status = status;
  }
}

function hasConfiguredKey(value: string | undefined) {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && !trimmed.startsWith("your_");
}

function extractTextContent(content: unknown) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }
      return "";
    })
    .join("")
    .trim();
}

function shouldFallbackToOpenAI(error: unknown) {
  if (!(error instanceof AskAIProviderError)) {
    return true;
  }

  if (error.provider !== "mistral") {
    return false;
  }

  if (error.status === 408 || error.status === 429) {
    return true;
  }

  if (typeof error.status === "number" && error.status >= 500) {
    return true;
  }

  return /quota|credit|billing|insufficient|token|rate.?limit|too many requests|timeout|timed out|unavailable|overloaded/i.test(
    error.message
  );
}

async function runMistralAskAI({
  systemPrompt,
  query,
}: {
  systemPrompt: string;
  query: string;
}): Promise<AskAICompletionResult> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!hasConfiguredKey(apiKey)) {
    throw new Error("MISTRAL_API_KEY not configured");
  }

  const model = "mistral-small-latest";
  const response = await fetchWithTimeout("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    }),
    timeoutMs: 25_000,
  });

  if (response.status === 408) {
    throw new AskAIProviderError({
      provider: "mistral",
      status: response.status,
      message: "Mistral request timed out",
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new AskAIProviderError({
      provider: "mistral",
      status: response.status,
      message: `Mistral error: ${errorText}`,
    });
  }

  const data = await response.json();
  const content = extractTextContent(data?.choices?.[0]?.message?.content);
  if (!content) {
    throw new AskAIProviderError({
      provider: "mistral",
      message: "Mistral returned empty content",
    });
  }

  return { content, provider: "mistral", model };
}

async function runOpenAIAskAI({
  systemPrompt,
  query,
}: {
  systemPrompt: string;
  query: string;
}): Promise<AskAICompletionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!hasConfiguredKey(apiKey)) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const model = process.env.OPENAI_ASK_AI_MODEL?.trim() || "gpt-4o-mini";
  const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    }),
    timeoutMs: 25_000,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AskAIProviderError({
      provider: "openai",
      status: response.status,
      message: `OpenAI error: ${errorText}`,
    });
  }

  const data = await response.json();
  const content = extractTextContent(data?.choices?.[0]?.message?.content);
  if (!content) {
    throw new AskAIProviderError({
      provider: "openai",
      message: "OpenAI returned empty content",
    });
  }

  return { content, provider: "openai", model };
}

export async function generateAskAICompletion({
  systemPrompt,
  query,
}: {
  systemPrompt: string;
  query: string;
}): Promise<AskAICompletionResult> {
  const hasMistral = hasConfiguredKey(process.env.MISTRAL_API_KEY);
  const hasOpenAI = hasConfiguredKey(process.env.OPENAI_API_KEY);

  if (!hasMistral && !hasOpenAI) {
    throw new Error("MISTRAL_API_KEY not configured");
  }

  let mistralError: unknown = null;

  if (hasMistral) {
    try {
      return await runMistralAskAI({ systemPrompt, query });
    } catch (error) {
      mistralError = error;

      if (!hasOpenAI || !shouldFallbackToOpenAI(error)) {
        throw error;
      }

      console.warn("[ask-ai] Falling back to OpenAI", {
        reason: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  if (!hasOpenAI) {
    throw mistralError ?? new Error("MISTRAL_API_KEY not configured");
  }

  return runOpenAIAskAI({ systemPrompt, query });
}
