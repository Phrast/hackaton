import { apiClient } from "./client";
import type { Site, SiteRequest, PageResponse, Calculation, ComparisonResponse } from "@/types/site";

export const sitesApi = {
  create: (data: SiteRequest) =>
    apiClient.post<Site>("/api/sites", data).then((r) => r.data),

  findAll: (page = 0, size = 20) =>
    apiClient.get<PageResponse<Site>>(`/api/sites?page=${page}&size=${size}&sort=createdAt,desc`).then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<Site>(`/api/sites/${id}`).then((r) => r.data),

  update: (id: number, data: SiteRequest) =>
    apiClient.put<Site>(`/api/sites/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/sites/${id}`),

  calculate: (id: number) =>
    apiClient.post<Calculation>(`/api/sites/${id}/calculate`).then((r) => r.data),

  getHistory: (id: number) =>
    apiClient.get<Calculation[]>(`/api/sites/${id}/calculations`).then((r) => r.data),

  exportPdf: (id: number) =>
    apiClient.get(`/api/sites/${id}/export-pdf`, { responseType: "blob" }).then((r) => r.data),

  compare: (siteIds: number[]) =>
    apiClient.get<ComparisonResponse>(`/api/compare?siteIds=${siteIds.join(",")}`).then((r) => r.data),
};
