export type AdminChatModel =
  | "mistral-large-latest"
  | "mistral-small-latest"
  | "gemini-2.0-flash"
  | "gemini-1.5-pro";

export const DEFAULT_ADMIN_CHAT_MODEL: AdminChatModel = "mistral-large-latest";

export const ADMIN_CHAT_MODELS: ReadonlyArray<{
  value: AdminChatModel;
  label: string;
  provider: "Mistral" | "Gemini";
}> = [
  { value: "mistral-large-latest", label: "Mistral Large", provider: "Mistral" },
  { value: "mistral-small-latest", label: "Mistral Small", provider: "Mistral" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", provider: "Gemini" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Gemini" },
];
