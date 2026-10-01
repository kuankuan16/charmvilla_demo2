import { notFound } from "next/navigation";

// Any path that matches no route still lands inside app/[lang], so the 404 is answered in the visitor's language.
export default function UnmatchedPage() {
  notFound();
}
