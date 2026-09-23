import { useQuery } from "@tanstack/react-query";
import { getProblems } from "../api/problems.api";

export function useProblems() {
  return useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });
}