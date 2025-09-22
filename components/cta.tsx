import Link from "next/link";

export function CTA() {
  return (
    <section className="section-container">
      <div className="relative overflow-hidden rounded-[40px] border border-primary/40 bg-gradient-to-br from-primary/40 via-accent/30 to-transparent p-12 text-center shadow-xl shadow-primary/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_55%)]" />
        <div className="relative space-y-6">
          <span className="text-sm uppercase tracking-[0.3em] text-white/70">Let’s build hype</span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ready to architect your next moment?</h2>
          <p className="mx-auto max-w-3xl text-lg text-white/80">
            We help ambitious teams orchestrate culture-driving launches that deliver measurable revenue. Tell us your goal and we’ll map the path.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Book a hype audit
            </Link>
            <Link
              href="mailto:hello@hypeemup.com"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white/80 transition hover:border-primary hover:text-primary"
            >
              Email the founders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
