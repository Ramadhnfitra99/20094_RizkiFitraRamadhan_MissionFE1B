"use client";

import Link from "next/link";
import { useState } from "react";
import { formatRupiah, subscriptionPlans } from "../data/subscriptions";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const benefits = [
  { icon: "↓", title: "Download Konten Pilihan" },
  { icon: "⊘", title: "Tidak Ada Iklan" },
  { icon: "●", title: "Tonton Semua Konten" },
  { icon: "4K", title: "Kualitas Maksimal Sampai 4K" },
  { icon: "▣", title: "Tonton di TV, Tablet, Mobile, dan Laptop" },
  { icon: "≡", title: "Subtitle untuk Konten Pilihan" },
];

function readActivePlan() {
  if (typeof window === "undefined") return "";
  if (window.localStorage.getItem("chill-subscription") !== "active") return "";
  return window.localStorage.getItem("chill-subscription-plan") ?? "individual";
}

export function SubscriptionPage() {
  const [activePlan] = useState(readActivePlan);

  function choosePlan(id: string) {
    window.localStorage.setItem("chill-selected-plan", id);
  }

  return (
    <>
      <SiteHeader active="profile" />
      <main className="subscription-page">
        <section className="subscription-benefits" aria-labelledby="benefits-title">
          <div className="container">
            <p className="subscription-kicker">Premium Chill</p>
            <h1 id="benefits-title">Kenapa Harus Berlangganan?</h1>
            <div className="subscription-benefits__grid">
              {benefits.map((benefit) => (
                <article key={benefit.title}>
                  <span aria-hidden="true">{benefit.icon}</span>
                  <h2>{benefit.title}</h2>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="plans-section" aria-labelledby="plans-title">
          <div className="container">
            <header className="plans-section__header">
              <h2 id="plans-title">Pilih Paketmu</h2>
              <p>Temukan paket yang paling sesuai dengan kebutuhanmu.</p>
            </header>
            <div className="plans-grid">
              {subscriptionPlans.map((plan) => (
                <article className={`plan-card ${activePlan === plan.id ? "is-current" : ""}`} key={plan.id}>
                  {activePlan === plan.id && <span className="plan-card__current">Paket Aktif</span>}
                  <span className="plan-card__name">{plan.name}</span>
                  <p className="plan-card__description">{plan.description}</p>
                  <p className="plan-card__price">Mulai dari <strong>{formatRupiah(plan.price)}</strong><small>/bulan</small></p>
                  <p className="plan-card__accounts">{plan.accounts}</p>
                  <ul>
                    {plan.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
                  </ul>
                  <Link className="plan-card__button" href={`/payment?plan=${plan.id}`} onClick={() => choosePlan(plan.id)}>
                    {activePlan === plan.id ? "Perpanjang" : "Pilih Paket"}
                  </Link>
                  <small className="plan-card__terms">Syarat dan ketentuan berlaku</small>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
