import { useEffect, useState } from "react";
import { validateProgress } from "./engine.mjs";
export type Progress = {
  version: number;
  completed: number[];
  bookmarks: number[];
  answers: Record<string, boolean>;
  projects: string[];
};
export const empty: Progress = {
  version: 1,
  completed: [],
  bookmarks: [],
  answers: {},
  projects: [],
};
export function useProgress() {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const p = localStorage.getItem("csslab-progress");
      return p ? validateProgress(JSON.parse(p)) : empty;
    } catch {
      return empty;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("csslab-progress", JSON.stringify(progress));
    } catch {
      setError(
        "Progress cannot be saved in this browser. Export it before leaving.",
      );
    }
  }, [progress]);
  function complete(id: number) {
    setProgress((p) => ({
      ...p,
      completed: [...new Set([...p.completed, id])],
    }));
  }
  function bookmark(id: number) {
    setProgress((p) => ({
      ...p,
      bookmarks: p.bookmarks.includes(id)
        ? p.bookmarks.filter((n) => n !== id)
        : [...p.bookmarks, id],
    }));
  }
  function answer(id: string, correct: boolean) {
    setProgress((p) => ({ ...p, answers: { ...p.answers, [id]: correct } }));
  }
  function project(id: string) {
    setProgress((p) => ({ ...p, projects: [...new Set([...p.projects, id])] }));
  }
  return { progress, setProgress, error, complete, bookmark, answer, project };
}
