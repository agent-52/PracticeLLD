import {
  runEvaluation,
} from "./evaluation.service.js";

export function startEvaluation(
  sessionId: string,
  attemptId: string,
): void {
  void runEvaluation(sessionId, attemptId).catch(
    (error) => {
      console.error(
        "Evaluation failed:",
        error,
      );
    },
  );
}