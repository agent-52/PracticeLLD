import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type Attempt = {
  id: string;
  sessionId: string;
  problemId: string;
  status: string;
  createdAt: string;
};

type AttemptResponse = {
  success: boolean;
  data: Attempt;
};

export async function createAttempt(
  problemId: string,
): Promise<Attempt> {
  const response = await axios.post<AttemptResponse>(
    `${API_URL}/problems/${problemId}/attempts`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}