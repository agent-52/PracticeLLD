import { useMutation } from "@tanstack/react-query";
import { createAttempt } from "../api/attempts.api";

export function useCreateAttempt() {
  return useMutation({
    mutationFn: (problemId: string) => createAttempt(problemId),
  });
}