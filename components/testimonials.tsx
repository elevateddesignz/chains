import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section id="testimonials" className="section-container">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-white/50">Testimonials</span>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Revenue leaders trust Hype Em Up to deliver launches that pay for themselves</h2>
        <p className="mt-4 text-lg text-white/70">
          From DTC to B2B SaaS, marketing teams rely on us to build experiences their customers never forget.
        </p>
      </div>
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.author}
            className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 p-8"
          >
            <blockquote className="text-base text-white/80">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm text-white/60">
              <span className="block font-semibold text-white">{testimonial.author}</span>
              {testimonial.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
