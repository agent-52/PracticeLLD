import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type SaveSubmissionInput = {
  code: string;
  explanation: string;
  diagram: string | null;
};

export type Submission = {
  id: string;
  attemptId: string;
  code: string | null;
  explanation: string | null;
  diagram: string | null;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function saveSubmission(
  attemptId: string,
  input: SaveSubmissionInput,
): Promise<Submission> {
  const response = await axios.put<ApiResponse<Submission>>(
    `${API_URL}/attempts/${attemptId}/submission`,
    input,
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}