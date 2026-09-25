import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type Attempt = {
  id: string;
  problemId: string;
  status: string;
  createdAt: string;
  score: number | null;
  number: number;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getProblemAttempts(
  problemId: string,
): Promise<Attempt[]> {
  const response = await axios.get<ApiResponse<Attempt[]>>(
    `${API_URL}/problems/${problemId}/attempts`,
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}

export async function createAttempt(
  problemId: string,
): Promise<Attempt> {
  const response = await axios.post<ApiResponse<Attempt>>(
    `${API_URL}/problems/${problemId}/attempts`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}