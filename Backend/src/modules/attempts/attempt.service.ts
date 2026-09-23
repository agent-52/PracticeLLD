import { db } from "../../prisma/db";

export async function createAttempt(
  sessionId: string,
  problemId: string,
) {
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
  return db.orm.public.Attempt
    .where({
      sessionId,
      problemId,
    })
    .select("id", "problemId", "status", "createdAt")
    .orderBy((attempt) => attempt.createdAt.desc())
    .all();
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