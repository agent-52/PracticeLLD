import { useQuery } from "@tanstack/react-query";
import { getEvaluation } from "../api/evaluations.api";

export function useEvaluation(
  attemptId: string | undefined,
) {
  return useQuery({
    queryKey: ["evaluation", attemptId],
    queryFn: () => getEvaluation(attemptId!),
    enabled: Boolean(attemptId),
    retry: false,
    refetchInterval: (query) => {
      const evaluation = query.state.data;

      if (
        evaluation?.status === "PENDING" ||
        evaluation?.status === "RUNNING"
      ) {
        return 1500;
      }

      return false;
    },
  });
}