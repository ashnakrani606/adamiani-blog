"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/app/lang";
import { isValidBlogLang } from "@/lib/sanity/helpers";

const STORAGE_KEY = "adamiani_lang";

export function useBlogLanguage(initial: Lang = "en") {
  const [language, setLanguageState] = useState<Lang>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isValidBlogLang(saved)) {
      setLanguageState(saved);
    }
    setReady(true);
  }, []);

  const setLanguage = useCallback((lang: Lang) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  return { language, setLanguage, ready };
}
