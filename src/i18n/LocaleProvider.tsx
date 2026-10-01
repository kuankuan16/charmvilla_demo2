"use client";
// Locale for client components. Server components receive `lang` from the route params instead.
import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, translator, type Locale } from "./config";

const LocaleContext = createContext<Locale>(defaultLocale);
export function LocaleProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
/** The current locale and its t("中文", "English") picker. */
export const useT = () => { const lang = useLocale(); return { lang, t: translator(lang) }; };
