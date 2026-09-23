export type EvaluationResult = {
  overallScore: number;
  criteria: {
    design: number;
    codeQuality: number;
    extensibility: number;
    explanation: number;
  };
  strengths: string[];
  concerns: string[];
  suggestions: string[];
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
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}