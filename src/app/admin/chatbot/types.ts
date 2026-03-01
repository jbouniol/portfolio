export type BobTab = "ask" | "cv" | "cover";
export type ResponseStyle = "concise" | "deep";
export type CareerDocType = "cv" | "cover-letter";
export type CareerDocLanguage = "fr" | "en";
export type MentionEntityType = "project" | "experience";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface MentionCandidate {
  key: string;
  type: MentionEntityType;
  slug: string;
  label: string;
  secondary: string;
}

export interface MentionProjectItem {
  slug: string;
  title: string;
  company: string;
}

export interface MentionExperienceItem {
  slug: string;
  role: string;
  company: string;
}

export interface CareerDocState {
  jobTitle: string;
  company: string;
  jobDescription: string;
  language: CareerDocLanguage;
  extraInstructions: string;
  latex: string;
  generating: boolean;
  downloadingPdf: boolean;
  error: string;
}
