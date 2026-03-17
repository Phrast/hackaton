import { apiClient } from "./client";
import type { Material } from "@/types/site";

export const materialsApi = {
  findAll: () =>
    apiClient.get<Material[]>("/api/materials").then((r) => r.data),
};
