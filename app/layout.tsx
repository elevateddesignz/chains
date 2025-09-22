import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Hype Em Up | Launch unforgettable brand moments",
  description:
    "Hype Em Up blends experiential marketing with data-backed strategy so high-growth brands can launch unforgettable campaigns and capture measurable demand.",
  metadataBase: new URL("https://hypeemup.com"),
  openGraph: {
    title: "Hype Em Up",
    description:
      "Experiential marketing studio for venture-backed brands looking to turn attention into action.",
    url: "https://hypeemup.com",
    siteName: "Hype Em Up",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Hype Em Up hero graphic"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hype Em Up",
    description:
      "Experiential marketing studio for venture-backed brands looking to turn attention into action.",
    images: ["/og.svg"],
    creator: "@hypeemup"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sans.variable} bg-[#050510] text-white antialiased`}>
        <div className="relative mx-auto max-w-[1440px] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(108,92,231,0.35),_transparent_60%)]" />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
