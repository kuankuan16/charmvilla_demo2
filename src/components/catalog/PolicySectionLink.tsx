"use client";

import { useEffect } from "react";

/** Reveal the policy section before a fragment link scrolls to the closed accordion. */
export default function PolicySectionLink({ href, label }: { href: string; label: string }) {
  const reveal = () => {
    const section = document.getElementById(href.slice(1));
    if (section instanceof HTMLDetailsElement) section.open = true;
  };
  useEffect(() => {
    const revealHash = () => {
      if (window.location.hash !== href) return;
      const section = document.getElementById(href.slice(1));
      if (section instanceof HTMLDetailsElement) section.open = true;
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    return () => window.removeEventListener("hashchange", revealHash);
  }, [href]);
  return <a className="policy-inline-link" href={href} onClick={reveal}>{label}</a>;
}
