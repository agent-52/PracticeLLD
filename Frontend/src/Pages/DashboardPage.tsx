import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import ScoreBar from "../components/dashboard/ScoreBar";
import ProblemCard from "../components/dashboard/ProblemCard";

type Difficulty = "Easy" | "Medium" | "Hard";

// interface Problem {
//   id: string;
//   title: string;
//   difficulty: Difficulty | string;
//   description: string;
//   attempts: number;
//   bestScore: number | null;
// }

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | Difficulty>(
    "All",
  );
  const { data, isLoading, isError } = useDashboard();

  const problems = data?.problems ?? [];
  const recentActivity = data?.recentActivity ?? [];

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff =
      difficultyFilter === "All" ||
      p.difficulty.toString().toLowerCase() === difficultyFilter.toLowerCase();
    return matchSearch && matchDiff;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <p className="font-mono text-[13px] text-[var(--color-text-muted)]">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <p className="font-mono text-[13px] text-[var(--color-text-muted)]">
          Failed to load dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Nav */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="w-full px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--color-accent)] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2" width="4" height="4" rx="0.5" fill="white" />
                <rect
                  x="8"
                  y="2"
                  width="4"
                  height="4"
                  rx="0.5"
                  fill="white"
                  opacity="0.6"
                />
                <rect
                  x="2"
                  y="8"
                  width="4"
                  height="4"
                  rx="0.5"
                  fill="white"
                  opacity="0.6"
                />
                <rect x="8" y="8" width="4" height="4" rx="0.5" fill="white" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-[var(--color-text-primary)] tracking-tight">
              LLD Practice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-easy)] inline-block" />
            <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
              Session active
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full px-10 py-12">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-[26px] font-semibold text-[var(--color-text-primary)] tracking-tight mb-1.5">
            Practice Low-Level Design
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)]">
            Design, submit, get feedback, and improve.
          </p>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
            Practice real-world LLD problems with structured, explainable
            feedback.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-[340px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13.5px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-colors"
            />
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value as typeof difficultyFilter)
            }
            className="px-3 py-2 text-[13.5px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-colors cursor-pointer appearance-none pr-8 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239b9b96' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="All">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Problem grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-5 mb-14">
            {filtered.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 mb-14 border border-dashed border-[var(--color-border-strong)] rounded-[var(--radius-lg)]">
            <p className="font-mono text-[13px] text-[var(--color-text-muted)]">
              No problems match your filters.
            </p>
          </div>
        )}

        {/* Recent activity */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)] uppercase tracking-widest">
              Recent Activity
            </h2>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
                  <th className="text-left px-5 py-3 font-mono text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="text-left px-5 py-3 font-mono text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Attempt
                  </th>
                  <th className="text-left px-5 py-3 font-mono text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-5 py-3 font-mono text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-b-0 border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13.5px] font-medium text-[var(--color-text-primary)]">
                        {item.problem}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[12px] text-[var(--color-text-secondary)]">
                        #{item.attempt}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <ScoreBar score={item.score} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
                        {item.when}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
