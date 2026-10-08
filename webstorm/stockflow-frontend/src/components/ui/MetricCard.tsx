type MetricCardProps = {
  label: string;
  value: number;
  helper?: string;
  tone?: 'default' | 'warning';
};

export function MetricCard({ label, value, helper, tone = 'default' }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper && <small>{helper}</small>}
    </article>
  );
}
