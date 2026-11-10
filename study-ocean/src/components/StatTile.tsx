interface Props {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}

export default function StatTile({ label, value, sub, emphasis }: Props) {
  return (
    <div
      className={`rounded-2xl border border-border px-4 py-3.5 ${emphasis ? "bg-accent-soft" : "bg-surface"}`}
    >
      <p className="text-[11.5px] font-medium text-text-muted mb-1">{label}</p>
      <p className={`text-[19px] font-extrabold tabular-nums ${emphasis ? "text-accent" : "text-text"}`}>{value}</p>
      {sub && <p className="text-[11px] text-text-faint mt-0.5">{sub}</p>}
    </div>
  );
}
