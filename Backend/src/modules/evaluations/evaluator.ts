export type RubricEvaluation = {
  criterion: string;
  score: number;
  max: number;
  evidence: string | null;
  concern: string | null;
  suggestion: string | null;
  confidence: "High" | "Medium" | "Low";
};

export type EvaluationResult = {
  overallScore: number;

  summary: string;

  rubric: RubricEvaluation[];

  // Keep these for compatibility / simpler consumers.
  strengths: string[];
  concerns: string[];
  suggestions: string[];

  // Keep the existing structure too.
  criteria: {
    design: number;
    codeQuality: number;
    extensibility: number;
    explanation: number;
  };
};

export type EvaluationInput = {
  problem: {
    title: string;
    description: string;
    requirements: unknown;
    constraints: unknown;
    rubric: unknown;
  };

  submission: {
    code: string | null;
    explanation: string | null;
    diagram: string | null;
  };
};

export interface Evaluator {
  evaluate(
    input: EvaluationInput,
  ): Promise<EvaluationResult>;
}