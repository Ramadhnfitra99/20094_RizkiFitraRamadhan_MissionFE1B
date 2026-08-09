/* eslint-disable @next/next/no-img-element -- Tiny local provider icons are served directly. */
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { FormField } from "./FormField";

type AuthPageProps = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!isLogin && data.get("password") !== data.get("confirmPassword")) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }
    setError("");
    router.push("/home");
  }

  return (
    <main className={`auth-page auth-page--${mode}`}>
      <section className="auth-card" aria-labelledby="auth-title">
        <BrandLogo href="/login" className="auth-card__logo" />
        <header className="auth-card__header">
          <h1 id="auth-title">{isLogin ? "Masuk" : "Daftar"}</h1>
          <p>{isLogin ? "Selamat datang kembali!" : "Selamat datang!"}</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField
            id={`${mode}-username`}
            name="username"
            label="Username"
            placeholder="Masukkan username"
            autoComplete="username"
            required
          />
          <FormField
            id={`${mode}-password`}
            name="password"
            type="password"
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
          />
          {!isLogin && (
            <FormField
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              label="Konfirmasi Kata Sandi"
              placeholder="Masukkan ulang kata sandi"
              autoComplete="new-password"
              minLength={6}
              required
            />
          )}

          <div className="auth-links">
            <span>
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <Link href={isLogin ? "/register" : "/login"}>
                {isLogin ? "Daftar" : "Masuk"}
              </Link>
            </span>
            {isLogin && <Link href="#">Lupa kata sandi?</Link>}
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="auth-button auth-button--primary">
            {isLogin ? "Masuk" : "Daftar"}
          </button>
          <div className="auth-separator">Atau</div>
          <button type="button" className="auth-button auth-button--google">
            <img
              src="/assets/img/google.webp"
              alt=""
              width="20"
              height="20"
              aria-hidden="true"
            />
            {isLogin ? "Masuk dengan Google" : "Daftar dengan Google"}
          </button>
        </form>
      </section>
    </main>
  );
}
