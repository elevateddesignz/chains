"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { navigation } from "@/lib/data";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <div className="section-container flex items-center justify-between py-6">
        <Link href="#top" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground shadow-glow">
            HEU
          </span>
          <div className="hidden sm:flex sm:flex-col">
            <span className="text-sm uppercase text-white/60">Hype Em Up</span>
            <span className="text-base text-white">Experiential Studio</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="hidden rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl md:inline-flex"
          >
            Book a Hype Audit
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-primary hover:text-primary md:hidden"
            aria-label="Open navigation"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-[#050510] px-6 py-8 sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <Link
                href="#top"
                className="flex items-center gap-3 text-lg font-semibold tracking-tight"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground shadow-glow">
                  HEU
                </span>
                <span>Hype Em Up</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 p-3 text-white"
                aria-label="Close navigation"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8 space-y-6 text-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl bg-white/5 px-4 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Book a Hype Audit
            </Link>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}
