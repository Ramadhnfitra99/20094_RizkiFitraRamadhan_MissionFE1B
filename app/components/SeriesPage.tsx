"use client";

import Image from "next/image";
import { useMyList } from "../hooks/useMyList";
import type { MediaItem } from "../data/media";
import { SoundToggle } from "./Hero";
import { MediaRow } from "./MediaCatalog";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const continueSeries: MediaItem[] = [
  { title: "Alice in Borderland", image: "/assets/img/frame1.png", previewImage: "/assets/img/frame1.png", rating: "4.8/5", badge: "new", episodeTitle: "Episode 7: Pengorbanan Terakhir", progress: 66, duration: "48m", genres: ["Misteri", "Aksi", "Drama"] },
  { title: "My Perfect Stranger", image: "/assets/img/frame3.png", previewImage: "/assets/img/frame3.png", rating: "4.6/5", badge: "new", episodeTitle: "Episode 5: Kembali ke Masa Lalu", progress: 44, duration: "1j 2m", genres: ["Drama", "Misteri", "Romansa"] },
  { title: "All of Us Are Dead", image: "/assets/img/frame4.png", previewImage: "/assets/img/frame4.png", rating: "4.7/5", badge: "new", episodeTitle: "Episode 2: Satu-satunya Jalan", progress: 34, duration: "52m", genres: ["Misteri", "Kriminal", "Fantasi"] },
  { title: "Blue Lock", image: "/assets/img/frame2.png", previewImage: "/assets/img/frame2.png", rating: "4.6/5", badge: "new", episodeTitle: "Episode 9: Kebangkitan Ego", progress: 48, duration: "24m", genres: ["Anime", "Olahraga", "Drama"] },
];

const chillPremium: MediaItem[] = [
  { title: "The Little Mermaid", image: "/assets/img/img10.png", previewImage: "/assets/img/img10.png", badge: "premium", episodes: "8 Episode", genres: ["Fantasi", "Keluarga", "Drama"] },
  { title: "Duty After School", image: "/assets/img/img12.png", previewImage: "/assets/img/img12.png", badge: "premium", episodes: "10 Episode", genres: ["Aksi", "Drama", "Fiksi Ilmiah"] },
  { title: "Big Hero 6: The Series", image: "/assets/img/img1.png", previewImage: "/assets/img/img1.png", badge: "premium", episodes: "12 Episode", genres: ["Anak-anak", "Komedi", "Aksi"] },
  { title: "All of Us Are Dead", image: "/assets/img/img2.png", previewImage: "/assets/img/frame4.png", badge: "premium", episodes: "16 Episode", genres: ["Misteri", "Kriminal", "Fantasi"] },
  { title: "Missing", image: "/assets/img/img11.png", previewImage: "/assets/img/img11.png", badge: "premium", episodes: "6 Episode", genres: ["Misteri", "Drama", "Kriminal"] },
];

const topSeries: MediaItem[] = [
  { title: "All of Us Are Dead", image: "/assets/img/img2.png", previewImage: "/assets/img/frame4.png", badge: "top", episodes: "16 Episode", genres: ["Misteri", "Kriminal", "Fantasi"] },
  { title: "Duty After School", image: "/assets/img/img12.png", previewImage: "/assets/img/img12.png", badge: "top", episodes: "10 Episode", genres: ["Aksi", "Drama", "Fiksi Ilmiah"] },
  { title: "Blue Lock", image: "/assets/img/img3.png", previewImage: "/assets/img/frame2.png", badge: "top", episodes: "24 Episode", genres: ["Anime", "Olahraga", "Drama"] },
  { title: "My Perfect Stranger", image: "/assets/img/img4.png", previewImage: "/assets/img/frame3.png", badge: "top", episodes: "16 Episode", genres: ["Drama", "Misteri", "Romansa"] },
  { title: "Alice in Borderland", image: "/assets/img/img5.png", previewImage: "/assets/img/frame1.png", badge: "top", episodes: "16 Episode", genres: ["Misteri", "Aksi", "Drama"] },
];

const trendingSeries: MediaItem[] = [
  { title: "Duty After School", image: "/assets/img/img12.png", previewImage: "/assets/img/img12.png", badge: "top", episodes: "10 Episode", genres: ["Aksi", "Drama", "Fiksi Ilmiah"] },
  { title: "All of Us Are Dead", image: "/assets/img/img2.png", previewImage: "/assets/img/frame4.png", badge: "top", episodes: "16 Episode", genres: ["Misteri", "Kriminal", "Fantasi"] },
  { title: "Blue Lock", image: "/assets/img/img3.png", previewImage: "/assets/img/frame2.png", badge: "top", episodes: "24 Episode", genres: ["Anime", "Olahraga", "Drama"] },
  { title: "Alice in Borderland", image: "/assets/img/img5.png", previewImage: "/assets/img/frame1.png", badge: "top", episodes: "16 Episode", genres: ["Misteri", "Aksi", "Drama"] },
  { title: "My Perfect Stranger", image: "/assets/img/img4.png", previewImage: "/assets/img/frame3.png", badge: "top", episodes: "16 Episode", genres: ["Drama", "Misteri", "Romansa"] },
];

const newSeries: MediaItem[] = [
  { title: "Missing: The Series", image: "/assets/img/img11.png", previewImage: "/assets/img/img11.png", badge: "new", episodes: "6 Episode", genres: ["Misteri", "Drama", "Kriminal"] },
  { title: "Big Hero 6: The Series", image: "/assets/img/img1.png", previewImage: "/assets/img/img1.png", badge: "new", episodes: "12 Episode", genres: ["Anak-anak", "Komedi", "Aksi"] },
  { title: "The Little Mermaid: Origins", image: "/assets/img/img10.png", previewImage: "/assets/img/img10.png", badge: "new", episodes: "8 Episode", genres: ["Fantasi", "Keluarga", "Drama"] },
  { title: "Guardians", image: "/assets/img/img8.png", previewImage: "/assets/img/img8.png", badge: "new", episodes: "8 Episode", genres: ["Aksi", "Petualangan", "Fiksi Ilmiah"] },
  { title: "Tomorrow", image: "/assets/img/img6.png", previewImage: "/assets/img/img6.png", badge: "new", episodes: "16 Episode", genres: ["Drama", "Fantasi", "Misteri"] },
];

function SeriesHero() {
  return (
    <section className="hero series-hero" aria-labelledby="series-hero-title">
      <div className="container">
        <details className="series-genre">
          <summary>Genre</summary>
          <div className="series-genre__menu">
            {["Aksi", "Anime", "Drama", "Fantasi", "Komedi", "Misteri", "Petualangan", "Romansa", "Thriller", "KDrama"].map((genre) => (
              <a href={`#${genre.toLowerCase()}`} key={genre}>{genre}</a>
            ))}
          </div>
        </details>
        <div className="hero__content">
          <p className="hero__eyebrow">Chill Original Series</p>
          <h1 id="series-hero-title">Duty After School</h1>
          <p className="hero__description">
            Siswa sekolah menengah harus menukar buku dengan senjata ketika ancaman misterius
            muncul di langit. Ikuti perjuangan mereka dalam serial penuh aksi dan persahabatan.
          </p>
          <div className="hero__actions">
            <button type="button" className="hero-button hero-button--primary">Mulai</button>
            <button type="button" className="hero-button">
              <Image src="/assets/img/tandaseru.png" alt="" width={18} height={18} />
              Selengkapnya
            </button>
            <span className="age-badge" aria-label="Untuk usia 18 tahun ke atas">18+</span>
          </div>
        </div>
        <SoundToggle />
      </div>
    </section>
  );
}

export function SeriesPage() {
  const { error, isSaved, pendingIds, toggle } = useMyList();

  return (
    <>
      <SiteHeader active="series" />
      <main>
        <SeriesHero />
        <div className="container catalog series-catalog">
          {error && <p className="my-list-notice" role="status">{error}</p>}
          <MediaRow id="lanjut-series" title="Melanjutkan Tonton Series" items={continueSeries} variant="landscape" isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="premium" title="Series Persembahan Chill" items={chillPremium} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="top-series" title="Top Rating Series Hari Ini" items={topSeries} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="series-trending" title="Series Trending" items={trendingSeries} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
          <MediaRow id="rilis-series" title="Rilis Series Baru" items={newSeries} isSaved={isSaved} pendingIds={pendingIds} onToggleSave={toggle} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
