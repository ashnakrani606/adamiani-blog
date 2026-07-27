"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getYouTubeEmbedUrl, urlForImage } from "@/lib/sanity";

type TableRow = {
  cells?: string[];
};

type TableBlockValue = {
  caption?: string;
  hasHeaderRow?: boolean;
  rows?: TableRow[];
};

type CalloutValue = {
  variant?: "info" | "note" | "warning" | "tip";
  title?: string;
  text?: string;
};

type YouTubeValue = {
  url?: string;
  caption?: string;
};

type ImageValue = {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
};

const calloutStyles: Record<
  NonNullable<CalloutValue["variant"]>,
  { box: string; label: string }
> = {
  info: {
    box: "border-accent-blue/30 bg-mist",
    label: "Info",
  },
  note: {
    box: "border-dark-grayish-blue/30 bg-cloud",
    label: "Note",
  },
  warning: {
    box: "border-amber-500/40 bg-amber-50",
    label: "Warning",
  },
  tip: {
    box: "border-accent-teal/30 bg-mist",
    label: "Tip",
  },
};

const headingClass = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const sizes: Record<number, string> = {
    1: "mt-12 mb-5 text-3xl sm:text-4xl",
    2: "mt-10 mb-4 text-2xl sm:text-3xl",
    3: "mt-8 mb-3 text-xl sm:text-2xl",
    4: "mt-7 mb-3 text-lg sm:text-xl",
    5: "mt-6 mb-2 text-base sm:text-lg",
    6: "mt-5 mb-2 text-sm sm:text-base uppercase tracking-[0.08em]",
  };
  return `font-display font-semibold text-ink ${sizes[level]}`;
};

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className={headingClass(1)}>{children}</h1>,
    h2: ({ children }) => <h2 className={headingClass(2)}>{children}</h2>,
    h3: ({ children }) => <h3 className={headingClass(3)}>{children}</h3>,
    h4: ({ children }) => <h4 className={headingClass(4)}>{children}</h4>,
    h5: ({ children }) => <h5 className={headingClass(5)}>{children}</h5>,
    h6: ({ children }) => <h6 className={headingClass(6)}>{children}</h6>,
    normal: ({ children }) => (
      <p className="mb-5 text-[15px] leading-relaxed text-dark-grayish-blue sm:text-base">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent-blue pl-5 font-serif text-lg italic text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-5 text-[15px] text-dark-grayish-blue sm:text-base">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-[15px] text-dark-grayish-blue sm:text-base">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const blank = value?.blank !== false;
      return (
        <a
          href={href}
          className="text-accent-blue underline underline-offset-4 hover:text-accent-teal"
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    code: ({ children }) => (
      <code className="rounded bg-mist px-1.5 py-0.5 text-sm text-ink">{children}</code>
    ),
  },
  types: {
    image: ({ value }: { value?: ImageValue }) => {
      if (!value?.asset) return null;
      const src = urlForImage(value).width(1200).url();
      return (
        <figure className="my-8">
          <div className="relative aspect-[16/9] overflow-hidden bg-mist rounded-sm">
            <Image
              src={src}
              alt={value.alt || value.caption || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-dark-grayish-blue">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    tableBlock: ({ value }: { value?: TableBlockValue }) => {
      const rows = value?.rows?.filter((row) => row.cells?.length) ?? [];
      if (rows.length === 0) return null;

      const hasHeader = value?.hasHeaderRow !== false;
      const headerRow = hasHeader ? rows[0] : null;
      const bodyRows = hasHeader ? rows.slice(1) : rows;

      return (
        <figure className="my-8 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            {headerRow && (
              <thead>
                <tr className="border border-hairline bg-mist">
                  {headerRow.cells?.map((cell, index) => (
                    <th
                      key={`head-${index}`}
                      className="px-4 py-3 font-semibold text-ink"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="border-x border-b border-hairline"
                >
                  {row.cells?.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="px-4 py-3 text-dark-grayish-blue"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-dark-grayish-blue">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }: { value?: CalloutValue }) => {
      if (!value?.text) return null;
      const variant = value.variant || "info";
      const styles = calloutStyles[variant];

      return (
        <aside
          className={`my-8 rounded-sm border-l-4 px-5 py-4 ${styles.box}`}
          role="note"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
            {value.title || styles.label}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-dark-grayish-blue sm:text-base">
            {value.text}
          </p>
        </aside>
      );
    },
    youtube: ({ value }: { value?: YouTubeValue }) => {
      if (!value?.url) return null;
      const embedUrl = getYouTubeEmbedUrl(value.url);
      if (!embedUrl) return null;

      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden bg-ink rounded-sm">
            <iframe
              src={embedUrl}
              title={value.caption || "YouTube video"}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-dark-grayish-blue">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

type BlogPortableTextProps = {
  value: PortableTextBlock[];
};

export function BlogPortableText({ value }: BlogPortableTextProps) {
  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
