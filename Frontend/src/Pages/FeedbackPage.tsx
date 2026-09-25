import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEvaluation } from "../hooks/useEvaluation";
import { useAttemptDetails } from "../hooks/useAttemptDetails";
import { useCreateAttempt } from "../hooks/useCreateAttempt";

import { getProblems, type Problem } from "../api/problems.api";
import { getProblemAttempts } from "../api/attempts.api";
import { retryEvaluation } from "../api/evaluations.api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Confidence = "High" | "Medium" | "Low";

type RubricItem = {
  criterion: string;
  score: number;
  max: number;
  evidence: string | null;
  concern: string | null;
  suggestion: string | null;
  confidence: Confidence;
};

/* -------------------------------------------------------------------------- */
/* Small UI components                                                        */
/* -------------------------------------------------------------------------- */

function ConfidencePip({ level }: { level: Confidence }) {
  const colors: Record<Confidence, string> = {
    High: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${colors[level]}`}
      style={{
        fontFamily: "var(--font-mono)",
        borderRadius: "var(--radius-sm)",
      }}
    >
      {level}
    </span>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct =
    max > 0 ? Math.max(0, Math.min(100, Math.round((score / max) * 100))) : 0;

  return (
    <div
      className="w-full h-1.5 rounded-full"
      style={{
        backgroundColor: "var(--color-border)",
      }}
    >
      <div
        className="h-1.5 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          backgroundColor: "var(--color-accent)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Result normalization                                                       */
/* -------------------------------------------------------------------------- */

function normalizeResult(result: unknown): {
  overallScore: number | null;
  rubric: RubricItem[];
  summary: string;
} {
  if (typeof result !== "object" || result === null) {
    return {
      overallScore: null,
      rubric: [],
      summary: "",
    };
  }

  const data = result as Record<string, unknown>;

  const rubric: RubricItem[] = Array.isArray(data.rubric)
    ? data.rubric
        .filter(
          (item): item is Record<string, unknown> =>
            typeof item === "object" && item !== null,
        )
        .map((item) => {
          const confidence =
            item.confidence === "High" ||
            item.confidence === "Medium" ||
            item.confidence === "Low"
              ? item.confidence
              : "Medium";

          return {
            criterion: String(
              item.criterion ?? item.label ?? item.name ?? "Criterion",
            ),

            score: Number(item.score ?? 0),

            max: Number(item.max ?? item.maxScore ?? 100),

            evidence: typeof item.evidence === "string" ? item.evidence : null,

            concern: typeof item.concern === "string" ? item.concern : null,

            suggestion:
              typeof item.suggestion === "string" ? item.suggestion : null,

            confidence,
          };
        })
    : [];

  return {
    overallScore:
      typeof data.overallScore === "number" ? data.overallScore : null,

    rubric,

    summary:
      typeof data.summary === "string"
        ? data.summary
        : typeof data.overallFeedback === "string"
          ? data.overallFeedback
          : "",
  };
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function Header({
  title,
  attemptNumber,
  status,
  onProblems,
}: {
  title: string;
  attemptNumber: number;
  status: string;
  onProblems: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-10"
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-8 py-3"
        style={{ maxWidth: 1200 }}
      >
        <button
          type="button"
          onClick={onProblems}
          className="flex items-center gap-1.5 text-sm"
          style={{
            color: "var(--color-text-secondary)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Problems
        </button>

        <div className="flex items-center gap-3">
          <span
            className="text-sm font-semibold"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </span>

          <span
            className="text-sm"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Attempt #{attemptNumber}
          </span>
        </div>

        <span
          className="text-xs font-medium px-2.5 py-1"
          style={{
            backgroundColor:
              status === "COMPLETED"
                ? "#f0fdf4"
                : status === "FAILED"
                  ? "#fef2f2"
                  : "var(--color-accent-subtle)",

            color:
              status === "COMPLETED"
                ? "#15803d"
                : status === "FAILED"
                  ? "#b91c1c"
                  : "var(--color-accent-text)",

            borderRadius: "var(--radius-sm)",

            fontFamily: "var(--font-mono)",
          }}
        >
          {status}
        </span>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function LoadingScreen({
  title,
  attemptNumber,
  onProblems,
}: {
  title: string;
  attemptNumber: number;
  onProblems: () => void;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-ui)",
      }}
    >
      <Header
        title={title}
        attemptNumber={attemptNumber}
        status="EVALUATING"
        onProblems={onProblems}
      />

      <main className="mx-auto px-8 py-10" style={{ maxWidth: 1200 }}>
        <div
          className="flex flex-col items-center justify-center py-24 gap-5"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            className="w-7 h-7 rounded-full animate-spin"
            style={{
              border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-accent)",
            }}
          />

          <div className="text-center">
            <p
              className="text-base font-semibold mb-1.5"
              style={{
                color: "var(--color-text-primary)",
              }}
            >
              Evaluating your design...
            </p>

            <p
              className="text-sm"
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: 380,
              }}
            >
              We're reviewing your submission against the problem rubric. This
              typically takes under a minute.
            </p>
          </div>

          <div
            className="flex flex-col gap-2 mt-2"
            style={{
              maxWidth: 320,
              width: "100%",
            }}
          >
            {[
              "Parsing submitted solution",
              "Checking responsibility boundaries",
              "Assessing design quality",
            ].map((step) => (
              <div key={step} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "var(--color-accent)",
                  }}
                />

                <span
                  className="text-xs"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Failed                                                                     */
/* -------------------------------------------------------------------------- */

function FailedScreen({
  title,
  attemptNumber,
  attemptId,
  onProblems,
}: {
  title: string;
  attemptNumber: number;
  attemptId: string;
  onProblems: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [retrying, setRetrying] = useState(false);

  const retry = async () => {
    try {
      setRetrying(true);

      await retryEvaluation(attemptId);

      await queryClient.invalidateQueries({
        queryKey: ["evaluation", attemptId],
      });
    } catch (error) {
      console.error("Retry evaluation failed:", error);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-ui)",
      }}
    >
      <Header
        title={title}
        attemptNumber={attemptNumber}
        status="FAILED"
        onProblems={onProblems}
      />

      <main className="mx-auto px-8 py-10" style={{ maxWidth: 1200 }}>
        <div
          className="flex flex-col items-center justify-center py-24 gap-5 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            className="flex items-center justify-center w-11 h-11 rounded-full"
            style={{
              backgroundColor: "#fef2f2",
            }}
          >
            <span
              style={{
                color: "#b91c1c",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              !
            </span>
          </div>

          <div>
            <p
              className="text-base font-semibold mb-1.5"
              style={{
                color: "var(--color-text-primary)",
              }}
            >
              Evaluation couldn't be completed
            </p>

            <p
              className="text-sm mb-2"
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: 400,
              }}
            >
              Your submission was saved successfully, but feedback could not be
              generated.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              disabled={retrying}
              onClick={retry}
              className="py-2 px-4 text-sm font-medium text-white"
              style={{
                backgroundColor: "var(--color-accent)",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: retrying ? "not-allowed" : "pointer",
                opacity: retrying ? 0.7 : 1,
              }}
            >
              {retrying ? "Retrying..." : "Retry Evaluation"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="py-2 px-4 text-sm font-medium"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
              }}
            >
              Back to Submission
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Completed Feedback                                                         */
/* -------------------------------------------------------------------------- */

function FeedbackScreen({
  attemptNumber,
  result,
  attemptId,
  problem,
  onProblems,
}: {
  title: string;
  attemptNumber: number;
  result: ReturnType<typeof normalizeResult>;
  attemptId: string;
  problem: Problem;
  onProblems: () => void;
}) {
  const navigate = useNavigate();

  const createAttempt = useCreateAttempt();

  const [expanded, setExpanded] = useState<string | null>(
    result.rubric[0]?.criterion ?? null,
  );

  const tryAgain = async () => {
    if (!problem.id) {
      return;
    }

    try {
      const attempt = await createAttempt.mutateAsync(problem.id);

      navigate(`/problems/${problem.slug}/attempts/${attempt.id}/practice`);
    } catch (error) {
      console.error("Failed to create new attempt:", error);
    }
  };

  const viewSubmission = () => {
    navigate(`/problems/${problem.slug}/attempts/${attemptId}/practice`);
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-ui)",
      }}
    >
      <Header
        title={problem.title}
        attemptNumber={attemptNumber}
        status="COMPLETED"
        onProblems={onProblems}
      />

      <main className="mx-auto px-8 py-10" style={{ maxWidth: 1200 }}>
        <div className="mb-8">
          <h1
            className="text-xl font-semibold mb-1"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            Your Feedback
          </h1>

          <p
            className="text-sm"
            style={{
              color: "var(--color-text-secondary)",
            }}
          >
            Review the evidence behind your evaluation and identify what to
            improve in your next attempt.
          </p>
        </div>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "minmax(0, 1fr) 320px",
          }}
        >
          {/* Main column */}
          <div className="flex flex-col gap-6">
            {/* Rubric */}
            <section
              className="p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div className="mb-4">
                <h2
                  className="text-sm font-semibold mb-0.5"
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                >
                  Rubric
                </h2>

                <p
                  className="text-xs"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Scores are based on the evidence present in your submitted
                  solution.
                </p>
              </div>

              {result.rubric.length === 0 ? (
                <p
                  className="text-sm"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                >
                  No rubric breakdown was returned by the evaluator.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {result.rubric.map((item) => (
                    <div
                      key={item.criterion}
                      className="flex items-center gap-4"
                    >
                      <span
                        className="text-sm w-52 shrink-0"
                        style={{
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {item.criterion}
                      </span>

                      <div className="flex-1 min-w-0">
                        <ScoreBar score={item.score} max={item.max} />
                      </div>

                      <span
                        className="text-xs shrink-0 w-14 text-right"
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {item.score} / {item.max}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Detailed Feedback */}
            <section>
              <div className="mb-3">
                <h2
                  className="text-sm font-semibold mb-0.5"
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                >
                  Detailed Feedback
                </h2>
              </div>

              {result.rubric.length === 0 ? (
                <div
                  className="p-5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Detailed feedback was not returned for this evaluation.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {result.rubric.map((item) => {
                    const isOpen = expanded === item.criterion;

                    return (
                      <div
                        key={item.criterion}
                        style={{
                          backgroundColor: "var(--color-surface)",
                          border: `1px solid ${
                            isOpen
                              ? "var(--color-border-strong)"
                              : "var(--color-border)"
                          }`,
                          borderRadius: "var(--radius-lg)",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                          style={{
                            background: "none",
                            cursor: "pointer",
                            border: "none",
                          }}
                          onClick={() =>
                            setExpanded(isOpen ? null : item.criterion)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              style={{
                                transform: isOpen
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.15s ease",
                                color: "var(--color-text-muted)",
                                flexShrink: 0,
                              }}
                            >
                              <path
                                d="M5 3l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <span
                              className="text-sm font-medium"
                              style={{
                                color: "var(--color-text-primary)",
                              }}
                            >
                              {item.criterion}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <ConfidencePip level={item.confidence} />

                            <span
                              className="text-xs"
                              style={{
                                color: "var(--color-text-secondary)",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {item.score} / {item.max}
                            </span>
                          </div>
                        </button>

                        {isOpen &&
                          (item.evidence ||
                            item.concern ||
                            item.suggestion) && (
                            <div
                              className="px-5 pb-5 pt-1 flex flex-col gap-4"
                              style={{
                                borderTop: "1px solid var(--color-border)",
                              }}
                            >
                              {item.evidence && (
                                <div>
                                  <p
                                    className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                                    style={{
                                      color: "var(--color-text-muted)",
                                      letterSpacing: "0.06em",
                                    }}
                                  >
                                    Evidence
                                  </p>

                                  <p
                                    className="text-sm leading-relaxed"
                                    style={{
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    {item.evidence}
                                  </p>
                                </div>
                              )}

                              {item.concern && (
                                <div>
                                  <p
                                    className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                                    style={{
                                      color: "var(--color-text-muted)",
                                      letterSpacing: "0.06em",
                                    }}
                                  >
                                    Concern
                                  </p>

                                  <p
                                    className="text-sm leading-relaxed"
                                    style={{
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    {item.concern}
                                  </p>
                                </div>
                              )}

                              {item.suggestion && (
                                <div>
                                  <p
                                    className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                                    style={{
                                      color: "var(--color-text-muted)",
                                      letterSpacing: "0.06em",
                                    }}
                                  >
                                    Suggestion
                                  </p>

                                  <p
                                    className="text-sm leading-relaxed px-3 py-2.5"
                                    style={{
                                      color: "var(--color-accent-text)",
                                      backgroundColor:
                                        "var(--color-accent-subtle)",
                                      borderRadius: "var(--radius-md)",
                                      borderLeft:
                                        "3px solid var(--color-accent)",
                                    }}
                                  >
                                    {item.suggestion}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Overall score */}
            <div
              className="p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <p
                className="text-xs font-medium mb-3"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Overall score
              </p>

              <div className="flex items-baseline gap-1.5 mb-3">
                <span
                  className="text-4xl font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {result.overallScore ?? "—"}
                </span>

                <span
                  className="text-xl"
                  style={{
                    color: "var(--color-text-muted)",
                  }}
                >
                  /
                </span>

                <span
                  className="text-xl font-medium"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                >
                  100
                </span>
              </div>

              {result.overallScore !== null && (
                <div className="mb-4">
                  <ScoreBar score={result.overallScore} max={100} />
                </div>
              )}

              {result.summary && (
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {result.summary}
                </p>
              )}
            </div>

            {/* Next action */}
            <div
              className="p-5"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{
                  color: "var(--color-text-primary)",
                }}
              >
                Ready to improve?
              </p>

              <p
                className="text-xs mb-4"
                style={{
                  color: "var(--color-text-secondary)",
                }}
              >
                Create another attempt and apply the feedback to your design.
              </p>

              <button
                type="button"
                disabled={createAttempt.isPending}
                className="w-full py-2 px-4 text-sm font-medium text-white"
                style={{
                  backgroundColor: "var(--color-accent)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  cursor: createAttempt.isPending ? "not-allowed" : "pointer",
                  opacity: createAttempt.isPending ? 0.7 : 1,
                }}
                onClick={tryAgain}
              >
                {createAttempt.isPending ? "Creating..." : "Try Again"}
              </button>

              <button
                type="button"
                className="w-full py-2 px-4 text-sm font-medium mt-2"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-text-secondary)",
                  cursor: "pointer",
                }}
                onClick={viewSubmission}
              >
                View Submission
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function FeedbackPage() {
  const navigate = useNavigate();

  const { attemptId } = useParams<{
    attemptId: string;
  }>();

  const attemptQuery = useAttemptDetails(attemptId);

  const evaluationQuery = useEvaluation(attemptId);

  /*
   * We only have problemId in the attempt.
   * Fetch the problem list and resolve the
   * corresponding problem/slug.
   */
  const problemsQuery = useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });

  /*
   * Get all attempts for the problem so we
   * can determine Attempt #N.
   */
  const problemId = attemptQuery.data?.attempt.problemId;

  const attemptsQuery = useQuery({
    queryKey: ["attempts", problemId],
    queryFn: () => getProblemAttempts(problemId!),
    enabled: Boolean(problemId),
  });

  if (!attemptId) {
    return <div className="p-8">Invalid attempt.</div>;
  }

  /*
   * Initial loading.
   */
  if (
    attemptQuery.isLoading ||
    evaluationQuery.isLoading ||
    problemsQuery.isLoading
  ) {
    return (
      <LoadingScreen
        title="Practice"
        attemptNumber={1}
        onProblems={() => navigate("/")}
      />
    );
  }

  /*
   * Attempt failed to load.
   */
  if (attemptQuery.isError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-background)",
          fontFamily: "var(--font-ui)",
        }}
      >
        <div className="text-center">
          <p
            className="text-base font-semibold mb-2"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            Unable to load this attempt
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm"
            style={{
              color: "var(--color-accent)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const attempt = attemptQuery.data?.attempt;

  if (!attempt) {
    return <div className="p-8">Attempt not found.</div>;
  }

  /*
   * Resolve problem using problemId.
   */
  const problem = problemsQuery.data?.find(
    (item) => item.id === attempt.problemId,
  );

  /*
   * Problem hasn't loaded/resolved yet.
   */
  if (problemsQuery.isError || !problem) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-background)",
          fontFamily: "var(--font-ui)",
        }}
      >
        <div className="text-center">
          <p
            className="text-base font-semibold mb-2"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            Unable to load problem
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm"
            style={{
              color: "var(--color-accent)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  /*
   * Determine attempt number.
   */
  const attempts = attemptsQuery.data ?? [];

  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const currentIndex = sortedAttempts.findIndex(
    (item) => item.id === attempt.id,
  );

  const attemptNumber = currentIndex >= 0 ? currentIndex + 1 : 1;

  /*
   * Evaluation is still running.
   *
   * This covers both:
   * PENDING
   * RUNNING
   *
   * It also handles the short window where
   * evaluation hasn't been returned yet.
   */
  const evaluation = evaluationQuery.data;

  if (!evaluation) {
    const isDraft = attempt.status === "DRAFT";

    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-background)",
          fontFamily: "var(--font-ui)",
        }}
      >
        <div className="text-center">
          <p
            className="text-base font-semibold mb-2"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            {isDraft
              ? "This attempt has not been submitted yet."
              : "Feedback is not available for this attempt."}
          </p>

          <p
            className="text-sm mb-5"
            style={{
              color: "var(--color-text-secondary)",
            }}
          >
            {isDraft
              ? "Continue your attempt to submit it for evaluation."
              : "No evaluation was found for this attempt."}
          </p>

          <button
            type="button"
            onClick={() => {
              if (isDraft) {
                navigate(
                  `/problems/${problem.slug}/attempts/${attempt.id}/practice`,
                );
              } else {
                navigate("/");
              }
            }}
            className="py-2 px-4 text-sm font-medium text-white"
            style={{
              backgroundColor: "var(--color-accent)",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isDraft ? "Continue Attempt" : "Back to Problems"}
          </button>
        </div>
      </div>
    );
  }

  if (evaluation.status === "PENDING" || evaluation.status === "RUNNING") {
    return (
      <LoadingScreen
        title={problem.title}
        attemptNumber={attemptNumber}
        onProblems={() => navigate("/")}
      />
    );
  }

  /*
   * Evaluation failed.
   */
  if (evaluation.status === "FAILED") {
    return (
      <FailedScreen
        title={problem.title}
        attemptNumber={attemptNumber}
        attemptId={attemptId}
        onProblems={() => navigate("/")}
      />
    );
  }

  /*
   * Evaluation completed.
   */
  const result = normalizeResult(evaluation.result);

  return (
    <FeedbackScreen
      title={problem.title}
      attemptNumber={attemptNumber}
      result={result}
      attemptId={attemptId}
      problem={problem}
      onProblems={() => navigate("/")}
    />
  );
}
