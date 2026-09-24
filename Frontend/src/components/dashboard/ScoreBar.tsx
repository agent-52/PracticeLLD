export default function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
        {score}/100
      </span>
    </div>
  );
}
