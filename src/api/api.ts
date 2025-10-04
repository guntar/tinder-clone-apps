import AppConfig from "@/src/api/config";
import { storage } from "@/src/utils/storage";
import axios from "axios";

export const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use(async (config: any) => {
  const token = await storage.get("guestToken");
  
  console.log("[Interceptor] Token from storage:", token);
  console.log("[Interceptor] Request URL:", config.url);
  
  config.headers = {
    ...config.headers,
    "x-Secret-Key": AppConfig.SECRET_KEY,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[Interceptor] Authorization header set");
  } else {
    console.log("[Interceptor] No token found!");
  }

  return config;
});

export const apiRequest = {
  get: async (url: string, config?: any) => {
    const res = await api.get(url, config);
    return res.data;
  },
  post: async (url: string, body?: any, config?: any) => {
    const res = await api.post(url, body, config);
    return res.data;
  },
  put: async (url: string, body?: any, config?: any) => {
    const res = await api.put(url, body, config);
    return res.data;
  },
};