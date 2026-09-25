import type {
  Evaluator,
  EvaluationInput,
  EvaluationResult,
  RubricEvaluation,
} from "./evaluator";

function parseRubric(
  rubric: unknown,
): Array<{
  criterion: string;
  max: number;
}> {
  if (typeof rubric === "string") {
    try {
      return parseRubric(JSON.parse(rubric));
    } catch {
      return [];
    }
  }

  if (Array.isArray(rubric)) {
    return rubric
      .map((item) => {
        if (
          typeof item !== "object" ||
          item === null
        ) {
          return null;
        }

        const data =
          item as Record<string, unknown>;

        const criterion =
          typeof data.criterion === "string"
            ? data.criterion
            : typeof data.label === "string"
              ? data.label
              : typeof data.name === "string"
                ? data.name
                : null;

        const rawMax =
          data.max ??
          data.maxScore ??
          data.weight ??
          10;

        const max =
          typeof rawMax === "number"
            ? rawMax
            : Number(rawMax);

        if (!criterion || !Number.isFinite(max)) {
          return null;
        }

        return {
          criterion,
          max,
        };
      })
      .filter(
        (
          item,
        ): item is {
          criterion: string;
          max: number;
        } => item !== null,
      );
  }

  if (
    typeof rubric === "object" &&
    rubric !== null
  ) {
    const data =
      rubric as Record<string, unknown>;

    if ("criteria" in data) {
      return parseRubric(data.criteria);
    }

    return Object.entries(data)
      .map(([criterion, value]) => {
        if (typeof value === "number") {
          return {
            criterion,
            max: value,
          };
        }

        return {
          criterion,
          max: 10,
        };
      });
  }

  return [];
}

export class MockEvaluator implements Evaluator {
  async evaluate(
    input: EvaluationInput,
  ): Promise<EvaluationResult> {
    const hasCode = Boolean(
      input.submission.code?.trim(),
    );

    const hasExplanation = Boolean(
      input.submission.explanation?.trim(),
    );

    const rubricDefinition = parseRubric(
      input.problem.rubric,
    );

    const fallbackRubric = [
      {
        criterion: "Design Quality",
        max: 25,
      },
      {
        criterion: "Code Quality",
        max: 25,
      },
      {
        criterion: "Extensibility",
        max: 25,
      },
      {
        criterion: "Explanation Quality",
        max: 25,
      },
    ];

    const criteria =
      rubricDefinition.length > 0
        ? rubricDefinition
        : fallbackRubric;

    const rubric: RubricEvaluation[] =
      criteria.map((item, index) => {
        const percentage =
          !hasCode
            ? 0.35
            : !hasExplanation
              ? index ===
                criteria.length - 1
                ? 0.35
                : 0.7
              : 0.78;

        const score = Math.round(
          item.max * percentage,
        );

        return {
          criterion: item.criterion,
          score,
          max: item.max,

          evidence: hasCode
            ? "A code submission was provided for evaluation."
            : null,

          concern: !hasCode
            ? "No code was provided."
            : !hasExplanation
              ? "The explanation is missing."
              : null,

          suggestion:
            index === 0
              ? "Keep responsibilities focused and avoid placing unrelated decisions inside one class."
              : "Consider how the design can evolve when new requirements are introduced.",

          confidence: hasCode
            ? "Medium"
            : "Low",
        };
      });

    const totalScore = rubric.reduce(
      (sum, item) => sum + item.score,
      0,
    );

    const totalMax = rubric.reduce(
      (sum, item) => sum + item.max,
      0,
    );

    const overallScore =
      totalMax > 0
        ? Math.round(
            (totalScore / totalMax) * 100,
          )
        : 0;

    const strengths: string[] = [];

    if (hasCode) {
      strengths.push(
        "A code submission was provided.",
      );
    }

    if (hasExplanation) {
      strengths.push(
        "The solution includes an explanation.",
      );
    }

    const concerns: string[] = [];

    if (!hasCode) {
      concerns.push(
        "The submission does not contain code.",
      );
    }

    if (!hasExplanation) {
      concerns.push(
        "The explanation is missing.",
      );
    }

    const suggestions = [
      "Consider improving separation of responsibilities.",
      "Think about how the design can accommodate future requirements.",
    ];

    return {
      overallScore,

      summary:
        overallScore >= 70
          ? "The submission covers the core requirements, with opportunities to improve design clarity and extensibility."
          : "The submission needs additional work to cover the core requirements and communicate the design clearly.",

      rubric,

      strengths,

      concerns,

      suggestions,

      criteria: {
        design:
          overallScore >= 70 ? 7 : 4,
        codeQuality:
          hasCode ? 7 : 3,
        extensibility:
          overallScore >= 70 ? 6 : 3,
        explanation:
          hasExplanation ? 7 : 3,
      },
    };
  }
}