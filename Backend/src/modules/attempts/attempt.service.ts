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
    .select("id", "problemId", "status", "createdAt")
    .where({
      sessionId,
      problemId,
    })
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