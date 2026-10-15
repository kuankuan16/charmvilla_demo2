import { graph, serializeSchema, type SchemaNode } from "@/lib/seo/schema";

/** Server-rendered data; never inject scripts after hydration. */
export default function JsonLd({ nodes }: { nodes: SchemaNode[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(graph(nodes)) }} />;
}
