import { useQuery } from "@tanstack/react-query";
import { getProblemAttempts } from "../api/attempts.api";

export function useAttempts(problemId: string | undefined) {
  return useQuery({
    queryKey: ["attempts", problemId],
    queryFn: () => getProblemAttempts(problemId!),
    enabled: Boolean(problemId),
  });
}