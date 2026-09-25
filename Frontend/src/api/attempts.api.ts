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
  success?: boolean;
  data?: T;
};

/**
 * Normalizes an attempt returned by the backend.
 *
 * Supports both:
 *   { success: true, data: attempt }
 *
 * and:
 *   attempt
 */
function normalizeAttempt(raw: unknown): Attempt {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !("id" in raw)
  ) {
    throw new Error("Invalid attempt response from backend");
  }

  const value = raw as Record<string, unknown>;

  return {
    id: String(value.id),
    problemId: String(value.problemId),
    status: String(value.status ?? "DRAFT"),
    createdAt: String(value.createdAt),
    score:
      typeof value.score === "number"
        ? value.score
        : value.score === null
          ? null
          : null,
    number:
      typeof value.number === "number"
        ? value.number
        : 1,
  };
}

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

  if (body?.success === true && body?.data) {
    return normalizeAttempt(body.data);
  }

  if (body?.id) {
    return normalizeAttempt(body);
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
  const response = await axios.get(
    `${API_URL}/problems/${problemId}/attempts`,
    {
      withCredentials: true,
    },
  );

  console.log(
    "PROBLEM ATTEMPTS RESPONSE:",
    response.data,
  );

  const body = response.data;

  let rawAttempts: unknown;

  // Wrapped:
  // { success: true, data: [...] }
  if (body?.success === true && Array.isArray(body.data)) {
    rawAttempts = body.data;
  }
  // Direct:
  // [...]
  else if (Array.isArray(body)) {
    rawAttempts = body;
  }
  // Sometimes backend may return:
  // { data: [...] }
  else if (Array.isArray(body?.data)) {
    rawAttempts = body.data;
  }
  else {
    console.error(
      "Unexpected attempts response:",
      body,
    );

    throw new Error(
      "Backend returned an invalid attempts response",
    );
  }

  return (rawAttempts as unknown[]).map(normalizeAttempt);
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

  console.log(
    "ATTEMPT DETAILS RESPONSE:",
    response.data,
  );

  const body = response.data;

  // Direct:
  // { attempt, submission, evaluation }
  if (body?.attempt) {
    return body as AttemptDetails;
  }

  // Wrapped:
  // { success: true, data: { attempt, ... } }
  if (
    body?.success === true &&
    body?.data?.attempt
  ) {
    return body.data as AttemptDetails;
  }

  console.error(
    "Unexpected attempt details response:",
    body,
  );

  throw new Error(
    "Backend returned an invalid attempt response",
  );
}