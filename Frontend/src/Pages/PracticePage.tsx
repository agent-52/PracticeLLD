import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useProblem } from "../hooks/useProblem";
import { useAttemptDetails } from "../hooks/useAttemptDetails";

import { saveSubmission } from "../api/submissions.api";
import { submitAttempt } from "../api/attemptLifeCycle.api";
import { startEvaluation } from "../api/evaluations.api";

type Tab = "code" | "explanation" | "diagram";

type Difficulty = "Easy" | "Medium" | "Hard";

function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  const config: Record<
    Difficulty,
    {
      color: string;
      background: string;
    }
  > = {
    Easy: {
      color: "#15803d",
      background: "#f0fdf4",
    },
    Medium: {
      color: "#a16207",
      background: "#fefce8",
    },
    Hard: {
      color: "#dc2626",
      background: "#fef2f2",
    },
  };

  const normalizedDifficulty: Difficulty =
    difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard"
      ? difficulty
      : "Medium";

  const styles = config[normalizedDifficulty];

  return (
    <span
      style={{
        color: styles.color,
        backgroundColor: styles.background,
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {normalizedDifficulty}
    </span>
  );
}

function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const lineCount = Math.max(value.split("\n").length, 1);

  return (
    <div
      style={{
        background: "#1e1e2e",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Editor header */}
      <div
        style={{
          background: "#181825",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ff5f57",
          }}
        />

        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#febc2e",
          }}
        />

        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#28c840",
          }}
        />

        <span
          style={{
            marginLeft: 8,
            fontSize: "12px",
            color: "#7f849c",
            fontFamily: "var(--font-mono)",
          }}
        >
          solution.ts
        </span>
      </div>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          overflow: "auto",
          padding: "16px 0",
        }}
      >
        {/* Line numbers */}
        <div
          style={{
            width: 44,
            flexShrink: 0,
            color: "#4a4a5a",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            lineHeight: "20px",
            textAlign: "right",
            paddingRight: 16,
            userSelect: "none",
          }}
        >
          {Array.from({ length: lineCount }, (_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        {/* Actual editor */}
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          placeholder={`// Write your solution here...

class ParkingLot {
  // your design
}`}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            resize: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#cdd6f4",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            lineHeight: "20px",
            padding: 0,
            paddingRight: 16,
          }}
        />
      </div>
    </div>
  );
}

function SubmitModal({
  onClose,
  onConfirm,
  loading,
}: {
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          padding: "28px",
          width: 400,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: 8,
            color: "var(--color-text-primary)",
          }}
        >
          Submit your solution?
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            marginBottom: 16,
            lineHeight: "1.5",
          }}
        >
          Your current Code and Explanation will be submitted for evaluation.
        </p>

        <div
          style={{
            padding: "10px 12px",
            background: "var(--color-background)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            marginBottom: 20,
            fontSize: "13px",
            color: "var(--color-text-muted)",
          }}
        >
          Diagram: Upcoming feature
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--color-accent)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              fontFamily: "var(--font-sans)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Submitting..." : "Submit Solution"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const { slug, attemptId } = useParams<{
    slug: string;
    attemptId: string;
  }>();

  const navigate = useNavigate();

  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("code");

  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState("");

  const [explanation, setExplanation] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [saving, setSaving] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const problemQuery = useProblem(slug);

  const attemptQuery = useAttemptDetails(attemptId);

  /*
   * Load existing submission when the page opens.
   */
  useEffect(() => {
    const submission = attemptQuery.data?.submission;

    const attempt = attemptQuery.data?.attempt;

    if (submission) {
      setCode(submission.code ?? "");
      setExplanation(submission.explanation ?? "");

      setLastSavedAt(submission.createdAt);
    }

    if (
      attempt?.status === "SUBMITTED" ||
      attempt?.status === "EVALUATING" ||
      attempt?.status === "COMPLETED"
    ) {
      setSubmitted(true);
    }
  }, [attemptQuery.data]);

  /*
   * Loading
   */
  if (problemQuery.isLoading || attemptQuery.isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-background)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--color-text-muted)",
          }}
        >
          Loading workspace...
        </span>
      </div>
    );
  }

  /*
   * Error
   */
  if (
    problemQuery.isError ||
    attemptQuery.isError ||
    !problemQuery.data ||
    !attemptQuery.data ||
    !attemptId
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "var(--color-background)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--color-text-muted)",
          }}
        >
          Unable to load this attempt.
        </span>

        <button
          onClick={() => navigate(slug ? `/problems/${slug}` : "/")}
          style={{
            border: "none",
            background: "var(--color-accent)",
            color: "#fff",
            borderRadius: "var(--radius-md)",
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          ← Back to Problem
        </button>
      </div>
    );
  }

  const problem = problemQuery.data;

  /*
   * Save draft.
   */
  const handleSaveDraft = async () => {
    if (!attemptId || submitted) {
      return;
    }

    try {
      setSaving(true);

      const response = await saveSubmission(attemptId, {
        code,
        explanation,
        diagram: null,
      });

      setLastSavedAt(response.createdAt);
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setSaving(false);
    }
  };

  /*
   * Submit:
   *
   * 1. Save latest code/explanation
   * 2. Mark attempt submitted
   * 3. Start background evaluation
   * 4. Navigate to feedback
   */
  const handleSubmit = async () => {
    if (!attemptId || submitted) {
      return;
    }

    if (!code.trim() && !explanation.trim()) {
      window.alert("Please add some code or explanation before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      setShowModal(false);

      /*
       * 1. Save latest content.
       */
      await saveSubmission(attemptId, {
        code,
        explanation,
        diagram: null,
      });

      /*
       * 2. Mark attempt as submitted.
       */
      await submitAttempt(attemptId);

      setSubmitted(true);

      /*
       * 3. Start async evaluation.
       */
      await startEvaluation(attemptId);

      /*
       * 4. Go to feedback page.
       *
       * Evaluation runs in the backend.
       */
      navigate(`/attempts/${attemptId}/feedback`);
    } catch (error) {
      console.error("Failed to submit solution:", error);

      window.alert("Failed to submit solution. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const lastSavedText = lastSavedAt
    ? `Last saved: ${new Date(lastSavedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Not saved yet";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--color-background)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 52,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          paddingInline: 20,
          gap: 16,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate(slug ? `/problems/${slug}` : "/")}
          style={{
            fontSize: "13px",
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            whiteSpace: "nowrap",
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "var(--font-sans)",
          }}
        >
          <span style={{ fontSize: "15px" }}>←</span>
          Problems
        </button>

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--color-border)",
            flexShrink: 0,
          }}
        />

        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            whiteSpace: "nowrap",
          }}
        >
          {problem.title}
        </span>

        <div style={{ flex: 1 }} />

        <span
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            background: "var(--color-background)",
            padding: "3px 8px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
          }}
        >
          {submitted ? "Submitted" : "Draft"}
        </span>

        <span
          style={{
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          {lastSavedText}
        </span>
      </header>

      {/* Main workspace */}
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Left problem panel */}
        <div
          style={{
            width: panelCollapsed ? 36 : 316,
            flexShrink: 0,
            background: "var(--color-surface)",
            borderRight: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s ease",
            overflow: "hidden",
          }}
        >
          {panelCollapsed ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 12,
                gap: 8,
              }}
            >
              <button
                onClick={() => setPanelCollapsed(false)}
                title="Expand problem panel"
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)",
                  fontSize: "14px",
                }}
              >
                ›
              </button>

              <span
                style={{
                  writingMode: "vertical-rl",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.08em",
                  transform: "rotate(180deg)",
                  marginTop: 8,
                }}
              >
                PROBLEM
              </span>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.07em",
                  }}
                >
                  PROBLEM
                </span>

                <button
                  onClick={() => setPanelCollapsed(true)}
                  title="Collapse panel"
                  style={{
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  ‹
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px 18px",
                }}
              >
                {/* Problem identity */}
                <div
                  style={{
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      marginBottom: 8,
                      lineHeight: "1.2",
                    }}
                  >
                    {problem.title}
                  </div>

                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>

                {/* Requirements */}
                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--color-accent-text)",
                      letterSpacing: "0.08em",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 3,
                        height: 12,
                        background: "var(--color-accent)",
                        borderRadius: 2,
                      }}
                    />
                    REQUIREMENTS
                  </div>

                  <ol
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {problem.requirements.map((requirement, index) => (
                      <li
                        key={`${requirement}-${index}`}
                        style={{
                          display: "flex",
                          gap: 10,
                          fontSize: "13px",
                          color: "var(--color-text-secondary)",
                          lineHeight: "1.5",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--color-accent)",
                            flexShrink: 0,
                            paddingTop: 2,
                            fontWeight: 500,
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Constraints */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.08em",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 3,
                        height: 12,
                        background: "var(--color-border-strong)",
                        borderRadius: 2,
                      }}
                    />
                    CONSTRAINTS & ASSUMPTIONS
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {problem.constraints.map((constraint, index) => (
                      <li
                        key={`${constraint}-${index}`}
                        style={{
                          display: "flex",
                          gap: 10,
                          fontSize: "13px",
                          color: "var(--color-text-secondary)",
                          lineHeight: "1.5",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-border-strong)",
                            flexShrink: 0,
                            paddingTop: 1,
                            fontSize: "15px",
                            lineHeight: "1.2",
                          }}
                        >
                          ·
                        </span>

                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center workspace */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            padding: 16,
            gap: 12,
            overflow: "hidden",
          }}
        >
          {/* Workspace heading + tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Your Solution
            </span>

            <div
              style={{
                display: "flex",
                background: "var(--color-background)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
              }}
            >
              {(["code", "explanation", "diagram"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "5px 14px",
                    fontSize: "13px",
                    fontWeight: activeTab === tab ? 600 : 400,
                    background:
                      activeTab === tab
                        ? "var(--color-surface)"
                        : "transparent",
                    color:
                      activeTab === tab
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    borderRight:
                      tab !== "diagram"
                        ? "1px solid var(--color-border)"
                        : "none",
                    textTransform: "capitalize",
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Code */}
            {activeTab === "code" && (
              <CodeEditor value={code} onChange={setCode} />
            )}

            {/* Explanation */}
            {activeTab === "explanation" && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 0,
                }}
              >
                <textarea
                  value={explanation}
                  onChange={(event) => setExplanation(event.target.value)}
                  placeholder="Explain your design decisions..."
                  disabled={submitted}
                  style={{
                    flex: 1,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "14px 16px",
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-sans)",
                    lineHeight: "1.6",
                    resize: "none",
                    outline: "none",
                    opacity: submitted ? 0.7 : 1,
                  }}
                />

                <div
                  style={{
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "12px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--color-text-muted)",
                      marginBottom: 6,
                    }}
                  >
                    Guiding questions
                  </p>

                  <ul
                    style={{
                      margin: 0,
                      padding: "0 0 0 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    {[
                      "Why did you choose these classes?",
                      "What responsibilities does each class own?",
                      "What can change easily in your design?",
                      "What trade-offs did you make?",
                    ].map((question, index) => (
                      <li
                        key={index}
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          lineHeight: "1.5",
                        }}
                      >
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Diagram */}
            {activeTab === "diagram" && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: 32,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: 8,
                    }}
                  >
                    Diagram Support
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Coming soon as an upcoming feature.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              paddingTop: 12,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
              }}
            >
              {saving ? "Saving..." : lastSavedAt ? "Saved" : "Not saved yet"}
            </span>

            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              {/* Save Draft */}
              <button
                onClick={handleSaveDraft}
                disabled={saving || submitting || submitted}
                style={{
                  padding: "7px 16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  cursor:
                    saving || submitting || submitted ? "default" : "pointer",
                  fontFamily: "var(--font-sans)",
                  opacity: submitted ? 0.5 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>

              {/* Submit */}
              <button
                onClick={() => !submitted && setShowModal(true)}
                disabled={submitted || saving || submitting}
                style={{
                  padding: "7px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: submitted ? "#e5e7eb" : "var(--color-accent)",
                  color: submitted ? "var(--color-text-muted)" : "#fff",
                  cursor:
                    submitted || saving || submitting ? "default" : "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {submitted ? "Submitted" : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit modal */}
      {showModal && (
        <SubmitModal
          onClose={() => !submitting && setShowModal(false)}
          onConfirm={handleSubmit}
          loading={submitting}
        />
      )}
    </div>
  );
}
