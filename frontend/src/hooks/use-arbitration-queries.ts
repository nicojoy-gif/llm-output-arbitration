"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { arbitrationService } from "@/services/arbitration.service";

export const queryKeys = {
  health: ["health"] as const,
  questions: ["questions"] as const,
  statistics: ["statistics"] as const,
  history: ["history"] as const,
};

export const ARBITRATE_MUTATION_KEY = ["arbitrate"] as const;

export function useBackendHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: ({ signal }) => arbitrationService.getHealth(signal),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
    retry: false,
  });
}

export function useQuestions() {
  return useQuery({
    queryKey: queryKeys.questions,
    queryFn: ({ signal }) => arbitrationService.getQuestions(signal),
    staleTime: 5 * 60_000,
  });
}

export function useHistory() {
  return useQuery({
    queryKey: queryKeys.history,
    queryFn: ({ signal }) => arbitrationService.getHistory(signal),
  });
}

export function useStatistics() {
  return useQuery({
    queryKey: queryKeys.statistics,
    queryFn: ({ signal }) => arbitrationService.getStatistics(signal),
  });
}

export function useRunArbitration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ARBITRATE_MUTATION_KEY,
    mutationFn: (questionId: number) => arbitrationService.arbitrate({ question_id: questionId }),
    retry: false,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.history }),
        queryClient.invalidateQueries({ queryKey: queryKeys.statistics }),
      ]),
  });
}
