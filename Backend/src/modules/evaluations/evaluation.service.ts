import { db } from "../../prisma/db";

export async function createEvaluation(
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

  if (attempt.status !== "SUBMITTED") {
    throw new Error("Attempt is not ready for evaluation");
  }

  const submission = await db.orm.public.Submission.first({
    attemptId,
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const existingEvaluation =
    await db.orm.public.Evaluation.first({
      submissionId: submission.id,
    });

  if (existingEvaluation) {
    return existingEvaluation;
  }

  return db.orm.public.Evaluation.create({
    submissionId: submission.id,
    evaluatorType: "AI",
    status: "PENDING",
  });
}

export async function getEvaluation(
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

  const submission = await db.orm.public.Submission.first({
    attemptId,
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  return db.orm.public.Evaluation.first({
    submissionId: submission.id,
  });
}