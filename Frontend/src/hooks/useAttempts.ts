import { useQuery } from "@tanstack/react-query";
import { getProblemAttempts } from "../api/attempts.api";

export function useAttempts(problemId: string) {
  return useQuery({
    queryKey: ["attempts", problemId],
    queryFn: () => getProblemAttempts(problemId),
    enabled: Boolean(problemId),
  });
}