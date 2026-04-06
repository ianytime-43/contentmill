"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stay in the Loop
        </h2>
        <p className="mt-4 text-lg" style={{ color: "#888" }}>
          Get product updates, content tips, and early access to new features.
          No spam, unsubscribe anytime.
        </p>

        {status === "success" ? (
          <p className="mt-8 text-lg font-medium bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
            You&apos;re in! We&apos;ll keep you posted.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-sm rounded-lg px-4 py-3 text-white placeholder:text-[#888] outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_#7c3aed]"
              style={{
                backgroundColor: "#141414",
                border: "1px solid #2a2a2a",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}
