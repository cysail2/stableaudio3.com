import { siteConfig } from "@/project/config/site";

export const API_CONFIG: { API_BASE: string; APP_ID: string } = {
  API_BASE: siteConfig.apiServiceUrl,
  APP_ID: siteConfig.appIdentifier,
};

export const setApiConfig = (overrides?: { apiBase?: string; appId?: string }) => {
  if (overrides?.apiBase?.trim()) {
    API_CONFIG.API_BASE = overrides.apiBase.trim();
  }
  if (overrides?.appId?.trim()) {
    API_CONFIG.APP_ID = overrides.appId.trim();
  }
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") || "";
};

export const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-appid": API_CONFIG.APP_ID,
  };

  if (includeAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getFormHeaders = () => {
  const headers: Record<string, string> = {
    "x-appid": API_CONFIG.APP_ID,
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorData || response.statusText}`);
  }

  const result = await response.json();
  if (result.code && result.code !== 200) {
    throw new Error(
      `API Business Error ${result.code}: ${result.message || result.msg || "Unknown error"}`,
    );
  }
  return result;
};

export const postForm = async (url: string, body: FormData) => {
  const response = await fetch(url, {
    method: "POST",
    headers: getFormHeaders(),
    body,
  });
  return handleApiError(response);
};
