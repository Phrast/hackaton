import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post("/api/auth/login", { email, password }).then((r) => r.data),
  register: (email: string, password: string, firstName?: string, lastName?: string) =>
    apiClient.post("/api/auth/register", { email, password, firstName, lastName }).then((r) => r.data),
};

export const sitesService = {
  findAll: (page = 0) =>
    apiClient.get(`/api/sites?page=${page}&size=20&sort=createdAt,desc`).then((r) => r.data),
  findById: (id: number) =>
    apiClient.get(`/api/sites/${id}`).then((r) => r.data),
  create: (data: object) =>
    apiClient.post("/api/sites", data).then((r) => r.data),
  calculate: (id: number) =>
    apiClient.post(`/api/sites/${id}/calculate`).then((r) => r.data),
};

export const materialsService = {
  findAll: () =>
    apiClient.get("/api/materials").then((r) => r.data),
};
