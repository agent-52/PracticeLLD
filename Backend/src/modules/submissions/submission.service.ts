import { db } from "../../prisma/db.js";

type SubmissionInput = {
  code?: string;
  explanation?: string;
  diagram?: string;
};

export async function saveSubmission(
  sessionId: string,
  attemptId: string,
  input: SubmissionInput,
) {
  const attempt = await db.orm.public.Attempt.first({
    id: attemptId,
    sessionId,
  });

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  if (attempt.status !== "DRAFT") {
    throw new Error("Attempt cannot be edited");
  }

  const existingSubmission =
    await db.orm.public.Submission.first({
      attemptId,
    });

  const data = {
    code: input.code ?? null,
    explanation: input.explanation ?? null,
    diagram: input.diagram ?? null,
  };

  if (existingSubmission) {
    return db.orm.public.Submission
      .where({ id: existingSubmission.id })
      .update(data);
  }

  return db.orm.public.Submission.create({
    attemptId,
    ...data,
  });
}

export async function getSubmission(
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

  return db.orm.public.Submission.first({
    attemptId,
  });
}