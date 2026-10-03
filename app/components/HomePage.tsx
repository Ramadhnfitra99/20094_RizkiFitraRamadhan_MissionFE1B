"use client";

import { useCallback, useState } from "react";
import { continueWatching, newReleases, topRated, trending } from "../data/media";
import {
  initialManagedMovies,
  type ManagedMovie,
  type MovieDraft,
} from "../data/managedMovies";
import { useMyList } from "../hooks/useMyList";
import { CustomMoviesCrud } from "./CustomMoviesCrud";
import { Hero } from "./Hero";
import { MediaRow } from "./MediaCatalog";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function HomePage() {
  const { error, isSaved, pendingIds, toggle } = useMyList();
  const [managedMovies, setManagedMovies] = useState<ManagedMovie[]>(
    initialManagedMovies,
  );

  const createMovie = useCallback((draft: MovieDraft) => {
    const id = `managed-${crypto.randomUUID()}`;
    setManagedMovies((current) => [{ id, ...draft }, ...current]);
  }, []);

  const updateMovie = useCallback((id: string, draft: MovieDraft) => {
    setManagedMovies((current) =>
      current.map((movie) => (movie.id === id ? { id, ...draft } : movie)),
    );
  }, []);

  const deleteMovie = useCallback((id: string) => {
    setManagedMovies((current) =>
      current.filter((movie) => movie.id !== id),
    );
  }, []);

  return (
    <>
      <SiteHeader active="home" />
      <main>
        <Hero />
        <div className="container catalog">
          <CustomMoviesCrud
            movies={managedMovies}
            onCreate={createMovie}
            onUpdate={updateMovie}
            onDelete={deleteMovie}
          />
          {error && <p className="my-list-notice" role="status">{error}</p>}
          <MediaRow id="daftar-saya" title="Melanjutkan Tonton Film" items={continueWatching} variant="landscape" isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="series" title="Top Rating Film dan Series Hari Ini" items={topRated} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="film" title="Film Trending" items={trending} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow title="Rilis Baru" items={newReleases} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
