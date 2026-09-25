import { useNavigate, useParams } from "react-router-dom";
import { useProblem } from "../hooks/useProblem";
import { useAttempts } from "../hooks/useAttempts";
import { useCreateAttempt } from "../hooks/useCreateAttempt";

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Unknown";
  }

  const now = new Date();
  const diff = now.getTime() - value.getTime();

  const day = 24 * 60 * 60 * 1000;

  if (diff < day) {
    return "Today";
  }

  if (diff < day * 2) {
    return "Yesterday";
  }

  return value.toLocaleDateString();
}

function getStatusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "EVALUATING":
      return "Evaluating";

    case "SUBMITTED":
      return "Submitted";

    case "FAILED":
      return "Failed";

    case "DRAFT":
      return "Draft";

    default:
      return status;
  }
}

export default function ProblemDetailPage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const navigate = useNavigate();

  const problemQuery = useProblem(slug);

  const createAttemptMutation = useCreateAttempt();

  const problem = problemQuery.data;

  const attemptsQuery = useAttempts(problem?.id);

  if (problemQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <p className="font-mono text-[13px] text-[var(--color-text-muted)]">
          Loading problem...
        </p>
      </div>
    );
  }

  if (problemQuery.isError || !problem) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-[13px] text-[var(--color-text-muted)]">
          Problem not found.
        </p>

        <button
          onClick={() => navigate("/")}
          className="text-[13px] text-[var(--color-accent)]"
        >
          ← Back to Problems
        </button>
      </div>
    );
  }

  const attempts = attemptsQuery.data ?? [];

  const startAttempt = async () => {
    if (!problem.id) {
      window.alert("Problem information is missing.");
      return;
    }

    try {
      const attempt = await createAttemptMutation.mutateAsync(problem.id);

      console.log("NEW ATTEMPT:", attempt);

      navigate(`/problems/${problem.slug}/attempts/${attempt.id}/practice`);
    } catch (error) {
      console.error("Failed to create attempt:", error);

      if (error instanceof Error) {
        window.alert(`Failed to start attempt: ${error.message}`);
      } else {
        window.alert("Failed to start attempt.");
      }
    }
  };

  const openAttempt = (attemptId: string) => {
    navigate(`/attempts/${attemptId}/feedback`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] h-[52px] sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="font-semibold text-[15px] text-[var(--color-text-primary)]">
              LLD Practice
            </span>

            <button
              onClick={() => navigate("/")}
              className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              ← Back to Problems
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-easy)]" />

            <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
              Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 py-8 pb-16">
        {/* Problem heading */}
        <div className="mb-7">
          <div className="flex items-center gap-2.5 mb-2.5">
            <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">
              {problem.title}
            </h1>

            <span className="text-[12px] font-medium text-[var(--color-medium)] bg-[var(--color-medium-bg)] border border-[var(--color-medium)]/20 rounded px-2 py-0.5">
              {problem.difficulty}
            </span>
          </div>

          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-[680px]">
            {problem.description}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
          {/* Left */}
          <div className="flex flex-col gap-4">
            {/* Requirements */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-6">
              <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">
                Requirements
              </h2>

              <div className="flex flex-col gap-2.5">
                {problem.requirements.map((requirement, index) => (
                  <div
                    key={`${requirement}-${index}`}
                    className="flex gap-4 items-start"
                  >
                    <span className="font-mono text-[11px] font-medium text-[var(--color-text-muted)] min-w-5 pt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-3">
                  Constraints & Assumptions
                </h3>

                <ul className="m-0 pl-[18px] text-[13px] text-[var(--color-text-secondary)] leading-relaxed flex flex-col gap-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={`${constraint}-${index}`}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evaluation */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-6">
              <h2 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1.5">
                What will be evaluated
              </h2>

              <p className="text-[13px] text-[var(--color-text-secondary)] mb-[18px] leading-relaxed">
                There can be multiple valid designs. Feedback is based on design
                quality and evidence in your solution rather than a single
                reference implementation.
              </p>

              <div className="flex flex-col gap-1.5">
                {problem.rubric.length === 0 ? (
                  <p className="text-[13px] text-[var(--color-text-muted)]">
                    Evaluation criteria unavailable.
                  </p>
                ) : (
                  problem.rubric.map((criterion) => (
                    <div
                      key={criterion.label}
                      className="flex items-center justify-between px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[6px]"
                    >
                      <span className="text-[13px] text-[var(--color-text-primary)]">
                        {criterion.label}
                      </span>

                      <span className="font-mono text-[11px] text-[var(--color-accent)] font-medium">
                        {criterion.weight}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {/* Start */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-5">
              <button
                onClick={startAttempt}
                disabled={createAttemptMutation.isPending}
                className="w-full bg-[var(--color-accent)] text-white rounded-[6px] py-[11px] px-5 text-[14px] font-semibold disabled:opacity-60"
              >
                {createAttemptMutation.isPending
                  ? "Starting..."
                  : "Start New Attempt"}
              </button>

              {createAttemptMutation.isError && (
                <p className="mt-2 text-[12px] text-red-500">
                  Failed to start attempt. Please try again.
                </p>
              )}
            </div>

            {/* Previous attempts */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-5">
              <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-3.5">
                Previous Attempts
              </h2>

              {attemptsQuery.isLoading ? (
                <p className="text-[13px] text-[var(--color-text-muted)]">
                  Loading attempts...
                </p>
              ) : attemptsQuery.isError ? (
                <p className="text-[13px] text-red-500">
                  Failed to load attempts.
                </p>
              ) : attempts.length === 0 ? (
                <p className="text-[13px] text-[var(--color-text-muted)]">
                  No attempts yet. Start your first design.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between px-3 py-[11px] border border-[var(--color-border)] rounded-[6px]"
                    >
                      <div>
                        <div className="text-[13px] font-medium text-[var(--color-text-primary)]">
                          Attempt #{attempt.number}
                        </div>

                        <div className="flex items-center gap-2 mt-[3px]">
                          {attempt.score !== null ? (
                            <span className="font-mono text-[12px] text-[var(--color-easy)] font-medium">
                              {attempt.score}/100
                            </span>
                          ) : (
                            <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
                              {getStatusLabel(attempt.status)}
                            </span>
                          )}

                          <span className="text-[11px] text-[var(--color-text-muted)]">
                            {formatDate(attempt.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Open any existing attempt */}
                      <button
                        onClick={() => openAttempt(attempt.id)}
                        className="text-[12px] font-medium text-[var(--color-accent)]"
                      >
                        View Feedback →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
