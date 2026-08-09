"use client";

import { continueWatching, newReleases, topRated, trending } from "../data/media";
import { useMyList } from "../hooks/useMyList";
import { Hero } from "./Hero";
import { MediaRow } from "./MediaCatalog";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function HomePage() {
  const { error, isSaved, pendingIds, toggle } = useMyList();

  return (
    <>
      <SiteHeader active="home" />
      <main>
        <Hero />
        <div className="container catalog">
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
