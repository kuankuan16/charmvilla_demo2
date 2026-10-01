// Social icons (inline SVG, brand gold) linking to the accounts listed in the footer of charmvilla.com.tw
// (Facebook, Twitter, Instagram — fetched 2026-09-30). Icons follow the official site's set, including the Twitter bird.
import { social } from "@/data/content";
import { translator, type Locale } from "@/i18n/config";

const icons: Record<string, React.ReactNode> = {
  facebook: <path fill="currentColor" d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3Z" />,
  twitter: <path fill="currentColor" d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-2.9-1.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9-3.4-.2-6.3-1.8-8.3-4.2-.4.6-.6 1.3-.6 2 0 1.4.7 2.6 1.8 3.4-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.2 4-.3.1-.7.2-1.1.2-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.1 1.7-5 1.7-.3 0-.6 0-1-.1 1.8 1.1 3.9 1.8 6.2 1.8 7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.5-1.3 2-2.1Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" /></>,
};

export default function SocialLinks({ className = "", lang }: { className?: string; lang: Locale }) {
  const t = translator(lang);
  return (
    <ul className={`social-links ${className}`} aria-label={t("社群媒體", "Social media")}>
      {social.map((s) => (
        <li key={s.id}>
          <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">{icons[s.id]}</svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
