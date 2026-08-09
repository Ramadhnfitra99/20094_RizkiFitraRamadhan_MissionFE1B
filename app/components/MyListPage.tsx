"use client";

import Image from "next/image";
import Link from "next/link";
import { useMyList } from "../hooks/useMyList";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function MyListPage() {
  const { error, items, pendingIds, ready, remove } = useMyList();

  return (
    <>
      <SiteHeader active="my-list" />
      <main className="my-list-page">
        <div className="container">
          <header className="my-list-heading">
            <p>Koleksi pribadi</p>
            <h1>Daftar Saya</h1>
          </header>

          {!ready && <p className="my-list-status" role="status">Memuat Daftar Saya…</p>}

          {ready && error && (
            <div className="my-list-empty" role="alert">
              <span className="my-list-empty__icon" aria-hidden="true">!</span>
              <h2>Daftar belum dapat dimuat</h2>
              <p>{error}</p>
            </div>
          )}

          {ready && !error && items.length === 0 && (
            <section className="my-list-empty" aria-labelledby="empty-list-title">
              <span className="my-list-empty__icon" aria-hidden="true">＋</span>
              <h2 id="empty-list-title">Daftar kamu masih kosong</h2>
              <p>Pilih film atau series yang kamu suka, lalu tekan tombol tambah pada posternya.</p>
              <Link className="my-list-empty__button" href="/home">Pilih Film</Link>
            </section>
          )}

          {ready && !error && items.length > 0 && (
            <section className="my-list-grid" aria-label="Film dan series dalam daftar saya">
              {items.map((movie) => (
                <article className="my-list-card" key={movie.id} tabIndex={0}>
                  {movie.badge === "new" && <span className="badge">Episode Baru</span>}
                  {movie.badge === "top" && <span className="badge badge--top">TOP<br />10</span>}
                  {movie.badge === "premium" && <span className="badge badge--premium">Premium</span>}
                  <Image src={movie.image} alt={`Poster ${movie.title}`} width={360} height={540} />
                  <button
                    type="button"
                    className="my-list-remove"
                    aria-label={`Hapus ${movie.title} dari Daftar Saya`}
                    disabled={pendingIds.includes(movie.id)}
                    onClick={() => void remove(movie.id)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <span className="sr-only">{movie.title}</span>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
