import { useQuery } from "@tanstack/react-query";
import { getProblem } from "../api/problems.api";

export function useProblem(slug: string | undefined) {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: () => getProblem(slug!),
    enabled: Boolean(slug),
  });
}