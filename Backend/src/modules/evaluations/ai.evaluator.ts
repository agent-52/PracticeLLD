import type {
  Evaluator,
  EvaluationInput,
  EvaluationResult,
} from "./evaluator";

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function extractJson(
  content: string,
): string {
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error(
      "AI returned invalid JSON",
    );
  }

  return cleaned.slice(start, end + 1);
}

function validateResult(
  value: unknown,
): EvaluationResult {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error(
      "AI returned an invalid evaluation",
    );
  }

  const data =
    value as Record<string, unknown>;

  if (
    typeof data.overallScore !== "number" ||
    !Array.isArray(data.rubric)
  ) {
    throw new Error(
      "AI evaluation is missing required fields",
    );
  }

  return {
    overallScore: Math.max(
      0,
      Math.min(
        100,
        Math.round(data.overallScore),
      ),
    ),

    summary:
      typeof data.summary === "string"
        ? data.summary
        : "",

    rubric: data.rubric.map((item) => {
      const row =
        item as Record<string, unknown>;

      return {
        criterion: String(
          row.criterion ?? "Criterion",
        ),

        score: Number(row.score ?? 0),

        max: Number(row.max ?? 10),

        evidence:
          typeof row.evidence === "string"
            ? row.evidence
            : null,

        concern:
          typeof row.concern === "string"
            ? row.concern
            : null,

        suggestion:
          typeof row.suggestion === "string"
            ? row.suggestion
            : null,

        confidence:
          row.confidence === "High" ||
          row.confidence === "Medium" ||
          row.confidence === "Low"
            ? row.confidence
            : "Medium",
      };
    }),

    strengths: Array.isArray(data.strengths)
      ? data.strengths.map(String)
      : [],

    concerns: Array.isArray(data.concerns)
      ? data.concerns.map(String)
      : [],

    suggestions: Array.isArray(
      data.suggestions,
    )
      ? data.suggestions.map(String)
      : [],

    criteria: {
      design: Number(
        (
          data.criteria as Record<
            string,
            unknown
          >
        )?.design ?? 0,
      ),

      codeQuality: Number(
        (
          data.criteria as Record<
            string,
            unknown
          >
        )?.codeQuality ?? 0,
      ),

      extensibility: Number(
        (
          data.criteria as Record<
            string,
            unknown
          >
        )?.extensibility ?? 0,
      ),

      explanation: Number(
        (
          data.criteria as Record<
            string,
            unknown
          >
        )?.explanation ?? 0,
      ),
    },
  };
}

export class AiEvaluator implements Evaluator {
  async evaluate(
    input: EvaluationInput,
  ): Promise<EvaluationResult> {
    const apiKey =
      process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured",
      );
    }

    const model =
      process.env.GROQ_MODEL ??
      "llama-3.3-70b-versatile";

    const prompt = `
You are an expert software engineer evaluating
a Low-Level Design (LLD) practice submission.

Evaluate ONLY the submitted solution against
the provided problem.

PROBLEM:
${JSON.stringify(
  {
    title: input.problem.title,
    description: input.problem.description,
    requirements: input.problem.requirements,
    constraints: input.problem.constraints,
    rubric: input.problem.rubric,
  },
  null,
  2,
)}

SUBMISSION:
${JSON.stringify(
  {
    code: input.submission.code,
    explanation: input.submission.explanation,
    diagram: input.submission.diagram,
  },
  null,
  2,
)}

Evaluate:

1. Class responsibilities
2. Encapsulation
3. Coupling and cohesion
4. Abstraction and interfaces
5. Extensibility
6. Requirement understanding
7. Explanation quality

Use the supplied rubric when possible.

Return ONLY valid JSON.

Required format:

{
  "overallScore": 0,
  "summary": "short overall feedback",
  "rubric": [
    {
      "criterion": "Class Responsibilities",
      "score": 0,
      "max": 20,
      "evidence": "specific evidence from submission",
      "concern": "specific concern",
      "suggestion": "specific improvement",
      "confidence": "High"
    }
  ],
  "strengths": [],
  "concerns": [],
  "suggestions": [],
  "criteria": {
    "design": 0,
    "codeQuality": 0,
    "extensibility": 0,
    "explanation": 0
  }
}

Rules:
- Do not invent code that does not exist.
- Base evidence on the submitted code/explanation.
- Be specific.
- Scores must reflect the actual submission.
- overallScore must be between 0 and 100.
`;

    const response =
      await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${apiKey}`,
          },

          body: JSON.stringify({
            model,

            temperature: 0.2,

            messages: [
              {
                role: "system",
                content:
                  "You are a strict but constructive LLD evaluator. Return only JSON.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        },
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Groq API error ${response.status}: ${errorText}`,
      );
    }

    const data =
      (await response.json()) as GroqResponse;

    const content =
      data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "Groq returned an empty response",
      );
    }

    const json =
      extractJson(content);

    return validateResult(
      JSON.parse(json),
    );
  }
}