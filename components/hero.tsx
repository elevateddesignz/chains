import { metrics, clients } from "@/lib/data";
import Link from "next/link";

export function Hero() {
  return (
    <section id="top" className="section-container pt-10">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Experiential + Lifecycle + Analytics
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Launch unforgettable brand moments that convert attention into action.
          </h1>
          <p className="text-lg text-white/70 sm:text-xl">
            Hype Em Up is the experiential marketing studio that architects culture-driving launches for product-led teams. We combine strategy, production, and performance measurement in one agile crew.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Plan my launch
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white/80 transition hover:border-primary hover:text-primary"
            >
              View playbooks
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/50">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm text-white/60">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -translate-x-6 rounded-[40px] bg-gradient-to-br from-primary/60 via-accent/40 to-transparent blur-3xl" />
          <div className="relative rounded-[40px] border border-white/10 bg-white/[0.04] p-10 shadow-2xl shadow-primary/20">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Playbooks</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Launch systems engineered to scale</h2>
                <p className="mt-3 text-sm text-white/60">
                  Always-on hype pods, conversion-driven storytelling, and measurement frameworks built for the next board meeting.
                </p>
              </div>
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Trusted by</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70 sm:grid-cols-3">
                  {clients.map((client) => (
                    <span
                      key={client}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                  Guarantee
                </p>
                <p className="mt-3 text-base text-white/80">
                  We align on pipeline goals up front. If we miss the KPIs we commit to, we stay on until we hit them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
