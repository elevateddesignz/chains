import { faqs } from "@/lib/data";

export function FAQ() {
  return (
    <section id="faqs" className="section-container">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-white/50">FAQs</span>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Answers before we hit go</h2>
        <p className="mt-4 text-lg text-white/70">
          Here is what teams ask us before we start architecting hype together.
        </p>
      </div>
      <div className="mt-16 space-y-6">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[28px] border border-white/10 bg-white/5 p-6"
          >
            <summary className="cursor-pointer text-left text-lg font-semibold text-white">
              {faq.question}
            </summary>
            <p className="mt-4 text-sm text-white/70 group-open:animate-fadeIn">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
