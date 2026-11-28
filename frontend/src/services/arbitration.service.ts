import { apiRequest } from "@/services/api-client";
import {
  normalizeArbitrationResponse,
  normalizeHistory,
  normalizeQuestions,
  normalizeStatistics,
} from "@/lib/normalize";
import type {
  ArbitrationRecord,
  ArbitrationRequest,
  ArbitrationResponse,
  ArbitrationStatistics,
  HealthResponse,
  Question,
} from "@/types/arbitration";

export const arbitrationService = {
  getHealth(signal?: AbortSignal): Promise<HealthResponse> {
    return apiRequest<HealthResponse>("/", { signal });
  },

  async arbitrate(request: ArbitrationRequest): Promise<ArbitrationResponse> {
    const payload = await apiRequest<unknown>("/arbitrate", { method: "POST", body: request });
    return normalizeArbitrationResponse(payload);
  },

  async getQuestions(signal?: AbortSignal): Promise<Question[]> {
    const payload = await apiRequest<unknown>("/questions", { signal });
    return normalizeQuestions(payload);
  },

  async getStatistics(signal?: AbortSignal): Promise<ArbitrationStatistics> {
    const payload = await apiRequest<unknown>("/statistics", { signal });
    return normalizeStatistics(payload);
  },

  async getHistory(signal?: AbortSignal): Promise<ArbitrationRecord[]> {
    const payload = await apiRequest<unknown>("/history", { signal });
    return normalizeHistory(payload);
  },
};
