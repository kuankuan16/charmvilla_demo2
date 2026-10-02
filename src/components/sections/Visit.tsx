"use client";
import StoreCarousel from "./StoreCarousel";

export default function Visit() {
  // 2026-10-01 (user): the ONLINE SHOP / 前往線上商店 block after the store carousel was removed (the site is the shop).
  return (
    <section id="visit" className="relative">
      <StoreCarousel />
      {/* 2026-10-02 (user: 「拿掉首頁 news 的區塊」): the news now has its own page, /news (src/data/news.ts). */}
    </section>
  );
}
