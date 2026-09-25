import { Router } from "express";

import {
  createEvaluation,
  getEvaluation,
  retryEvaluation,
} from "./evaluation.service";

import {
  startEvaluation,
} from "./evaluation.worker";

const evaluationRouter =
  Router();

evaluationRouter.post(
  "/attempts/:attemptId/evaluation",
  async (req, res) => {
    try {
      const evaluation =
        await createEvaluation(
          req.sessionId,
          req.params.attemptId,
        );

      startEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      return res.status(202).json(
        evaluation,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create evaluation";

      const status =
        message === "Attempt not found" ||
        message === "Submission not found"
          ? 404
          : 400;

      return res
        .status(status)
        .json({ message });
    }
  },
);

evaluationRouter.get(
  "/attempts/:attemptId/evaluation",
  async (req, res) => {
    try {
      const evaluation =
        await getEvaluation(
          req.sessionId,
          req.params.attemptId,
        );

      if (!evaluation) {
        return res.status(404).json({
          message: "Evaluation not found",
        });
      }

      return res.json(evaluation);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch evaluation";

      return res
        .status(404)
        .json({ message });
    }
  },
);

evaluationRouter.post(
  "/attempts/:attemptId/evaluation/retry",
  async (req, res) => {
    try {
      await retryEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      startEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      return res.status(202).json({
        message:
          "Evaluation retry started",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to retry evaluation";

      const status =
        message === "Attempt not found" ||
        message === "Submission not found" ||
        message === "Evaluation not found"
          ? 404
          : 400;

      return res
        .status(status)
        .json({ message });
    }
  },
);

export default evaluationRouter;