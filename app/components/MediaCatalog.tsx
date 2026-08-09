/* eslint-disable @next/next/no-img-element -- Tiny carousel controls are served directly. */
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { MediaItem } from "../data/media";
import { movieId } from "../hooks/useMyList";

type MediaRowProps = {
  title: string;
  items: MediaItem[];
  variant?: "landscape" | "portrait";
  id?: string;
  isSaved: (title: string) => boolean;
  pendingIds: string[];
  onToggleSave: (item: MediaItem) => void;
};

function MediaCard({
  item,
  variant,
  previewAlign,
  active,
  onActivate,
  onDeactivate,
  saved,
  pending,
  onToggleSave,
}: {
  item: MediaItem;
  variant: "landscape" | "portrait";
  previewAlign: "start" | "center" | "end";
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  saved: boolean;
  pending: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article
      className={`media-card media-card--${variant} media-card--preview-${previewAlign} ${active ? "is-active" : ""}`}
      tabIndex={0}
      aria-label={item.title}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onDeactivate();
      }}
    >
      <div className="media-card__poster">
        {item.badge === "new" && <span className="badge">Episode Baru</span>}
        {item.badge === "top" && <span className="badge badge--top">TOP<br />10</span>}
        {item.badge === "premium" && <span className="badge badge--premium">Premium</span>}
        <Image src={item.image} alt={`Poster ${item.title}`} width={variant === "landscape" ? 640 : 400} height={variant === "landscape" ? 360 : 600} />
        {variant === "landscape" && (
          <>
            <span className="media-card__shade" />
            <div className="media-card__meta">
              <span>{item.title}</span>
              <span className="media-card__rating">★ {item.rating}</span>
            </div>
          </>
        )}
      </div>

      {variant === "landscape" && (
        <div className="continue-preview" aria-hidden={!active}>
          <div className="continue-preview__visual">
            <Image src={item.previewImage ?? item.image} alt="" width={660} height={360} />
            <span className="continue-preview__gradient" />
          </div>
          <div className="continue-preview__body">
            <div className="poster-preview__actions">
              <button type="button" className="preview-action preview-action--play" aria-label={`Lanjutkan ${item.title}`}>▶</button>
              <button
                type="button"
                className={`preview-action ${saved ? "is-saved" : ""}`}
                aria-label={saved ? `Hapus ${item.title} dari Daftar Saya` : `Tambahkan ${item.title} ke Daftar Saya`}
                aria-pressed={saved}
                disabled={pending}
                onClick={onToggleSave}
              >
                {saved ? "✓" : "+"}
              </button>
              <button type="button" className="preview-action preview-action--more" aria-label={`Lihat detail ${item.title}`}>
                <span className="chevron-down" aria-hidden="true" />
              </button>
            </div>
            <strong className="continue-preview__episode">“{item.episodeTitle ?? "Lanjutkan menonton"}”</strong>
            <div className="continue-preview__progress-row">
              <div
                className="watch-progress"
                role="progressbar"
                aria-label={`Progres menonton ${item.title}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress ?? 35}
              >
                <span style={{ width: `${item.progress ?? 35}%` }} />
              </div>
              <span>{item.duration ?? "1j 20m"}</span>
            </div>
            <div className="poster-preview__genres continue-preview__genres">
              {(item.genres ?? ["Drama", "Aksi", "Petualangan"]).map((genre, index) => (
                <span key={genre}>{index > 0 && <i aria-hidden="true" />} {genre}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {variant === "portrait" && (
        <div className="poster-preview" aria-hidden={!active}>
          <div className="poster-preview__visual">
            <Image src={item.previewImage ?? item.image} alt="" width={560} height={260} />
            <span className="poster-preview__gradient" />
          </div>
          <div className="poster-preview__body">
            <div className="poster-preview__actions">
              <button type="button" className="preview-action preview-action--play" aria-label={`Putar ${item.title}`}>▶</button>
              <button
                type="button"
                className={`preview-action ${saved ? "is-saved" : ""}`}
                aria-label={saved ? `Hapus ${item.title} dari Daftar Saya` : `Tambahkan ${item.title} ke Daftar Saya`}
                aria-pressed={saved}
                disabled={pending}
                onClick={onToggleSave}
              >
                {saved ? "✓" : "+"}
              </button>
              <button type="button" className="preview-action preview-action--more" aria-label={`Lihat detail ${item.title}`}>
                <span className="chevron-down" aria-hidden="true" />
              </button>
            </div>
            <div className="poster-preview__facts">
              <span className="preview-age">{item.age ?? "13+"}</span>
              <strong>{item.episodes ?? "Film"}</strong>
            </div>
            <div className="poster-preview__genres">
              {(item.genres ?? ["Drama", "Aksi", "Petualangan"]).map((genre, index) => (
                <span key={genre}>{index > 0 && <i aria-hidden="true" />} {genre}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        className={`mobile-save-button ${saved ? "is-saved" : ""}`}
        aria-label={saved ? `Hapus ${item.title} dari Daftar Saya` : `Tambahkan ${item.title} ke Daftar Saya`}
        aria-pressed={saved}
        disabled={pending}
        onClick={onToggleSave}
      >
        {saved ? "✓" : "+"}
      </button>
    </article>
  );
}

export function MediaRow({ title, items, variant = "portrait", id, isSaved, pendingIds, onToggleSave }: MediaRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function activate(index: number) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveIndex(index);
  }

  function deactivate() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setActiveIndex(null), 120);
  }

  function scroll(direction: number) {
    trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.82, behavior: "smooth" });
  }

  return (
    <section className="media-section" id={id} aria-labelledby={`${id ?? title}-title`}>
      <h2 className="media-section__heading" id={`${id ?? title}-title`}>{title}</h2>
      <div className={`carousel carousel--${variant}`}>
        <button type="button" className="carousel__arrow carousel__arrow--left" onClick={() => scroll(-1)} aria-label={`Geser ${title} ke kiri`}>
          <img src="/assets/img/arrow-left.png" alt="" width={20} height={20} aria-hidden="true" />
        </button>
        <div className={`carousel__track carousel__track--${variant}`} ref={trackRef}>
          {items.map((item, index) => (
            <MediaCard
              key={`${item.title}-${index}`}
              item={item}
              variant={variant}
              previewAlign={index === 0 ? "start" : index === items.length - 1 ? "end" : "center"}
              active={activeIndex === index}
              saved={isSaved(item.title)}
              pending={pendingIds.includes(movieId(item.title))}
              onActivate={() => activate(index)}
              onDeactivate={deactivate}
              onToggleSave={() => onToggleSave(item)}
            />
          ))}
        </div>
        <button type="button" className="carousel__arrow carousel__arrow--right" onClick={() => scroll(1)} aria-label={`Geser ${title} ke kanan`}>
          <img src="/assets/img/arrow-right.png" alt="" width={20} height={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
