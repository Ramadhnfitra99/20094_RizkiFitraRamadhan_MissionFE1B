"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatRupiah, getSubscriptionPlan, SubscriptionPlan } from "../data/subscriptions";
import { SiteFooter, SiteHeader } from "./SiteChrome";

type PaymentMethod = "card" | "bca";
type PaymentStage = "checkout" | "virtual-account" | "complete";

const ADMIN_FEE = 3_000;
const VA_NUMBER = "5271 0912 2026 8834";

function readInitialPlan() {
  if (typeof window === "undefined") return getSubscriptionPlan("individual");
  const id = new URLSearchParams(window.location.search).get("plan") ?? window.localStorage.getItem("chill-selected-plan");
  return getSubscriptionPlan(id);
}

function PaymentPlanCard({ plan }: { plan: SubscriptionPlan }) {
  return (
    <article className="payment-plan-card">
      <span>{plan.name}</span>
      <p>Mulai dari <strong>{formatRupiah(plan.price)}</strong>/bulan</p>
      <small>{plan.accounts}</small>
      <ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>
      <Link href="/subscription">Ganti Paket</Link>
    </article>
  );
}

export function PaymentPage() {
  const [plan] = useState(readInitialPlan);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [stage, setStage] = useState<PaymentStage>("checkout");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem("chill-selected-plan", plan.id);
  }, [plan.id]);

  useEffect(() => {
    if (stage !== "virtual-account") return;
    const timer = window.setInterval(() => setRemainingSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  const total = useMemo(() => plan.price + ADMIN_FEE - discount, [plan, discount]);
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  function applyVoucher() {
    if (voucher.trim().toUpperCase() === "CHILL10") {
      const nextDiscount = Math.round(plan.price * 0.1);
      setDiscount(nextDiscount);
      setVoucherMessage(`Voucher berhasil: hemat ${formatRupiah(nextDiscount)}.`);
    } else {
      setDiscount(0);
      setVoucherMessage("Kode voucher tidak ditemukan. Coba CHILL10.");
    }
  }

  function completePayment() {
    window.localStorage.setItem("chill-subscription", "active");
    window.localStorage.setItem("chill-subscription-plan", plan.id);
    window.localStorage.setItem("chill-selected-plan", plan.id);
    setStage("complete");
  }

  function startPayment() {
    if (method === "bca") {
      setRemainingSeconds(15 * 60);
      setStage("virtual-account");
    } else {
      completePayment();
    }
  }

  async function copyVirtualAccount() {
    try {
      await navigator.clipboard.writeText(VA_NUMBER.replaceAll(" ", ""));
      setCopyMessage("Nomor VA disalin.");
    } catch {
      setCopyMessage("Salin nomor VA secara manual.");
    }
  }

  return (
    <>
      <SiteHeader active="profile" />
      <main className="payment-page">
        <div className="container">
          {stage === "virtual-account" && (
            <section className="payment-countdown" aria-live="polite">
              <p>Lakukan pembayaran sebelum</p>
              <strong><span>00</span> Jam <i>:</i> <span>{minutes}</span> Menit <i>:</i> <span>{seconds}</span> Detik</strong>
            </section>
          )}

          {stage === "complete" ? (
            <section className="payment-success" aria-labelledby="payment-success-title">
              <span aria-hidden="true">✓</span>
              <p className="subscription-kicker">Pembayaran berhasil</p>
              <h1 id="payment-success-title">Selamat datang di Chill Premium!</h1>
              <p>Paket {plan.name} sudah aktif. Kamu sekarang dapat menikmati semua manfaat Premium.</p>
              <div>
                <Link href="/profile">Lihat Profil Premium</Link>
                <Link href="/home">Mulai Menonton</Link>
              </div>
            </section>
          ) : (
            <>
              <h1>Ringkasan Pembayaran</h1>
              <div className="payment-layout">
                <PaymentPlanCard plan={plan} />
                <section className="payment-details" aria-label="Detail pembayaran">
                  {stage === "checkout" ? (
                    <>
                      <fieldset className="payment-methods">
                        <legend>Metode Pembayaran</legend>
                        <label className={method === "card" ? "is-selected" : ""}>
                          <input type="radio" name="payment" checked={method === "card"} onChange={() => setMethod("card")} />
                          <span className="payment-logos"><b>VISA</b><b>MC</b><b>JCB</b></span>
                          Kartu Debit/Kredit
                        </label>
                        <label className={method === "bca" ? "is-selected" : ""}>
                          <input type="radio" name="payment" checked={method === "bca"} onChange={() => setMethod("bca")} />
                          <span className="bca-mark">BCA</span> BCA Virtual Account
                        </label>
                      </fieldset>

                      <div className="voucher-field">
                        <label htmlFor="voucher">Kode Voucher (jika ada)</label>
                        <div><input id="voucher" value={voucher} onChange={(event) => setVoucher(event.target.value)} placeholder="Masukkan kode voucher" /><button type="button" onClick={applyVoucher}>Gunakan</button></div>
                        {voucherMessage && <p role="status">{voucherMessage}</p>}
                      </div>
                    </>
                  ) : (
                    <section className="virtual-account-details" aria-labelledby="va-title">
                      <p className="payment-label" id="va-title">Metode Pembayaran</p>
                      <div className="virtual-account-method"><span className="bca-mark">BCA</span> BCA Virtual Account</div>
                      <dl>
                        <div><dt>Tanggal Pembelian</dt><dd>8 Agustus 2026</dd></div>
                        <div><dt>Nomor Virtual Account</dt><dd>{VA_NUMBER} <button type="button" onClick={copyVirtualAccount}>Salin</button></dd></div>
                      </dl>
                      {copyMessage && <p className="copy-message" role="status">{copyMessage}</p>}
                    </section>
                  )}

                  <section className="transaction-summary" aria-labelledby="transaction-title">
                    <h2 id="transaction-title">Ringkasan Transaksi</h2>
                    <dl>
                      <div><dt>Paket Premium {plan.name}</dt><dd>{formatRupiah(plan.price)}</dd></div>
                      <div><dt>Biaya Admin</dt><dd>{formatRupiah(ADMIN_FEE)}</dd></div>
                      {discount > 0 && <div className="transaction-discount"><dt>Diskon Voucher</dt><dd>−{formatRupiah(discount)}</dd></div>}
                      <div className="transaction-total"><dt>Total Pembayaran</dt><dd>{formatRupiah(total)}</dd></div>
                    </dl>
                  </section>

                  {stage === "virtual-account" && (
                    <section className="payment-instructions" aria-labelledby="instructions-title">
                      <h2 id="instructions-title">Tata Cara Pembayaran</h2>
                      <ol>
                        <li>Buka aplikasi BCA Mobile atau akses BCA Internet Banking.</li>
                        <li>Pilih menu “Transfer” atau “Pembayaran”.</li>
                        <li>Pilih opsi “Virtual Account” atau “Virtual Account Number”.</li>
                        <li>Masukkan nomor virtual account dan jumlah pembayaran.</li>
                        <li>Konfirmasikan pembayaran, lalu kembali ke halaman ini.</li>
                      </ol>
                    </section>
                  )}

                  <button type="button" className="payment-submit" onClick={stage === "virtual-account" ? completePayment : startPayment} disabled={remainingSeconds === 0}>
                    {stage === "virtual-account" ? "Saya Sudah Bayar" : `Bayar ${formatRupiah(total)}`}
                  </button>
                  <p className="payment-disclaimer">Simulasi pembayaran untuk demo Chill—tidak ada transaksi atau penagihan nyata.</p>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
