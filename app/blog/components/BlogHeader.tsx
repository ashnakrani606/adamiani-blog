"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Lang } from "@/app/lang";
import { content } from "@/app/lang";

type BlogHeaderProps = {
  language: Lang;
  setLanguage: (lang: Lang) => void;
};

export function BlogHeader({ language, setLanguage }: BlogHeaderProps) {
  const t = content[language];

  return (
    <div className="sticky top-0 z-9999 w-full border-b border-hairline bg-cream py-3.75">
      <nav className="mx-auto flex w-full max-w-360 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Adamiani.AI"
            width={156}
            height={28}
            className="max-w-30 sm:max-w-full"
          />
        </Link>

        <div className="hidden items-center gap-8 text-[13px] font-medium text-[#50677F] lg:flex">
          <Link href="/#how-it-work" className="transition hover:text-accent-blue">
            {t.nav[0]}
          </Link>
          <Link href="/#treatment-request" className="transition hover:text-accent-blue">
            {t.nav[1]}
          </Link>
          <Link href="/#passport" className="transition hover:text-accent-blue">
            {t.nav[2]}
          </Link>
          <Link href="/#trust" className="transition hover:text-accent-blue">
            {t.nav[3]}
          </Link>
          <Link href="/blog" className="text-ink transition hover:text-accent-blue">
            {t.blogNav}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex">
            {(["en", "ru", "ka"] as const).map((lang, index) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`cursor-pointer text-xs font-medium ${
                  language === lang ? "text-ink" : "text-dark-grayish-blue"
                }`}
              >
                {lang.toUpperCase()}
                {index !== 2 && (
                  <span className="pl-1.25 pr-1.5 text-hairline">/</span>
                )}
              </button>
            ))}
          </div>
          <Link
            href="/#treatment-request"
            className="group hidden cursor-pointer items-center gap-2 rounded-full bg-accent-blue px-5 py-2.5 text-sm text-white transition-all duration-500 hover:bg-accent-teal lg:flex"
          >
            {t.startCase}
            <ArrowRight className="h-4 w-4 transform transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
