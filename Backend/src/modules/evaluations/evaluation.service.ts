import { db } from "../../prisma/db";
import { MockEvaluator } from "./mock.evaluator";

const evaluator = new MockEvaluator();

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

  const evaluation =
    await db.orm.public.Evaluation.create({
      submissionId: submission.id,
      evaluatorType: "AI",
      status: "PENDING",
    });

  await db.orm.public.Attempt
    .where({
      id: attemptId,
    })
    .update({
      status: "EVALUATING",
    });

  return evaluation;
}

export async function runEvaluation(
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

  if (attempt.status !== "EVALUATING") {
    throw new Error("Attempt is not being evaluated");
  }

  const submission =
    await db.orm.public.Submission.first({
      attemptId,
    });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const problem =
    await db.orm.public.Problem.first({
      id: attempt.problemId,
    });

  if (!problem) {
    throw new Error("Problem not found");
  }

  try {
    const result = await evaluator.evaluate({
      problem: {
        title: problem.title,
        description: problem.description,
        requirements: problem.requirements,
        constraints: problem.constraints,
        rubric: problem.rubric,
      },
      submission: {
        code: submission.code,
        explanation: submission.explanation,
        diagram: submission.diagram,
      },
    });

    const evaluation =
      await db.orm.public.Evaluation.first({
        submissionId: submission.id,
      });

    if (!evaluation) {
      throw new Error("Evaluation not found");
    }

    const updatedEvaluation =
      await db.orm.public.Evaluation
        .where({
          id: evaluation.id,
        })
        .update({
          status: "COMPLETED",
          overallScore: result.overallScore,
          result,
          completedAt: Temporal.Now.instant(),
        });

    await db.orm.public.Attempt
      .where({
        id: attemptId,
      })
      .update({
        status: "COMPLETED",
      });

    return updatedEvaluation;
  } catch (error) {
    const evaluation =
      await db.orm.public.Evaluation.first({
        submissionId: submission.id,
      });

    if (evaluation) {
      await db.orm.public.Evaluation
        .where({
          id: evaluation.id,
        })
        .update({
          status: "FAILED",
          errorMessage:
            error instanceof Error
              ? error.message
              : "Evaluation failed",
        });
    }

    await db.orm.public.Attempt
      .where({
        id: attemptId,
      })
      .update({
        status: "FAILED",
      });

    throw error;
  }
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

  const submission =
    await db.orm.public.Submission.first({
      attemptId,
    });

  if (!submission) {
    throw new Error("Submission not found");
  }

  return db.orm.public.Evaluation.first({
    submissionId: submission.id,
  });
}