import Link from "next/link";

export function Footer() {
  return (
    <footer className="section-container border-t border-white/10 text-sm text-white/60">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <p>&copy; {new Date().getFullYear()} Hype Em Up. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link
            href="mailto:hello@hypeemup.com"
            className="transition hover:text-white"
          >
            hello@hypeemup.com
          </Link>
          <Link href="https://www.linkedin.com" className="transition hover:text-white">
            LinkedIn
          </Link>
          <Link href="https://www.instagram.com" className="transition hover:text-white">
            Instagram
          </Link>
        </div>
      </div>
    </footer>
  );
}
