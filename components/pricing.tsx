import { pricingTiers } from "@/lib/data";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="section-container">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-white/50">Pricing</span>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Flexible retainers matched to your launch ambition</h2>
        <p className="mt-4 text-lg text-white/70">
          Choose a program that fits your launch velocity. Every tier can be tailored with add-ons like PR amplification, paid media, or community ops.
        </p>
      </div>
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-[32px] border p-8 ${
              tier.highlighted
                ? "border-primary/60 bg-gradient-to-br from-primary/20 via-white/5 to-transparent shadow-xl shadow-primary/30"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-white/50">{tier.name}</span>
            <p className="mt-4 text-4xl font-semibold text-white">{tier.price}</p>
            <p className="mt-3 text-sm text-white/70">{tier.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/60">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                tier.highlighted
                  ? "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:-translate-y-0.5 hover:shadow-xl"
                  : "border-white/20 text-white/80 hover:border-primary hover:text-primary"
              }`}
            >
              {tier.highlighted ? "Talk to a producer" : "Schedule a fit call"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
