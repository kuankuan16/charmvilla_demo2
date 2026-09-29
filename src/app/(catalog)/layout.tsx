import CatalogShell from "@/components/catalog/CatalogShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CatalogShell>{children}</CatalogShell>;
}
