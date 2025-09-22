import { featureSections } from "@/lib/data";
import Image from "next/image";

export function Work() {
  return (
    <section id="work" className="section-container">
      <div className="space-y-6 text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-white/50">Recent Systems</span>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Playbooks that turn momentum into pipeline</h2>
        <p className="mx-auto max-w-3xl text-lg text-white/70">
          Every engagement connects IRL experiences with digital journeys, ensuring that hype is architected, activated, and measured.
        </p>
      </div>
      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        {featureSections.map((section, index) => (
          <article
            key={section.title}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/20"
          >
            <div className="absolute -top-16 right-8 h-40 w-40 rounded-full bg-gradient-to-br from-primary/50 via-accent/40 to-transparent blur-3xl" />
            <div className="relative space-y-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-base font-semibold text-white/70">
                0{index + 1}
              </span>
              <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
              <p className="text-sm text-white/70">{section.description}</p>
              <ul className="space-y-3 text-sm text-white/60">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <h3 className="text-2xl font-semibold text-white">Drop Launch: Nova Athletics x Shopify</h3>
          <p className="mt-4 text-sm text-white/70">
            Integrated pop-up and digital drop that sold out 12k units in 36 hours. Lifecycle flows captured 18k new subscribers and converted 27% to purchase within 14 days.
          </p>
          <Image
            src="/case-nova.svg"
            alt="Nova Athletics case study"
            width={800}
            height={520}
            className="mt-6 h-64 w-full rounded-3xl object-cover"
          />
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <h3 className="text-2xl font-semibold text-white">Product Beta: PulsePay Founders Circle</h3>
          <p className="mt-4 text-sm text-white/70">
            Invitation-only beta with experiential touchpoints that doubled qualified pipeline. Dashboard instrumentation helped the team close enterprise deals 40% faster.
          </p>
          <Image
            src="/case-pulse.svg"
            alt="PulsePay activation"
            width={800}
            height={520}
            className="mt-6 h-64 w-full rounded-3xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
