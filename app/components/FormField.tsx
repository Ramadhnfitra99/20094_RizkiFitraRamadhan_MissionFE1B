/* eslint-disable @next/next/no-img-element -- Tiny password icons are served directly. */
"use client";

import { InputHTMLAttributes, useState } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function FormField({ label, type = "text", id, ...props }: FormFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="input-shell">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className={`form-input ${isPassword ? "form-input--password" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            aria-pressed={visible}
          >
            <img
              src={visible ? "/assets/img/eyeclose.png" : "/assets/img/eyeopen.png"}
              alt=""
              width="20"
              height="20"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
}
