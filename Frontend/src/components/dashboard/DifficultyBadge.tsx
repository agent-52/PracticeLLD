export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: string;
}) {
  // Normalize difficulty string to Title Case ("easy" -> "Easy")
  const normalized =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

  const styles: Record<string, string> = {
    Easy: "text-[var(--color-easy)] bg-[var(--color-easy-bg)] border-[var(--color-easy)]",
    Medium:
      "text-[var(--color-medium)] bg-[var(--color-medium-bg)] border-[var(--color-medium)]",
    Hard: "text-[var(--color-hard)] bg-[var(--color-hard-bg)] border-[var(--color-hard)]",
  };

  const badgeStyle =
    styles[normalized] ||
    "text-[var(--color-text-secondary)] bg-[var(--color-surface)] border-[var(--color-border)]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-mono font-medium border border-opacity-20 ${badgeStyle}`}
    >
      {normalized}
    </span>
  );
}
