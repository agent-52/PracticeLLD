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
  success?: boolean;
  data?: T;
};

function normalizeSubmission(body: unknown): Submission {
  // Case 1:
  // { success: true, data: { ...submission } }
  if (
    typeof body === "object" &&
    body !== null &&
    "data" in body
  ) {
    const data = (body as ApiResponse<unknown>).data;

    if (
      typeof data === "object" &&
      data !== null &&
      "id" in data
    ) {
      return data as Submission;
    }
  }

  // Case 2:
  // { ...submission }
  if (
    typeof body === "object" &&
    body !== null &&
    "id" in body
  ) {
    return body as Submission;
  }

  throw new Error("Invalid submission response from backend");
}

export async function saveSubmission(
  attemptId: string,
  input: SaveSubmissionInput,
): Promise<Submission> {
  const response = await axios.put(
    `${API_URL}/attempts/${attemptId}/submission`,
    input,
    {
      withCredentials: true,
    },
  );

  console.log("SAVE SUBMISSION RESPONSE:", response.data);

  return normalizeSubmission(response.data);
}