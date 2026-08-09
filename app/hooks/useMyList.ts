"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type SavedMovie = {
  id: string;
  title: string;
  image: string;
  badge?: "new" | "top" | "premium" | null;
};

const STORAGE_KEY = "chill-my-list-v1";
const STORAGE_EVENT = "chill:my-list-changed";

export function movieId(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isSavedMovie(value: unknown): value is SavedMovie {
  if (!value || typeof value !== "object") return false;

  const movie = value as Partial<SavedMovie>;
  return (
    typeof movie.id === "string" &&
    movie.id.length > 0 &&
    typeof movie.title === "string" &&
    movie.title.length > 0 &&
    typeof movie.image === "string" &&
    movie.image.length > 0 &&
    (movie.badge === undefined ||
      movie.badge === null ||
      movie.badge === "new" ||
      movie.badge === "top" ||
      movie.badge === "premium")
  );
}

function readMyList() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) return [];

  const uniqueMovies = new Map<string, SavedMovie>();
  parsed.filter(isSavedMovie).forEach((movie) => {
    if (!uniqueMovies.has(movie.id)) uniqueMovies.set(movie.id, movie);
  });
  return Array.from(uniqueMovies.values());
}

function writeMyList(movies: SavedMovie[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  window.dispatchEvent(
    new CustomEvent<SavedMovie[]>(STORAGE_EVENT, { detail: movies }),
  );
}

function storageError(reason: unknown) {
  if (reason instanceof Error && reason.name === "QuotaExceededError") {
    return "Penyimpanan browser penuh. Hapus sebagian Daftar Saya lalu coba lagi.";
  }
  return "Daftar Saya belum dapat disimpan di browser ini.";
}

export function useMyList() {
  const [items, setItems] = useState<SavedMovie[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      setItems(readMyList());
      setError("");
    } catch (reason) {
      setError(storageError(reason));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void refresh();
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) void refresh();
    };
    const handleLocalChange = (event: Event) => {
      const movies = (event as CustomEvent<SavedMovie[]>).detail;
      setItems(movies);
      setError("");
      setReady(true);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORAGE_EVENT, handleLocalChange);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleLocalChange);
    };
  }, [refresh]);

  const savedIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  const toggle = useCallback(async (movie: Omit<SavedMovie, "id"> & { id?: string }) => {
    const id = movie.id ?? movieId(movie.title);
    if (pendingIds.includes(id)) return;

    const currentlySaved = savedIds.has(id);
    setPendingIds((current) => [...current, id]);
    setError("");

    try {
      const nextItems = currentlySaved
        ? items.filter((item) => item.id !== id)
        : [{ ...movie, id }, ...items.filter((item) => item.id !== id)];

      writeMyList(nextItems);
      setItems(nextItems);
    } catch (reason) {
      setError(storageError(reason));
    } finally {
      setPendingIds((current) => current.filter((pendingId) => pendingId !== id));
    }
  }, [items, pendingIds, savedIds]);

  const remove = useCallback(async (id: string) => {
    const movie = items.find((item) => item.id === id);
    if (movie) await toggle(movie);
  }, [items, toggle]);

  return {
    items,
    ready,
    error,
    pendingIds,
    isSaved: (title: string) => savedIds.has(movieId(title)),
    toggle,
    remove,
    refresh,
  };
}
