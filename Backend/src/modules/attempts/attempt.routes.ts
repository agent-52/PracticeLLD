import { Router } from "express";
import {
  createAttempt,
  getAttempt,
  getAttempts,
  submitAttempt,
} from "./attempt.service";

const attemptRouter = Router();

attemptRouter.post(
  "/problems/:problemId/attempts",
  async (req, res) => {
    try {
      const attempt = await createAttempt(
        req.sessionId,
        req.params.problemId,
      );

      res.status(201).json(attempt);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create attempt";

      res.status(400).json({ message });
    }
  },
);

attemptRouter.get(
  "/problems/:problemId/attempts",
  async (req, res) => {
    try {
      const attempts = await getAttempts(
        req.sessionId,
        req.params.problemId,
      );

      res.json(attempts);
    } catch {
      res.status(500).json({
        message: "Failed to fetch attempts",
      });
    }
  },
);

attemptRouter.get(
  "/attempts/:attemptId",
  async (req, res) => {
    try {
      const attempt = await getAttempt(
        req.sessionId,
        req.params.attemptId,
      );

      if (!attempt) {
        res.status(404).json({
          message: "Attempt not found",
        });
        return;
      }

      res.json(attempt);
    } catch {
      res.status(500).json({
        message: "Failed to fetch attempt",
      });
    }
  },
);
attemptRouter.post(
  "/attempts/:attemptId/submit",
  async (req, res) => {
    try {
      const attempt = await submitAttempt(
        req.sessionId,
        req.params.attemptId,
      );

      res.json(attempt);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit attempt";

      const status =
        message === "Attempt not found"
          ? 404
          : 400;

      res.status(status).json({ message });
    }
  },
);

export default attemptRouter;