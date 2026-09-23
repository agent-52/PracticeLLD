import type {
  Evaluator,
  EvaluationInput,
  EvaluationResult,
} from "./evaluator";

export class MockEvaluator implements Evaluator {
  async evaluate(
    input: EvaluationInput,
  ): Promise<EvaluationResult> {
    const hasCode = Boolean(input.submission.code?.trim());
    const hasExplanation = Boolean(
      input.submission.explanation?.trim(),
    );

    const design = hasCode ? 7 : 3;
    const codeQuality = hasCode ? 7 : 3;
    const extensibility = hasCode ? 6 : 3;
    const explanation = hasExplanation ? 7 : 3;

    const overallScore = Math.round(
      (design +
        codeQuality +
        extensibility +
        explanation) /
        4,
    );

    return {
      overallScore,
      criteria: {
        design,
        codeQuality,
        extensibility,
        explanation,
      },
      strengths: hasCode
        ? ["A code submission was provided."]
        : [],
      concerns: hasExplanation
        ? []
        : ["The explanation is missing."],
      suggestions: [
        "Consider improving separation of responsibilities.",
      ],
    };
  }
}