"use client";

import Image from "next/image";
import { useState } from "react";

export function SoundToggle() {
  const [muted, setMuted] = useState(true);

  return (
    <button
      type="button"
      className="hero-sound-control"
      aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
      aria-pressed={!muted}
      title={muted ? "Aktifkan suara" : "Matikan suara"}
      onClick={() => setMuted((value) => !value)}
    >
      <span className={`sound-icon ${muted ? "is-muted" : "is-unmuted"}`} aria-hidden="true">
        <span className="sound-icon__speaker" />
        <span className="sound-icon__wave sound-icon__wave--inner" />
        <span className="sound-icon__wave sound-icon__wave--outer" />
        <span className="sound-icon__slash" />
      </span>
    </button>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__content">
          <p className="hero__eyebrow">Chill Original Series</p>
          <h1 id="hero-title">Duty After School</h1>
          <p className="hero__description">
            Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan,
            Departemen Pertahanan merekrut siswa sekolah menengah untuk menjadi
            pejuang garis depan melawan makhluk misterius tersebut.
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
