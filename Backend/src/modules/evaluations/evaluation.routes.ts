import { Router } from "express";
import {
  createEvaluation,
  getEvaluation,
  runEvaluation,
} from "./evaluation.service";

const evaluationRouter = Router();

evaluationRouter.post(
  "/attempts/:attemptId/evaluation",
  async (req, res) => {
    try {
      const evaluation = await createEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      res.status(201).json(evaluation);
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

evaluationRouter.post(
  "/attempts/:attemptId/evaluation/run",
  async (req, res) => {
    try {
      const evaluation = await runEvaluation(
        req.sessionId,
        req.params.attemptId,
      );

      res.json(evaluation);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Evaluation failed";

      res.status(400).json({ message });
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