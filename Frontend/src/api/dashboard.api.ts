import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

export type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type DashboardProblem = {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  attempts: number;
  bestScore: number | null;
};

export type RecentActivity = {
  problem: string;
  attempt: number;
  score: number;
  when: string;
};

type DashboardResponse = {
  success: boolean;
  data: {
    problems: DashboardProblem[];
    recentActivity: RecentActivity[];
  };
};

export async function getDashboard() {
  const response =
    await axios.get<DashboardResponse>(
      `${API_URL}/dashboard`,
      {
        withCredentials: true,
      },
    );

  return response.data.data;
}