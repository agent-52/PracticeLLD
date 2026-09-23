import { Router } from "express";
import {
  getSubmission,
  saveSubmission,
} from "./submission.service";

const submissionRouter = Router();

submissionRouter.put(
  "/attempts/:attemptId/submission",
  async (req, res) => {
    try {
      const submission = await saveSubmission(
        req.sessionId,
        req.params.attemptId,
        {
          code: req.body.code,
          explanation: req.body.explanation,
          diagram: req.body.diagram,
        },
      );

      res.json(submission);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save submission";

      const status = message === "Attempt not found" ? 404 : 400;

      res.status(status).json({ message });
    }
  },
);

submissionRouter.get(
  "/attempts/:attemptId/submission",
  async (req, res) => {
    try {
      const submission = await getSubmission(
        req.sessionId,
        req.params.attemptId,
      );

      if (!submission) {
        res.status(404).json({
          message: "Submission not found",
        });
        return;
      }

      res.json(submission);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch submission";

      res.status(404).json({ message });
    }
  },
);

export default submissionRouter;