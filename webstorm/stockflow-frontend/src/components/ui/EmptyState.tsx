export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="empty-state" role="status">
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </section>
  );
}
