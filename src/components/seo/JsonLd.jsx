export function JsonLd({ id, data }) {
  if (!data) return null;
  return (
    <script
      id={id}
      type="application/ld+json"
      /* Structured data we generate ourselves. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
