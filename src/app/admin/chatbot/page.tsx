"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, FileText, Search, Upload } from "lucide-react";
import {
  ADMIN_CHAT_MODELS,
  DEFAULT_ADMIN_CHAT_MODEL,
  type AdminChatModel,
} from "@/lib/admin-chat-models";
import AskPane from "./_components/AskPane";
import CareerDocBuilder from "./_components/CareerDocBuilder";
import TabButton from "./_components/TabButton";
import {
  ASK_PLACEHOLDERS,
  CHAT_ACTIVITY_STEPS,
  COVER_ACTIVITY_STEPS,
  CV_ACTIVITY_STEPS,
  EMPTY_DOC_STATE,
  MODEL_STORAGE_KEY,
  STARTERS,
  STYLE_STORAGE_KEY,
} from "./constants";
import type {
  BobTab,
  CareerDocState,
  CareerDocType,
  MentionCandidate,
  MentionExperienceItem,
  MentionProjectItem,
  Message,
  ResponseStyle,
} from "./types";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toSafeSlug(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "target";
}

function getActiveMention(text: string, cursorPosition: number) {
  const safeCursor = Math.max(0, Math.min(cursorPosition, text.length));
  const beforeCursor = text.slice(0, safeCursor);
  const mentionStart = beforeCursor.lastIndexOf("@");
  if (mentionStart < 0) return null;

  if (mentionStart > 0 && /[^\s(,[{]/.test(beforeCursor[mentionStart - 1])) {
    return null;
  }

  const query = beforeCursor.slice(mentionStart + 1);
  if (/\s/.test(query)) return null;

  return {
    start: mentionStart,
    end: safeCursor,
    query: query.toLowerCase(),
  };
}

function extractMentionSlugsInText(text: string) {
  const found = new Set<string>();
  const regex = /(^|\s)@([a-z0-9][a-z0-9-]{1,80})(?=\s|$)/gi;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match) {
    found.add(match[2].toLowerCase());
    match = regex.exec(text);
  }

  return Array.from(found);
}

function stripMentionTokens(text: string) {
  return text
    .replace(/(^|\s)@([a-z0-9][a-z0-9-]{1,80})(?=\s|$)/gi, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState<BobTab>("ask");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isAskFocused, setIsAskFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatPhaseIndex, setChatPhaseIndex] = useState(0);
  const [askPlaceholderIndex, setAskPlaceholderIndex] = useState(0);
  const [askPlaceholderText, setAskPlaceholderText] = useState("");
  const [isDeletingAskPlaceholder, setIsDeletingAskPlaceholder] = useState(false);
  const [mentionCandidates, setMentionCandidates] = useState<MentionCandidate[]>([]);
  const [selectedMentionSlugs, setSelectedMentionSlugs] = useState<string[]>([]);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionSuppressed, setMentionSuppressed] = useState(false);

  const [model, setModel] = useState<AdminChatModel>(DEFAULT_ADMIN_CHAT_MODEL);
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>("concise");
  const [docPhaseIndex, setDocPhaseIndex] = useState<Record<CareerDocType, number>>({
    cv: 0,
    "cover-letter": 0,
  });
  const [docs, setDocs] = useState<Record<CareerDocType, CareerDocState>>({
    cv: { ...EMPTY_DOC_STATE },
    "cover-letter": { ...EMPTY_DOC_STATE },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const selectedModel = useMemo(
    () => ADMIN_CHAT_MODELS.find((entry) => entry.value === model),
    [model]
  );
  const activeMention = useMemo(
    () => getActiveMention(input, cursorPosition),
    [cursorPosition, input]
  );
  const filteredMentions = useMemo(() => {
    if (!activeMention || mentionSuppressed) return [];
    const query = activeMention.query.trim();
    const normalize = (value: string) => value.toLowerCase();

    return mentionCandidates
      .filter((candidate) => {
        if (!query) return true;
        const haystack = `${normalize(candidate.slug)} ${normalize(candidate.label)} ${normalize(candidate.secondary)}`;
        return haystack.includes(query);
      })
      .slice(0, 8);
  }, [activeMention, mentionCandidates, mentionSuppressed]);
  const activeMentionContexts = useMemo(() => {
    if (selectedMentionSlugs.length === 0 || mentionCandidates.length === 0) {
      return [];
    }
    const bySlug = new Map(
      mentionCandidates.map((candidate) => [candidate.slug.toLowerCase(), candidate])
    );

    return selectedMentionSlugs
      .map((slug) => bySlug.get(slug))
      .filter((candidate): candidate is MentionCandidate => Boolean(candidate));
  }, [mentionCandidates, selectedMentionSlugs]);
  const projectMentionTargets = useMemo(() => {
    const targets: Record<string, string> = {};
    for (const candidate of mentionCandidates) {
      if (candidate.type !== "project") continue;
      targets[candidate.slug.toLowerCase()] = `/projects/${candidate.slug}`;
    }
    return targets;
  }, [mentionCandidates]);

  const cvGenerating = docs.cv.generating;
  const coverGenerating = docs["cover-letter"].generating;
  const hasConversation = messages.length > 0;

  useEffect(() => {
    const storedModel = window.localStorage.getItem(MODEL_STORAGE_KEY);
    const matched = ADMIN_CHAT_MODELS.find((entry) => entry.value === storedModel);
    if (matched) setModel(matched.value);

    const storedStyle = window.localStorage.getItem(STYLE_STORAGE_KEY);
    if (storedStyle === "concise" || storedStyle === "deep") {
      setResponseStyle(storedStyle);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MODEL_STORAGE_KEY, model);
  }, [model]);

  useEffect(() => {
    window.localStorage.setItem(STYLE_STORAGE_KEY, responseStyle);
  }, [responseStyle]);

  useEffect(() => {
    let cancelled = false;

    async function loadMentionCandidates() {
      try {
        const [projectsRes, experiencesRes] = await Promise.all([
          fetch("/api/admin/projects", { cache: "no-store" }),
          fetch("/api/admin/experiences", { cache: "no-store" }),
        ]);

        if (!projectsRes.ok || !experiencesRes.ok) return;

        const [projects, experiences] = (await Promise.all([
          projectsRes.json(),
          experiencesRes.json(),
        ])) as [MentionProjectItem[], MentionExperienceItem[]];

        if (cancelled) return;

        const mappedProjects: MentionCandidate[] = projects.map((project) => ({
          key: `project:${project.slug}`,
          type: "project",
          slug: project.slug,
          label: project.title,
          secondary: project.company,
        }));
        const mappedExperiences: MentionCandidate[] = experiences.map((experience) => ({
          key: `experience:${experience.slug}`,
          type: "experience",
          slug: experience.slug,
          label: experience.role,
          secondary: experience.company,
        }));

        const merged = [...mappedProjects, ...mappedExperiences].sort((a, b) =>
          a.label.localeCompare(b.label, "fr", { sensitivity: "base" })
        );
        setMentionCandidates(merged);
      } catch {
        // Ignore mention catalog fetch errors to keep chat usable.
      }
    }

    loadMentionCandidates();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function applyTabFromUrl() {
      const requestedTab = new URLSearchParams(window.location.search).get("tab");
      if (requestedTab === "cv") {
        setActiveTab("cv");
        return;
      }
      if (requestedTab === "cover" || requestedTab === "cover-letter") {
        setActiveTab("cover");
        return;
      }
      if (requestedTab === "ask") {
        setActiveTab("ask");
      }
    }

    applyTabFromUrl();
    window.addEventListener("popstate", applyTabFromUrl);
    return () => window.removeEventListener("popstate", applyTabFromUrl);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) {
      setChatPhaseIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setChatPhaseIndex((prev) => (prev + 1) % CHAT_ACTIVITY_STEPS.length);
    }, 2350);

    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    let cvTimer: number | null = null;
    let coverTimer: number | null = null;

    if (cvGenerating) {
      cvTimer = window.setInterval(() => {
        setDocPhaseIndex((prev) => ({
          ...prev,
          cv: (prev.cv + 1) % CV_ACTIVITY_STEPS.length,
        }));
      }, 2200);
    } else {
      setDocPhaseIndex((prev) => ({ ...prev, cv: 0 }));
    }

    if (coverGenerating) {
      coverTimer = window.setInterval(() => {
        setDocPhaseIndex((prev) => ({
          ...prev,
          "cover-letter":
            (prev["cover-letter"] + 1) % COVER_ACTIVITY_STEPS.length,
        }));
      }, 2200);
    } else {
      setDocPhaseIndex((prev) => ({ ...prev, "cover-letter": 0 }));
    }

    return () => {
      if (cvTimer) window.clearInterval(cvTimer);
      if (coverTimer) window.clearInterval(coverTimer);
    };
  }, [cvGenerating, coverGenerating]);

  useEffect(() => {
    if (activeTab !== "ask") return;
    const currentPlaceholder = ASK_PLACEHOLDERS[askPlaceholderIndex];
    const typingSpeed = isDeletingAskPlaceholder ? 48 : 72;

    if (!isDeletingAskPlaceholder && askPlaceholderText === currentPlaceholder) {
      const pause = window.setTimeout(() => setIsDeletingAskPlaceholder(true), 1500);
      return () => window.clearTimeout(pause);
    }

    if (isDeletingAskPlaceholder && askPlaceholderText === "") {
      const next = window.setTimeout(() => {
        setIsDeletingAskPlaceholder(false);
        setAskPlaceholderIndex((prev) => (prev + 1) % ASK_PLACEHOLDERS.length);
      }, 260);
      return () => window.clearTimeout(next);
    }

    const timer = window.setTimeout(() => {
      setAskPlaceholderText((prev) =>
        isDeletingAskPlaceholder
          ? currentPlaceholder.slice(0, Math.max(0, prev.length - 1))
          : currentPlaceholder.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => window.clearTimeout(timer);
  }, [activeTab, askPlaceholderIndex, askPlaceholderText, isDeletingAskPlaceholder]);

  useEffect(() => {
    setMentionIndex(0);
  }, [activeMention?.query]);

  function patchDocState(documentType: CareerDocType, patch: Partial<CareerDocState>) {
    setDocs((prev) => ({
      ...prev,
      [documentType]: { ...prev[documentType], ...patch },
    }));
  }

  function applyMention(candidate: MentionCandidate) {
    if (!activeMention) return;
    const nextValue = (
      input.slice(0, activeMention.start) + input.slice(activeMention.end)
    ).replace(/\s{2,}/g, " ");
    const nextCursor = Math.min(activeMention.start, nextValue.length);
    setInput(nextValue);
    setCursorPosition(nextCursor);
    setSelectedMentionSlugs((previous) =>
      previous.includes(candidate.slug.toLowerCase())
        ? previous
        : [...previous, candidate.slug.toLowerCase()]
    );
    setMentionSuppressed(false);

    requestAnimationFrame(() => {
      if (!chatInputRef.current) return;
      chatInputRef.current.focus();
      chatInputRef.current.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function removeMentionContext(slug: string) {
    const normalized = slug.toLowerCase();
    setSelectedMentionSlugs((previous) =>
      previous.filter((item) => item !== normalized)
    );
    setMentionSuppressed(false);

    requestAnimationFrame(() => {
      if (!chatInputRef.current) return;
      chatInputRef.current.focus();
      const nextCursor = input.length;
      chatInputRef.current.setSelectionRange(nextCursor, nextCursor);
    });
  }

  async function requestBob(history: Message[], mentionSlugs: string[]) {
    const response = await fetch("/api/admin/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        responseStyle,
        messages: history,
        mentionSlugs,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    return data.content as string;
  }

  async function sendPrompt(text?: string) {
    const rawContent = (text ?? input).trim();
    const typedMentionSlugs = extractMentionSlugsInText(rawContent);
    const mentionSlugs = Array.from(
      new Set([...selectedMentionSlugs, ...typedMentionSlugs])
    );
    const content = stripMentionTokens(rawContent);
    if (!content || loading) return;

    const history = [...messages, { role: "user" as const, content }];
    setMessages(history);
    setInput("");
    setSelectedMentionSlugs([]);
    setChatError("");
    setLoading(true);

    try {
      const answer = await requestBob(history, mentionSlugs);
      setMessages([...history, { role: "assistant", content: answer }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown AI error";
      setChatError(message);
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Je n'ai pas pu répondre pour le moment. Vérifie la clé API et réessaie.",
        },
      ]);
    } finally {
      setLoading(false);
      chatInputRef.current?.focus();
    }
  }

  async function generateCareerDoc(documentType: CareerDocType) {
    const doc = docs[documentType];
    if (!doc.jobTitle.trim() || !doc.company.trim() || !doc.jobDescription.trim()) {
      patchDocState(documentType, {
        error: "Renseigne job title, company et job description.",
      });
      return;
    }

    patchDocState(documentType, { generating: true, error: "" });
    try {
      const response = await fetch("/api/admin/career-docs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          model,
          jobTitle: doc.jobTitle,
          company: doc.company,
          jobDescription: doc.jobDescription,
          language: doc.language,
          extraInstructions: doc.extraInstructions,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Document generation failed");
      }

      patchDocState(documentType, { latex: data.latex, generating: false });
    } catch (error) {
      patchDocState(documentType, {
        generating: false,
        error:
          error instanceof Error ? error.message : "Document generation failed",
      });
    }
  }

  async function downloadPdf(documentType: CareerDocType) {
    const doc = docs[documentType];
    if (!doc.latex.trim()) {
      patchDocState(documentType, {
        error: "Génère d'abord un LaTeX avant de télécharger le PDF.",
      });
      return;
    }

    patchDocState(documentType, { downloadingPdf: true, error: "" });
    try {
      const response = await fetch("/api/admin/career-docs/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latex: doc.latex,
          filename:
            documentType === "cv"
              ? `${doc.company}-cv-jonathan-bouniol`
              : `${doc.company}-cover-letter-jonathan-bouniol`,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const json = await response.json();
          throw new Error(json.error || "PDF compile failed");
        }
        throw new Error("PDF compile failed");
      }

      const blob = await response.blob();
      const companySlug = toSafeSlug(doc.company);
      const filename =
        documentType === "cv"
          ? `jonathan-bouniol-cv-${companySlug}.pdf`
          : `jonathan-bouniol-cover-letter-${companySlug}.pdf`;
      downloadBlob(blob, filename);
      patchDocState(documentType, { downloadingPdf: false });
    } catch (error) {
      patchDocState(documentType, {
        downloadingPdf: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to download generated PDF",
      });
    }
  }

  function downloadTex(documentType: CareerDocType) {
    const doc = docs[documentType];
    if (!doc.latex.trim()) return;

    const companySlug = toSafeSlug(doc.company);
    const filename =
      documentType === "cv"
        ? `jonathan-bouniol-cv-${companySlug}.tex`
        : `jonathan-bouniol-cover-letter-${companySlug}.tex`;
    const blob = new Blob([doc.latex], { type: "text/x-tex;charset=utf-8" });
    downloadBlob(blob, filename);
  }

  function copyLatex(documentType: CareerDocType) {
    const doc = docs[documentType];
    if (!doc.latex.trim()) return;
    navigator.clipboard.writeText(doc.latex);
  }

  const activeDocType: CareerDocType = activeTab === "cv" ? "cv" : "cover-letter";
  const activeDocSteps =
    activeDocType === "cv" ? CV_ACTIVITY_STEPS : COVER_ACTIVITY_STEPS;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-3 mb-1 border-b border-zinc-800/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 flex items-center justify-center">
              <Bot size={14} />
            </div>
            <span className="text-sm font-semibold tracking-tight">Bob</span>
          </div>

          <div className="inline-flex gap-1">
            <TabButton
              label="Ask"
              active={activeTab === "ask"}
              onClick={() => setActiveTab("ask")}
              icon={Search}
            />
            <TabButton
              label="CV PDF"
              active={activeTab === "cv"}
              onClick={() => setActiveTab("cv")}
              icon={FileText}
            />
            <TabButton
              label="Cover Letter PDF"
              active={activeTab === "cover"}
              onClick={() => setActiveTab("cover")}
              icon={Upload}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={(event) => setModel(event.target.value as AdminChatModel)}
            className="no-focus-outline bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-[11px] text-zinc-300"
          >
            {ADMIN_CHAT_MODELS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
          <div className="bg-zinc-900 border border-zinc-800 rounded-md p-0.5 flex">
            <button
              type="button"
              onClick={() => setResponseStyle("concise")}
              className={`no-focus-outline px-2 py-1 text-[10px] rounded-sm ${
                responseStyle === "concise" ? "bg-zinc-700 text-white" : "text-zinc-400"
              }`}
            >
              Concise
            </button>
            <button
              type="button"
              onClick={() => setResponseStyle("deep")}
              className={`no-focus-outline px-2 py-1 text-[10px] rounded-sm ${
                responseStyle === "deep" ? "bg-zinc-700 text-white" : "text-zinc-400"
              }`}
            >
              Deep
            </button>
          </div>
        </div>
      </div>

      {activeTab === "ask" ? (
        <AskPane
          hasConversation={hasConversation}
          loading={loading}
          chatError={chatError}
          chatPhaseIndex={chatPhaseIndex}
          chatActivitySteps={CHAT_ACTIVITY_STEPS}
          isAskFocused={isAskFocused}
          setIsAskFocused={setIsAskFocused}
          input={input}
          setInput={setInput}
          setCursorPosition={setCursorPosition}
          askPlaceholderText={askPlaceholderText}
          selectedModelLabel={selectedModel?.label}
          activeMention={activeMention}
          filteredMentions={filteredMentions}
          mentionIndex={mentionIndex}
          setMentionIndex={setMentionIndex}
          setMentionSuppressed={setMentionSuppressed}
          activeMentionContexts={activeMentionContexts}
          onApplyMention={applyMention}
          onRemoveMentionContext={removeMentionContext}
          onSubmitPrompt={() => sendPrompt()}
          messages={messages}
          projectMentionTargets={projectMentionTargets}
          starters={STARTERS}
          onStarterPrompt={sendPrompt}
          chatInputRef={chatInputRef}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <CareerDocBuilder
          title={activeTab === "cv" ? "Tailored CV Generator" : "Tailored Cover Letter Generator"}
          subtitle={
            activeTab === "cv"
              ? "Generate role-specific LaTeX CV and download a compiled PDF."
              : "Generate role-specific LaTeX cover letter and download a compiled PDF."
          }
          state={docs[activeDocType]}
          activitySteps={activeDocSteps}
          activityIndex={docPhaseIndex[activeDocType]}
          onChange={(patch) => patchDocState(activeDocType, patch)}
          onGenerate={() => generateCareerDoc(activeDocType)}
          onDownloadPdf={() => downloadPdf(activeDocType)}
          onDownloadTex={() => downloadTex(activeDocType)}
          onCopyLatex={() => copyLatex(activeDocType)}
        />
      )}
    </div>
  );
}
