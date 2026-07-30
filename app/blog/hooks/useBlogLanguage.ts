"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/app/lang";
import { isValidBlogLang } from "@/lib/sanity/helpers";
import { blogLanguagePath, getBlogLanguage } from "../seo";

const STORAGE_KEY = "adamiani_lang";

export function useBlogLanguage(initial: Lang = "en") {
  const [language, setLanguageState] = useState<Lang>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
    const saved = localStorage.getItem(STORAGE_KEY);
    const nextLanguage = isValidBlogLang(requestedLanguage || "")
      ? requestedLanguage
      : saved && isValidBlogLang(saved)
        ? saved
        : initial;
    const resolvedLanguage = getBlogLanguage(nextLanguage || undefined);

    localStorage.setItem(STORAGE_KEY, resolvedLanguage);
    window.history.replaceState(
      null,
      "",
      blogLanguagePath(window.location.pathname, resolvedLanguage)
    );
    const timer = window.setTimeout(() => {
      setLanguageState(resolvedLanguage);
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initial]);

  const setLanguage = useCallback((lang: Lang) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    window.history.replaceState(null, "", blogLanguagePath(window.location.pathname, lang));
  }, []);

  return { language, setLanguage, ready };
}
