import type { CareerDocState } from "./types";

export const MODEL_STORAGE_KEY = "admin:bob:model";
export const STYLE_STORAGE_KEY = "admin:bob:style";

export const STARTERS = [
  "Prépare-moi une réponse STAR sur mon stage Generali (Data & IT Transformation)",
  "Comment présenter mon rôle au CND en restant NDA-safe ?",
  "Donne-moi 3 versions de pitch pour mon profil Mines Paris × Albert School",
  "Simule un entretien data engineer (questions + feedback) sur mon parcours",
];

export const ASK_PLACEHOLDERS = [
  "Prépare mon pitch pour une alternance Data/AI",
  "Rends mon expérience CND claire sans exposer d'informations sensibles",
  "Quels projets de mon portfolio prioriser pour ce poste ?",
  "Transforme mon expérience Generali en réponses STAR percutantes",
];

export const CHAT_ACTIVITY_STEPS = ["Thinking", "Writing", "Improving"] as const;
export const CV_ACTIVITY_STEPS = [
  "Analyzing role",
  "Tailoring bullets",
  "Polishing LaTeX",
] as const;
export const COVER_ACTIVITY_STEPS = [
  "Analyzing role",
  "Drafting letter",
  "Improving tone",
] as const;

export const EMPTY_DOC_STATE: CareerDocState = {
  jobTitle: "",
  company: "",
  jobDescription: "",
  language: "en",
  extraInstructions: "",
  latex: "",
  generating: false,
  downloadingPdf: false,
  error: "",
};
