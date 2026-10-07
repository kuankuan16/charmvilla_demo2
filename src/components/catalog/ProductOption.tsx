"use client";
// The chosen option (packaging / tea) of the product page, shared between the bag button (which sets it) and the gallery
// (which may swap its views for it — the Reunion box shows the paulownia box's photographs when 粉紅色 is chosen;
// user 2026-10-07: 「在團圓頁選『粉紅色』時切換」).
import { createContext, useContext, useState, type ReactNode } from "react";

const Ctx = createContext<{ option: number | undefined; setOption: (i: number | undefined) => void } | null>(null);

export function ProductOptionProvider({ children }: { children: ReactNode }) {
  const [option, setOption] = useState<number | undefined>(undefined);
  return <Ctx.Provider value={{ option, setOption }}>{children}</Ctx.Provider>;
}

/** The shared option, or a local one where no provider wraps the component. */
export function useProductOption() {
  const ctx = useContext(Ctx);
  const local = useState<number | undefined>(undefined);
  return ctx ?? { option: local[0], setOption: local[1] };
}
