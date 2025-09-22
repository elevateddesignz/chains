"use client";

import { FormEvent, useState } from "react";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export function Contact() {
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormState({ status: "loading", message: "" });

    const payload = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      company: formData.get("company")?.toString() ?? "",
      launchDate: formData.get("launchDate")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? ""
    };

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let result: { message?: string } = {};
      try {
        result = await response.json();
      } catch (error) {
        console.error("Failed to parse response", error);
      }

      if (!response.ok) {
        setFormState({ status: "error", message: result.message ?? "Something went wrong." });
        return;
      }

      form.reset();
      setFormState({ status: "success", message: result.message ?? "Thanks! We'll be in touch." });
    } catch (error) {
      console.error("Request failed", error);
      setFormState({ status: "error", message: "We couldn't send your request. Please try again." });
    }
  }

  return (
    <section id="contact" className="section-container">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <span className="text-sm uppercase tracking-[0.3em] text-white/50">Book a Hype Audit</span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Let’s design your next unforgettable launch</h2>
          <p className="text-lg text-white/70">
            Tell us about the moment you want to create. We’ll respond within one business day with next steps and available sprint dates.
          </p>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <span>Full campaign roadmap in under 14 days.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <span>Dedicated producer, creative director, and performance analyst.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <span>Transparent pricing with results-tied commitment.</span>
            </li>
          </ul>
        </div>
        <form
          onSubmit={handleSubmit}
          aria-busy={formState.status === "loading"}
          className="space-y-5 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/20"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Name
              <input
                required
                name="name"
                type="text"
                placeholder="Sasha Kim"
                className="rounded-2xl border border-white/10 bg-[#0a0a15] px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Work email
              <input
                required
                name="email"
                type="email"
                placeholder="you@company.com"
                className="rounded-2xl border border-white/10 bg-[#0a0a15] px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Company
              <input
                name="company"
                type="text"
                placeholder="Nova Athletics"
                className="rounded-2xl border border-white/10 bg-[#0a0a15] px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Target launch timing
              <input
                name="launchDate"
                type="text"
                placeholder="Q3 2024"
                className="rounded-2xl border border-white/10 bg-[#0a0a15] px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm text-white/70">
            What does success look like?
            <textarea
              name="message"
              rows={4}
              required
              placeholder="We’re launching a connected fitness product and need an activation that drives 5k preorders."
              className="rounded-2xl border border-white/10 bg-[#0a0a15] px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={formState.status === "loading"}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formState.status === "loading" ? "Scheduling..." : "Request my audit"}
          </button>
          <div aria-live="polite" role="status">
            {formState.message && (
              <p
                className={`text-sm ${
                  formState.status === "error" ? "text-red-400" : "text-green-400"
                }`}
              >
                {formState.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
