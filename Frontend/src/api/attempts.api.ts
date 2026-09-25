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

export type Submission = {
  id: string;
  attemptId: string;
  code: string | null;
  explanation: string | null;
  diagram: string | null;
  createdAt: string;
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

export type AttemptDetails = {
  attempt: {
    id: string;
    sessionId: string;
    problemId: string;
    status: string;
    createdAt: string;
  };
  submission: Submission | null;
  evaluation: Evaluation | null;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};


export async function createAttempt(
  problemId: string,
): Promise<Attempt> {
  const response = await axios.post(
    `${API_URL}/problems/${problemId}/attempts`,
    {},
    {
      withCredentials: true,
    },
  );

  console.log(
    "CREATE ATTEMPT RESPONSE:",
    response.data,
  );

  const body = response.data;

  
  if (
    body?.success === true &&
    body?.data?.id
  ) {
    return body.data;
  }

  
  if (body?.id) {
    return body;
  }

 
  console.error(
    "Unexpected create attempt response:",
    body,
  );

  throw new Error(
    "Backend returned an invalid attempt response",
  );
}

export async function getProblemAttempts(
  problemId: string,
): Promise<Attempt[]> {
  const response = await axios.get<
    ApiResponse<Attempt[]>
  >(
    `${API_URL}/problems/${problemId}/attempts`,
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}


export async function getAttemptDetails(
  attemptId: string,
): Promise<AttemptDetails> {
  const response = await axios.get(
    `${API_URL}/attempts/${attemptId}/details`,
    {
      withCredentials: true,
    },
  );

  console.log("ATTEMPT DETAILS RESPONSE:", response.data);

  const body = response.data;

  // Backend currently returns the object directly
  if (body?.attempt) {
    return body as AttemptDetails;
  }

  // Also support wrapped response
  if (body?.success === true && body?.data?.attempt) {
    return body.data as AttemptDetails;
  }

  console.error("Unexpected attempt details response:", body);

  throw new Error("Backend returned an invalid attempt response");
}