import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type SubmitAttemptResponse = {
  id: string;
  problemId: string;
  status: string;
  createdAt: string;
};

export async function submitAttempt(
  attemptId: string,
): Promise<SubmitAttemptResponse> {
  const response = await axios.post<
    ApiResponse<SubmitAttemptResponse>
  >(
    `${API_URL}/attempts/${attemptId}/submit`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}