/* eslint-disable @next/next/no-img-element -- User-selected data URLs and saved poster URLs must render directly. */
"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { getSubscriptionPlan } from "../data/subscriptions";
import { useMyList } from "../hooks/useMyList";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const PROFILE_KEY = "chill-profile";
const PHOTO_KEY = "chill-profile-photo";
const SUBSCRIPTION_KEY = "chill-subscription";

type LocalProfile = {
  name: string;
  email: string;
};

const defaultProfile: LocalProfile = {
  name: "Pengguna Chill",
  email: "pengguna@chill.id",
};

type InitialProfileState = {
  profile: LocalProfile;
  photo: string;
  subscribed: boolean;
  subscriptionPlanName: string;
  notice: string;
};

function readInitialProfileState(): InitialProfileState {
  const fallback: InitialProfileState = {
    profile: defaultProfile,
    photo: "/assets/img/avatar.png",
    subscribed: false,
    subscriptionPlanName: "Individual",
    notice: "",
  };

  if (typeof window === "undefined") return fallback;

  try {
    const savedProfile = window.localStorage.getItem(PROFILE_KEY);
    return {
      profile: savedProfile ? JSON.parse(savedProfile) as LocalProfile : defaultProfile,
      photo: window.localStorage.getItem(PHOTO_KEY) ?? fallback.photo,
      subscribed: window.localStorage.getItem(SUBSCRIPTION_KEY) === "active",
      subscriptionPlanName: getSubscriptionPlan(window.localStorage.getItem("chill-subscription-plan")).name,
      notice: "",
    };
  } catch {
    return { ...fallback, notice: "Data profil lokal belum dapat dimuat." };
  }
}

export function ProfilePage() {
  const { error, items, ready } = useMyList();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialState] = useState(readInitialProfileState);
  const [profile, setProfile] = useState(initialState.profile);
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(initialState.photo);
  const [subscribed, setSubscribed] = useState(initialState.subscribed);
  const [subscriptionPlanName] = useState(initialState.subscriptionPlanName);
  const [notice, setNotice] = useState(initialState.notice);

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Pilih file gambar untuk foto profil.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice("Ukuran foto maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setPhoto(result);
      window.localStorage.setItem(PHOTO_KEY, result);
      setNotice("Foto profil berhasil diperbarui.");
    };
    reader.readAsDataURL(file);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setPassword("");
    setNotice("Perubahan profil berhasil disimpan.");
  }

  function updateSubscription(next: boolean) {
    setSubscribed(next);
    window.localStorage.setItem(SUBSCRIPTION_KEY, next ? "active" : "inactive");
    setNotice(next ? "Akun Premium berhasil diaktifkan." : "Langganan Premium telah dinonaktifkan.");
  }

  return (
    <>
      <SiteHeader active="profile" />
      <main className="profile-page">
        <div className="container">
          <h1>Profil Saya</h1>

          <div className="profile-page__layout">
            <section className="profile-editor" aria-labelledby="profile-data-title">
              <h2 className="sr-only" id="profile-data-title">Data profil</h2>
              <div className="profile-photo-row">
                <img className="profile-page__avatar" src={photo} alt="Foto profil pengguna" width={132} height={132} />
                <div>
                  <input ref={fileInputRef} className="sr-only" type="file" accept="image/*" onChange={selectPhoto} />
                  <button type="button" className="profile-photo-button" onClick={() => fileInputRef.current?.click()}>Ubah Foto</button>
                  <p className="profile-photo-note"><span aria-hidden="true">▧</span> Maksimal 2 MB</p>
                </div>
              </div>

              <form className="profile-form" onSubmit={saveProfile}>
                <label className="profile-field">
                  <span>Nama Pengguna</span>
                  <input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} required />
                  <i aria-hidden="true">✎</i>
                </label>
                <label className="profile-field">
                  <span>Email</span>
                  <input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} required />
                  <i aria-hidden="true">✎</i>
                </label>
                <label className="profile-field">
                  <span>Kata Sandi</span>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••••" autoComplete="new-password" />
                  <i aria-hidden="true">✎</i>
                </label>
                <button type="submit" className="profile-save-button">Simpan</button>
                {notice && <p className="profile-notice" role="status">{notice}</p>}
              </form>
            </section>

            <aside className={`subscription-card ${subscribed ? "is-active" : "is-inactive"}`} id="subscription" aria-live="polite">
              {subscribed ? (
                <>
                  <span className="subscription-card__status">Aktif</span>
                  <h2>Akun Premium {subscriptionPlanName}<span aria-hidden="true">✨</span></h2>
                  <p>Saat ini kamu sedang menggunakan akses akun Premium.</p>
                  <small>Berlaku hingga 31 Desember 2026</small>
                  <button type="button" className="subscription-card__manage" onClick={() => updateSubscription(false)}>Batalkan Premium</button>
                </>
              ) : (
                <>
                  <span className="subscription-card__icon" aria-hidden="true">✦</span>
                  <div>
                    <h2>Saat ini anda belum berlangganan</h2>
                    <p>Dapatkan akses tak terbatas ke ribuan film dan series kesukaan kamu.</p>
                    <Link className="subscription-card__cta" href="/subscription">Mulai Berlangganan</Link>
                  </div>
                </>
              )}
            </aside>
          </div>

          <section className="profile-list" aria-labelledby="profile-list-title">
            <header className="profile-list__header">
              <h2 id="profile-list-title">Daftar Saya</h2>
              <Link href="/my-list">Lihat Semua</Link>
            </header>

            {!ready && <p className="profile-list__status" role="status">Memuat Daftar Saya…</p>}
            {ready && error && <p className="profile-list__status" role="alert">{error}</p>}
            {ready && !error && items.length === 0 && (
              <div className="profile-list__empty">
                <p>Daftar kamu masih kosong.</p>
                <Link href="/home">Pilih tontonan</Link>
              </div>
            )}
            {ready && !error && items.length > 0 && (
              <div className="profile-list__grid">
                {items.slice(0, 6).map((movie) => (
                  <article className="profile-list__card" key={movie.id}>
                    {movie.badge === "new" && <span className="badge">Episode Baru</span>}
                    {movie.badge === "top" && <span className="badge badge--top">TOP<br />10</span>}
                    {movie.badge === "premium" && <span className="badge badge--premium">Premium</span>}
                    <img src={movie.image} alt={`Poster ${movie.title}`} width={280} height={420} />
                    <span className="sr-only">{movie.title}</span>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
