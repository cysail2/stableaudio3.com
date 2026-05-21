import { API_CONFIG, getHeaders, handleApiError } from "./api-core";

const AUTH_REQUEST_TIMEOUT_MS = 15000;
const USER_INFO_TIMEOUT_MS = 10000;

const createTimeoutSignal = (ms: number): AbortSignal | undefined => {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  if (typeof AbortController !== "undefined") {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }
  return undefined;
};

export const authApi = {
  syncUser: async (userData: {
    uuid: string;
    email: string;
    token: string;
    nickname?: string;
    avatar?: string;
    from_login: string;
    ivcode?: string;
  }) => {
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
    const isTestClerkKey =
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_") ||
      process.env.CLERK_SECRET_KEY?.includes("test");
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      appEnv === "test" ||
      isTestClerkKey;
    const endpoint = isDevelopment ? "loginAuthCyTest" : "loginAuth";

    const response = await fetch(`${API_CONFIG.API_BASE}/api/user/${endpoint}`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(userData),
      signal: createTimeoutSignal(AUTH_REQUEST_TIMEOUT_MS),
    });

    const result = await handleApiError(response);
    if (result.code === 200 && result.data && typeof window !== "undefined") {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      localStorage.setItem("token_expire_at", String(result.data.expire_at));
    }
    return result;
  },

  isTokenValid: () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("access_token");
    const expireAt = localStorage.getItem("token_expire_at");
    if (!token || !expireAt) return false;
    return Number(expireAt) > Math.floor(Date.now() / 1000);
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expire_at");
  },
};

export const userApi = {
  getUserInfo: async () => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/user/info`, {
      headers: getHeaders(),
      signal: createTimeoutSignal(USER_INFO_TIMEOUT_MS),
    });
    return handleApiError(response);
  },

  getUserOpusList: async (page = 1, pageSize = 30) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return handleApiError(response);
  },

  getTimesLog: async (page = 1, pageSize = 10) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/times_log?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return handleApiError(response);
  },

  getPayLog: async (page = 1, pageSize = 10) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/pay_log?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return handleApiError(response);
  },

  deleteOpus: async (opusId: number) => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/opus/delete`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ opus_id: opusId }),
    });
    return handleApiError(response);
  },
};

export const api = {
  auth: authApi,
  user: userApi,
};
