import NotFoundView from "@/components/catalog/NotFoundView";

// Rendered for notFound() anywhere under app/[lang]: unknown product or collection, or a path that matches no route.
export default function NotFound() {
  return <NotFoundView />;
}
