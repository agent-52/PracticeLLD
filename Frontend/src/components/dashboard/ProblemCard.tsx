import { useNavigate } from "react-router-dom";
import type { DashboardProblem } from "../../api/dashboard.api";
import DifficultyBadge from "./DifficultyBadge";
import ScoreBar from "./ScoreBar";

export default function ProblemCard({
  problem,
}: {
  problem: DashboardProblem;
}) {
  const navigate = useNavigate();
  const attempted = problem.attempts > 0;
  const actionLabel = attempted ? "Continue" : "Start Practice";

  return (
    <div className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 flex flex-col gap-4 transition-all duration-150 hover:border-[var(--color-border-strong)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] leading-snug">
            {problem.title}
          </h3>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        {attempted && (
          <div className="shrink-0 mt-0.5">
            <span className="font-mono text-[11px] text-[var(--color-text-muted)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-0.5">
              {problem.attempts}{" "}
              {problem.attempts === 1 ? "attempt" : "attempts"}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed flex-1">
        {problem.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]">
        <div className="flex flex-col gap-1">
          {attempted && problem.bestScore !== null ? (
            <>
              <span className="text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-wide">
                Best score
              </span>
              <ScoreBar score={problem.bestScore} />
            </>
          ) : (
            <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
              Not attempted
            </span>
          )}
        </div>
        <button
          onClick={() => navigate(`/problems/${problem.slug}`)}
          className={`shrink-0 px-4 py-1.5 rounded-[var(--radius-md)] text-[13px] font-medium transition-colors duration-150 ${
            attempted
              ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
              : "bg-[var(--color-background)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
