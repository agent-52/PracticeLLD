import { useState } from "react";

type Screen = "dashboard" | "detail";

const CRITERIA = [
  { label: "Class Responsibilities", weight: 20 },
  { label: "Encapsulation", weight: 15 },
  { label: "Coupling & Cohesion", weight: 15 },
  { label: "Abstraction & Interfaces", weight: 15 },
  { label: "Extensibility", weight: 10 },
  { label: "Requirement Understanding", weight: 15 },
  { label: "Explanation Quality", weight: 10 },
];

const ATTEMPTS = [
  { num: 2, score: 78, date: "Today" },
  { num: 1, score: 61, date: "Yesterday" },
];

function Header({ screen, onBack }: { screen: Screen; onBack: () => void }) {
  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e4e4e1",
        height: 52,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              color: "#1a1a18",
              letterSpacing: "-0.01em",
            }}
          >
            LLD Practice
          </span>
          {screen === "detail" && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#6b6b67",
                padding: "4px 0",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 14 }}>←</span> Back to Problems
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#16a34a",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              color: "#9b9b96",
              fontWeight: 400,
            }}
          >
            Active
          </span>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ onSelect }: { onSelect: () => void }) {
  const problems = [
    {
      title: "Parking Lot",
      difficulty: "Medium",
      attempts: 2,
      lastScore: 78,
      tags: ["OOP", "Strategy Pattern"],
    },
    {
      title: "Library Management",
      difficulty: "Easy",
      attempts: 0,
      lastScore: null,
      tags: ["CRUD", "Relationships"],
    },
    {
      title: "Chess Game",
      difficulty: "Hard",
      attempts: 1,
      lastScore: 54,
      tags: ["State Machine", "Polymorphism"],
    },
    {
      title: "Elevator System",
      difficulty: "Medium",
      attempts: 0,
      lastScore: null,
      tags: ["Concurrency", "Scheduling"],
    },
  ];

  const difficultyStyle = (d: string) =>
    d === "Easy"
      ? { color: "#16a34a", background: "#f0fdf4" }
      : d === "Medium"
        ? { color: "#d97706", background: "#fffbeb" }
        : { color: "#dc2626", background: "#fef2f2" };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: "#1a1a18",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Problems
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#6b6b67",
            margin: "6px 0 0",
          }}
        >
          Practice low-level design problems to improve your system design
          skills.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 100px 80px 1fr 120px",
            padding: "8px 16px",
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: "#9b9b96",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>Problem</span>
          <span>Difficulty</span>
          <span>Attempts</span>
          <span>Tags</span>
          <span></span>
        </div>

        {problems.map((p, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e1",
              borderRadius: 8,
              display: "grid",
              gridTemplateColumns: "2fr 100px 80px 1fr 120px",
              padding: "14px 16px",
              alignItems: "center",
              cursor: "pointer",
              transition: "border-color 0.12s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#d0d0cc")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e4e4e1")
            }
            onClick={p.title === "Parking Lot" ? onSelect : undefined}
          >
            <div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1a1a18",
                }}
              >
                {p.title}
              </span>
              {p.lastScore !== null && (
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                    color: "#9b9b96",
                    marginLeft: 10,
                  }}
                >
                  Last: {p.lastScore}/100
                </span>
              )}
            </div>
            <div>
              <span
                style={{
                  ...difficultyStyle(p.difficulty),
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {p.difficulty}
              </span>
            </div>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 12,
                color: "#9b9b96",
              }}
            >
              {p.attempts}
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    color: "#6b6b67",
                    background: "#f7f7f6",
                    border: "1px solid #e4e4e1",
                    borderRadius: 4,
                    padding: "2px 7px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={p.title === "Parking Lot" ? onSelect : undefined}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#4f46e5",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                View →
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function ProblemDetail() {
  return (
    <main
      style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px" }}
    >
      {/* Problem heading */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#1a1a18",
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            Parking Lot
          </h1>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#d97706",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 4,
              padding: "2px 9px",
            }}
          >
            Medium
          </span>
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            color: "#6b6b67",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 680,
          }}
        >
          Design a parking lot that supports multiple vehicle types, parking
          spots, and flexible allocation strategies.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Requirements card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e1",
              borderRadius: 8,
              padding: "24px 28px",
            }}
          >
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a18",
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              Requirements
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                "The parking lot contains multiple floors.",
                "Different vehicle types may require different parking spots.",
                "Vehicles should be assigned to available spots.",
                "The parking allocation strategy should be replaceable.",
                "The design should allow the system to support new vehicle or parking spot types without major changes.",
              ].map((req, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#9b9b96",
                      minWidth: 20,
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      color: "#1a1a18",
                      lineHeight: 1.65,
                    }}
                  >
                    {req}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid #e4e4e1",
              }}
            >
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1a1a18",
                  margin: "0 0 12px",
                }}
              >
                Constraints & Assumptions
              </h3>
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 18px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#6b6b67",
                  lineHeight: 1.7,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {[
                  "One vehicle occupies one parking spot.",
                  "A parking spot can hold only one vehicle.",
                  "A vehicle must be assigned to a compatible spot.",
                  "Pricing is outside the scope of this MVP.",
                  "The learner may choose their own classes and design approach.",
                ].map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evaluation card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e1",
              borderRadius: 8,
              padding: "24px 28px",
            }}
          >
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a18",
                margin: "0 0 6px",
              }}
            >
              What will be evaluated
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#6b6b67",
                margin: "0 0 18px",
                lineHeight: 1.6,
              }}
            >
              There can be multiple valid designs. Feedback is based on design
              quality and evidence in your solution rather than a single
              reference implementation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CRITERIA.map((c) => (
                <div
                  key={c.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    background: "#f7f7f6",
                    border: "1px solid #e4e4e1",
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: "#1a1a18",
                      fontWeight: 400,
                    }}
                  >
                    {c.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      color: "#4f46e5",
                      fontWeight: 500,
                    }}
                  >
                    {c.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Start attempt */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e1",
              borderRadius: 8,
              padding: "20px",
            }}
          >
            <button
              style={{
                width: "100%",
                background: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "11px 20px",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#4338ca")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#4f46e5")
              }
            >
              Start New Attempt
            </button>
          </div>

          {/* Previous attempts */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e1",
              borderRadius: 8,
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a18",
                margin: "0 0 14px",
              }}
            >
              Previous Attempts
            </h2>

            {ATTEMPTS.length === 0 ? (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#9b9b96",
                  margin: 0,
                }}
              >
                No attempts yet. Start your first design.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ATTEMPTS.map((a) => (
                  <div
                    key={a.num}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 12px",
                      border: "1px solid #e4e4e1",
                      borderRadius: 6,
                      cursor: "pointer",
                      transition: "border-color 0.12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#d0d0cc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#e4e4e1")
                    }
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1a1a18",
                        }}
                      >
                        Attempt #{a.num}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 3,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: 12,
                            color: a.score >= 70 ? "#16a34a" : "#d97706",
                            fontWeight: 500,
                          }}
                        >
                          {a.score}/100
                        </span>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 11,
                            color: "#9b9b96",
                          }}
                        >
                          {a.date}
                        </span>
                      </div>
                    </div>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#4f46e5",
                        cursor: "pointer",
                        padding: 0,
                        whiteSpace: "nowrap",
                      }}
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
  );
}

export default function ProblemDetailPage() {
  const [screen, setScreen] = useState<Screen>("detail");

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f6" }}>
      <Header screen={screen} onBack={() => setScreen("dashboard")} />
      {screen === "dashboard" ? (
        <Dashboard onSelect={() => setScreen("detail")} />
      ) : (
        <ProblemDetail />
      )}
    </div>
  );
}
