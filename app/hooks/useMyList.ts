"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type SavedMovie = {
  id: string;
  title: string;
  image: string;
  badge?: "new" | "top" | "premium" | null;
};

const VIEWER_KEY = "chill-viewer-id";

export function movieId(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function viewerId() {
  let id = window.localStorage.getItem(VIEWER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VIEWER_KEY, id);
  }
  return id;
}

async function requestMyList(init?: RequestInit) {
  const response = await fetch("/api/my-list", {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-chill-viewer-id": viewerId(),
      ...init?.headers,
    },
  });
  const data = (await response.json()) as { movies?: SavedMovie[]; error?: string };
  if (!response.ok) throw new Error(data.error ?? "Daftar Saya belum dapat diperbarui.");
  return data;
}

export function useMyList() {
  const [items, setItems] = useState<SavedMovie[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      const data = await requestMyList();
      setItems(data.movies ?? []);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Daftar Saya belum dapat dimuat.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void requestMyList()
      .then((data) => {
        if (cancelled) return;
        setItems(data.movies ?? []);
        setError("");
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setError(reason instanceof Error ? reason.message : "Daftar Saya belum dapat dimuat.");
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const savedIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  const toggle = useCallback(async (movie: Omit<SavedMovie, "id"> & { id?: string }) => {
    const id = movie.id ?? movieId(movie.title);
    if (pendingIds.includes(id)) return;

    const currentlySaved = savedIds.has(id);
    setPendingIds((current) => [...current, id]);
    setError("");

    try {
      if (currentlySaved) {
        const response = await fetch(`/api/my-list?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { "x-chill-viewer-id": viewerId() },
        });
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Film belum dapat dihapus.");
        }
        setItems((current) => current.filter((item) => item.id !== id));
      } else {
        await requestMyList({
          method: "POST",
          body: JSON.stringify({ ...movie, id }),
        });
        setItems((current) => [{ ...movie, id }, ...current]);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Daftar Saya belum dapat diperbarui.");
    } finally {
      setPendingIds((current) => current.filter((pendingId) => pendingId !== id));
    }
  }, [pendingIds, savedIds]);

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
