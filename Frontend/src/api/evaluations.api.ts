import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

export type EvaluationStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export type RubricEvaluation = {
  criterion: string;
  score: number;
  max: number;
  evidence: string | null;
  concern: string | null;
  suggestion: string | null;
  confidence:
    | "High"
    | "Medium"
    | "Low";
};

export type EvaluationResult = {
  overallScore: number;
  summary: string;
  rubric: RubricEvaluation[];
  strengths: string[];
  concerns: string[];
  suggestions: string[];
  criteria: {
    design: number;
    codeQuality: number;
    extensibility: number;
    explanation: number;
  };
};

export type Evaluation = {
  id: string;
  submissionId: string;
  evaluatorType: string;
  status: EvaluationStatus;
  overallScore: number | null;
  result: EvaluationResult | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
};

export async function startEvaluation(
  attemptId: string,
): Promise<Evaluation> {
  const response =
    await axios.post<Evaluation>(
      `${API_URL}/attempts/${attemptId}/evaluation`,
      {},
      {
        withCredentials: true,
      },
    );

  return response.data;
}

export async function getEvaluation(
  attemptId: string,
): Promise<Evaluation> {
  const response = await axios.get<Evaluation>(
    `${API_URL}/attempts/${attemptId}/evaluation`,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function retryEvaluation(
  attemptId: string,
): Promise<void> {
  await axios.post(
    `${API_URL}/attempts/${attemptId}/evaluation/retry`,
    {},
    {
      withCredentials: true,
    },
  );
}