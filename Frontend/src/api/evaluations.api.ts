import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type Evaluation = {
  id: string;
  submissionId: string;
  evaluatorType: string;
  status: string;
  overallScore: number | null;
  result: unknown;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
};

export async function startEvaluation(
  attemptId: string,
): Promise<Evaluation> {
  const response = await axios.post<ApiResponse<Evaluation>>(
    `${API_URL}/attempts/${attemptId}/evaluation`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}