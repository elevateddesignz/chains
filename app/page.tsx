import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Approach } from "@/components/approach";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { CTA } from "@/components/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Approach />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}
