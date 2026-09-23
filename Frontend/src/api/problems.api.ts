import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type Problem = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  requirements: unknown;
  constraints: unknown;
  rubric: unknown;
  createdAt: string;
};

type ProblemsResponse = {
  success: boolean;
  data: Problem[];
};

type ProblemResponse = {
  success: boolean;
  data: Problem;
};

export async function getProblems(): Promise<Problem[]> {
  const response = await axios.get<ProblemsResponse>(
    `${API_URL}/problems`,
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}

export async function getProblem(
  slug: string,
): Promise<Problem> {
  const response = await axios.get<ProblemResponse>(
    `${API_URL}/problems/${slug}`,
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}