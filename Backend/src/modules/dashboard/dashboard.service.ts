import { db } from "../../prisma/db";

export async function getDashboard(sessionId: string) {
  const problems = await db.orm.public.Problem
    .orderBy((problem) => problem.createdAt.asc())
    .all();

  const problemStats = await Promise.all(
    problems.map(async (problem) => {
      const attempts = await db.orm.public.Attempt
        .where({
          sessionId,
          problemId: problem.id,
        })
        .all();

      let bestScore: number | null = null;

      for (const attempt of attempts) {
        const submission =
          await db.orm.public.Submission.first({
            attemptId: attempt.id,
          });

        if (!submission) {
          continue;
        }

        const evaluation =
          await db.orm.public.Evaluation.first({
            submissionId: submission.id,
          });

        if (
          evaluation?.status === "COMPLETED" &&
          evaluation.overallScore !== null
        ) {
          if (
            bestScore === null ||
            evaluation.overallScore > bestScore
          ) {
            bestScore = evaluation.overallScore;
          }
        }
      }

      return {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        attempts: attempts.length,
        bestScore,
      };
    }),
  );

  const allAttempts = await db.orm.public.Attempt
    .where({
      sessionId,
    })
    .orderBy((attempt) => attempt.createdAt.desc())
    .all();

  const attemptNumbers = new Map<string, number>();
  const recentActivity: Array<{
  attemptId: string;
  problem: string;
  attempt: number;
  score: number;
  when: string;
}> = [];

  for (const attempt of allAttempts) {
    const problem = problems.find(
      (item) => item.id === attempt.problemId,
    );

    if (!problem) {
      continue;
    }

    const currentNumber =
      (attemptNumbers.get(attempt.problemId) ?? 0) + 1;

    attemptNumbers.set(attempt.problemId, currentNumber);

    const submission =
      await db.orm.public.Submission.first({
        attemptId: attempt.id,
      });

    if (!submission) {
      continue;
    }

    const evaluation =
      await db.orm.public.Evaluation.first({
        submissionId: submission.id,
      });

    if (
      evaluation?.status !== "COMPLETED" ||
      evaluation.overallScore === null
    ) {
      continue;
    }

    recentActivity.push({
  attemptId: attempt.id,
  problem: problem.title,
  attempt: currentNumber,
  score: evaluation.overallScore,
  when: attempt.createdAt.toString(),
});

    if (recentActivity.length === 5) {
      break;
    }
  }

  return {
    problems: problemStats,
    recentActivity,
  };
}