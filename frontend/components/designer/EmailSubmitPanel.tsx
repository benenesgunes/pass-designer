"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function EmailSubmitPanel() {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      setSubmitState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setSubmitState("loading");
    setMessage("");

    window.setTimeout(() => {
      setSubmitState("success");
      setMessage("Ready to send when the backend API is connected.");
    }, 500);
  }

  return (
    <form className="form-stack" noValidate onSubmit={handleSubmit}>
      <label className="form-label">
        <span className="muted-label">Email</span>
        <input
          className="form-input"
          onChange={(event) => {
            setEmail(event.target.value);
            if (submitState !== "loading") {
              setSubmitState("idle");
              setMessage("");
            }
          }}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </label>
      <button
        className="btn-primary w-full px-4"
        disabled={submitState === "loading"}
        type="submit"
      >
        {submitState === "loading" ? "Preparing..." : "Generate & Send Pass"}
      </button>
      {message ? (
        <p
          aria-live="polite"
          className={
            submitState === "error"
              ? "form-message form-message-error"
              : "form-message form-message-success"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
