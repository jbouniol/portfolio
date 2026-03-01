"use client";

import { useCallback, useEffect, useState } from "react";
import { isDraftNewerThanContent } from "./admin-form-utils";

export function useAdminLocalDraft<T extends Record<string, unknown>>({
  draftStorageKey,
  mode,
  updatedAt,
  hasPendingAIPrefill,
  formSnapshot,
  hasFormChanges,
  applyDraft,
}: {
  draftStorageKey: string;
  mode: "create" | "edit";
  updatedAt?: string;
  hasPendingAIPrefill: boolean;
  formSnapshot: T;
  hasFormChanges: boolean;
  applyDraft: (draft: Partial<T>) => void;
}) {
  const [draftReady, setDraftReady] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (hasPendingAIPrefill) {
      setDraftReady(true);
      return;
    }

    const raw = localStorage.getItem(draftStorageKey);
    if (!raw) {
      setDraftReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        values?: Partial<T>;
        savedAt?: string;
      };
      if (parsed.values) {
        const shouldRestore =
          mode === "create"
            ? true
            : isDraftNewerThanContent(parsed.savedAt, updatedAt);
        if (shouldRestore) {
          applyDraft(parsed.values);
          setRestoredDraft(true);
          if (parsed.savedAt) setLastSavedAt(parsed.savedAt);
        } else {
          localStorage.removeItem(draftStorageKey);
        }
      }
    } catch {
      // Ignore malformed local drafts.
    } finally {
      setDraftReady(true);
    }
  }, [applyDraft, draftStorageKey, hasPendingAIPrefill, mode, updatedAt]);

  useEffect(() => {
    if (!draftReady || typeof window === "undefined") return;

    if (mode === "edit" && !hasFormChanges) {
      localStorage.removeItem(draftStorageKey);
      setLastSavedAt(null);
      return;
    }

    const timer = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      localStorage.setItem(
        draftStorageKey,
        JSON.stringify({ values: formSnapshot, savedAt })
      );
      setLastSavedAt(savedAt);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [draftReady, draftStorageKey, formSnapshot, hasFormChanges, mode]);

  const clearLocalDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(draftStorageKey);
    setRestoredDraft(false);
    setLastSavedAt(null);
  }, [draftStorageKey]);

  return {
    draftReady,
    restoredDraft,
    lastSavedAt,
    clearLocalDraft,
  };
}
