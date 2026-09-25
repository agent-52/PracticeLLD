import { useQuery } from "@tanstack/react-query";
import { getAttemptDetails } from "../api/attempts.api";

export function useAttemptDetails(
  attemptId: string | undefined,
) {
  return useQuery({
    queryKey: ["attempt-details", attemptId],
    queryFn: () => getAttemptDetails(attemptId!),
    enabled: Boolean(attemptId),
  });
}