import { db } from "../../prisma/db.js";

export async function createAttempt(
  sessionId: string,
  problemId: string,
) {

  console.log("CREATE ATTEMPT:", {
    sessionId,
    problemId,
  });

  const problem = await db.orm.public.Problem.first({
    id: problemId,
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  return db.orm.public.Attempt.create({
    sessionId,
    problemId,
    status: "DRAFT",
  });
}

export async function getAttempts(
  sessionId: string,
  problemId: string,
) {
  const attempts = await db.orm.public.Attempt
    .where({
      sessionId,
      problemId,
    })
    .select(
      "id",
      "problemId",
      "status",
      "createdAt",
    )
    .all();

  const result = [];

  for (const [index, attempt] of attempts.entries()) {
    const submission =
      await db.orm.public.Submission.first({
        attemptId: attempt.id,
      });

    let score: number | null = null;

    if (submission) {
      const evaluation =
        await db.orm.public.Evaluation.first({
          submissionId: submission.id,
        });

      if (
        evaluation?.status === "COMPLETED" &&
        evaluation.overallScore !== null
      ) {
        score = evaluation.overallScore;
      }
    }

    result.push({
      id: attempt.id,
      problemId: attempt.problemId,
      status: attempt.status,
      createdAt: attempt.createdAt,
      score,
      number: index + 1,
    });
  }

  return result;
}
export async function getAttempt(
  sessionId: string,
  attemptId: string,
) {
  return db.orm.public.Attempt.first({
    id: attemptId,
    sessionId,
  });
}

export async function submitAttempt(
  sessionId: string,
  attemptId: string,
) {
  const attempt = await db.orm.public.Attempt.first({
    id: attemptId,
    sessionId,
  });

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  if (attempt.status !== "DRAFT") {
    throw new Error("Attempt cannot be submitted");
  }

  const submission = await db.orm.public.Submission.first({
    attemptId,
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const hasContent =
    Boolean(submission.code?.trim()) ||
    Boolean(submission.explanation?.trim()) ||
    Boolean(submission.diagram?.trim());

  if (!hasContent) {
    throw new Error("Submission cannot be empty");
  }

  return db.orm.public.Attempt
    .where({
      id: attemptId,
    })
    .update({
      status: "SUBMITTED",
    });
}

export async function getAttemptDetails(
  sessionId: string,
  attemptId: string,
) {

  console.log("GET ATTEMPT DETAILS:", {
    sessionId,
    attemptId,
  });
  const attempt = await db.orm.public.Attempt.first({
    id: attemptId,
    sessionId,
  });

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  const submission =
    await db.orm.public.Submission.first({
      attemptId,
    });

  const evaluation = submission
    ? await db.orm.public.Evaluation.first({
        submissionId: submission.id,
      })
    : null;

  return {
    attempt,
    submission,
    evaluation,
  };
}