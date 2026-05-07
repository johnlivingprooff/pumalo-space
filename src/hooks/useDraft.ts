"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseDraftOptions {
  draftId?: string | null; // existing draft to load/update
  debounceMs?: number;
}

export function useDraft(options: UseDraftOptions = {}) {
  const { draftId: initialId = null, debounceMs = 1500 } = options;
  const [draftId, setDraftId] = useState<string | null>(initialId);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{
    data: unknown;
    step: number;
    title?: string;
  } | null>(null);

  // Load draft data on mount if draftId provided
  const loadDraft = useCallback(async (id: string) => {
    const res = await fetch(`/api/drafts/${id}`);
    if (!res.ok) return null;
    const { draft } = await res.json();
    return draft;
  }, []);

  const save = useCallback(
    async (data: unknown, step: number, title?: string) => {
      setStatus("saving");
      try {
        if (draftId) {
          await fetch(`/api/drafts/${draftId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, step, title }),
          });
        } else {
          const res = await fetch("/api/drafts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, step, title }),
          });
          const { draft } = await res.json();
          setDraftId(draft.id);
          // Persist id in URL without navigation
          const url = new URL(window.location.href);
          url.searchParams.set("draft", draft.id);
          window.history.replaceState({}, "", url.toString());
        }
        setStatus("saved");
        setLastSaved(new Date());
      } catch {
        setStatus("error");
      }
    },
    [draftId],
  );

  // Debounced auto-save trigger
  const autoSave = useCallback(
    (data: unknown, step: number, title?: string) => {
      pendingRef.current = { data, step, title };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          const { data: d, step: s, title: t } = pendingRef.current;
          save(d, s, t);
          pendingRef.current = null;
        }
      }, debounceMs);
    },
    [save, debounceMs],
  );

  const deleteDraft = useCallback(async () => {
    if (!draftId) return;
    await fetch(`/api/drafts/${draftId}`, { method: "DELETE" });
    setDraftId(null);
  }, [draftId]);

  // Cleanup timer on unmount
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const statusLabel =
    status === "saving"
      ? "Saving…"
      : status === "saved" && lastSaved
        ? `Saved ${formatRelative(lastSaved)}`
        : status === "error"
          ? "Save failed"
          : "";

  return {
    draftId,
    autoSave,
    save,
    deleteDraft,
    status,
    statusLabel,
    loadDraft,
  };
}

function formatRelative(date: Date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}
