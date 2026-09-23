import { Router } from "express";
import {
  createEvaluation,
  getEvaluation,
  runEvaluation,
} from "./evaluation.service";
import { startEvaluation } from "./evaluation.worker";

const evaluationRouter = Router();

evaluationRouter.post(
  "/attempts/:attemptId/evaluation",
  async (req, res) => {
    try {
      const evaluation = await createEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      startEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      res.status(202).json(evaluation);
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

      res.status(status).json({ message });
    }
  },
);

evaluationRouter.get(
  "/attempts/:attemptId/evaluation",
  async (req, res) => {
    try {
      const evaluation = await getEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      if (!evaluation) {
        res.status(404).json({
          message: "Evaluation not found",
        });
        return;
      }

      res.json(evaluation);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch evaluation";

      res.status(404).json({ message });
    }
  },
);


export default evaluationRouter;