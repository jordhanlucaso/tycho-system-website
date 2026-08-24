/** Renders a JSON-LD block. Returns null for empty payloads so nothing hollow ships. */
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Payload is assembled from local data modules only — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
