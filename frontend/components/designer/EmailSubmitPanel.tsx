"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { CreatePassResponse, PassDesign } from "@/lib/pass";

type SubmitState = "idle" | "generating" | "success" | "error";

type ApiErrorResponse = {
  errors?: Array<{
    field: string;
    message: string;
  }>;
  message?: string;
  success: false;
};

type EmailSubmitPanelProps = {
  design?: PassDesign;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

function getApiErrorMessage(errorResponse: ApiErrorResponse) {
  const firstError = errorResponse.errors?.[0];

  if (firstError) {
    return `${firstError.field}: ${firstError.message}`;
  }

  return errorResponse.message ?? "Pass generation failed.";
}

export function EmailSubmitPanel({ design }: EmailSubmitPanelProps) {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [passId, setPassId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      setSubmitState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    if (!design) {
      setSubmitState("error");
      setMessage("Pass design is not available.");
      return;
    }

    setSubmitState("generating");
    setMessage("");
    setPassId(null);

    try {
      const endpoint = `${API_BASE_URL}/api/passes/create`;

      const response = await fetch(endpoint, {
        body: JSON.stringify({ email, design }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const responseBody = (await response.json()) as
        | ApiErrorResponse
        | CreatePassResponse;

      if (!response.ok || !responseBody.success) {
        setSubmitState("error");
        setMessage(getApiErrorMessage(responseBody as ApiErrorResponse));
        return;
      }

      setPassId(responseBody.passId);
      setSubmitState("success");
      setMessage(responseBody.message);
    } catch {
      setSubmitState("error");
      setMessage("Could not reach the backend API.");
    }
  }

  return (
    <form className="form-stack" noValidate onSubmit={handleSubmit}>
      <label className="form-label">
        <span className="muted-label">Email</span>
        <input
          className="form-input"
          onChange={(event) => {
            setEmail(event.target.value);
            if (submitState !== "generating") {
              setSubmitState("idle");
              setMessage("");
              setPassId(null);
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
        disabled={submitState === "generating"}
        type="submit"
      >
        {submitState === "generating" ? "Generating..." : "Generate Pass"}
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
      {passId ? <p className="muted-caption">Pass ID: {passId}</p> : null}
    </form>
  );
}
