import { processSteps } from "@/lib/data";

export function Approach() {
  return (
    <section id="approach" className="section-container">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <span className="text-sm uppercase tracking-[0.3em] text-white/50">Approach</span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">An eight-week sprint with measurable checkpoints</h2>
          <p className="text-lg text-white/70">
            We orchestrate cross-functional pods that move from narrative strategy to production and amplification without the typical agency silos.
          </p>
          <div className="rounded-[32px] border border-primary/20 bg-primary/10 p-8 text-white/80">
            <h3 className="text-xl font-semibold text-white">Your growth partner on speed dial</h3>
            <p className="mt-3 text-sm text-white/70">
              Async updates twice a week, Miro boards for alignment, and live dashboards with budget and KPI tracking keep your team confident from start to finish.
            </p>
          </div>
        </div>
        <ol className="space-y-6">
          {processSteps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-[28px] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                    Phase {index + 1}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{step.description}</p>
                </div>
                <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/60">
                  {step.duration}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
