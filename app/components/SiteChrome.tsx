/* eslint-disable @next/next/no-img-element -- The compact local avatar is served directly. */
"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

type ActivePage = "home" | "series" | "my-list" | "profile";

export function SiteHeader({ active = "home" }: { active?: ActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <div className="topbar__left">
          <BrandLogo />
          <nav className="main-nav" aria-label="Navigasi utama">
            <Link className={`nav-link ${active === "series" ? "is-active" : ""}`} href="/series">Series</Link>
            <Link className={`nav-link ${active === "home" ? "is-active" : ""}`} href="/home#film">Film</Link>
            <Link className={`nav-link ${active === "my-list" ? "is-active" : ""}`} href="/my-list">Daftar Saya</Link>
          </nav>
        </div>
        <div className="profile">
          <button
            type="button"
            className="profile__trigger"
            aria-label="Buka menu profil"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <img className="profile__avatar" src="/assets/img/avatar.png" alt="Foto profil" width={44} height={44} />
            <span className="profile__chevron" aria-hidden="true">▼</span>
          </button>
          {menuOpen && (
            <nav className="profile-menu" aria-label="Menu profil">
              <Link href="/profile"><span aria-hidden="true">●</span> Profil Saya</Link>
              <Link href="/subscription"><span aria-hidden="true">★</span> Ubah Premium</Link>
              <Link href="/login"><span aria-hidden="true">→</span> Keluar</Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function FooterGroup({ title, links, genres = false }: { title: string; links: string[]; genres?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="footer-group">
      <button type="button" className="footer-group__button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {title}<span className="footer-group__chevron" aria-hidden="true">›</span>
      </button>
      <div className={`footer-links ${genres ? "footer-links--genres" : ""} ${open ? "is-open" : ""}`}>
        {links.map((link) => <a href="#" key={link}>{link}</a>)}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const genres = ["Aksi", "Anak-anak", "Anime", "Britania", "Drama", "Fantasi", "Fantasi Ilmiah", "Kejahatan", "Komedi", "KDrama", "Perang", "Petualangan"];
  const help = ["FAQ", "Kontak Kami", "Privasi", "Syarat & Ketentuan"];

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <BrandLogo />
          <p>© 2026 Chill. All Rights Reserved.</p>
        </div>
        <FooterGroup title="Genre" links={genres} genres />
        <div className="footer__help"><FooterGroup title="Bantuan" links={help} /></div>
      </div>
    </footer>
  );
}
