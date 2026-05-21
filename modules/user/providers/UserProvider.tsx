"use client";

import { ClerkProvider, useAuth, useClerk, useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/modules/api/services/api";

export type UserInfo = {
  uuid: string;
  email: string;
  nickname?: string;
  avatar?: string;
  free_limit: number;
  remaining_limit: number;
  total_credits: number;
};

type OpenSignInOptions = {
  mode?: "sign-in" | "sign-up";
  forceRedirectUrl?: string;
};

type UserContextValue = {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  isSignedIn: boolean;
  refreshUserInfo: () => Promise<void>;
  clearUserState: () => void;
  openSignIn: (options?: OpenSignInOptions) => void;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type RawUserInfo = {
  uuid?: unknown;
  email?: unknown;
  nickname?: unknown;
  avatar?: unknown;
  free_limit?: unknown;
  remaining_limit?: unknown;
};

const asNumber = (value: unknown) => {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const asOptionalString = (value: unknown) => (typeof value === "string" ? value : undefined);

const mapUserInfo = (data: RawUserInfo): UserInfo => ({
  uuid: String(data.uuid || ""),
  email: String(data.email || ""),
  nickname: asOptionalString(data.nickname),
  avatar: asOptionalString(data.avatar),
  free_limit: asNumber(data.free_limit),
  remaining_limit: asNumber(data.remaining_limit),
  total_credits: asNumber(data.free_limit) + asNumber(data.remaining_limit),
});

const fallbackContext: UserContextValue = {
  userInfo: null,
  isLoadingUserInfo: false,
  isSignedIn: false,
  refreshUserInfo: async () => {},
  clearUserState: () => {},
  openSignIn: () => {
    window.alert("Sign in is not configured yet. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable accounts.");
  },
  signOut: async () => {},
};

function FallbackUserProvider({ children }: { children: ReactNode }) {
  return <UserContext.Provider value={fallbackContext}>{children}</UserContext.Provider>;
}

function ClerkUserBridge({ children }: { children: ReactNode }) {
  const { user, isSignedIn: clerkSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openSignIn, openSignUp, signOut: clerkSignOut } = useClerk();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(api.auth.isTokenValid);
  const syncedUserIdsRef = useRef<Set<string>>(new Set());

  const clearUserState = useCallback(() => {
    api.auth.clearTokens();
    setUserInfo(null);
    setIsLoadingUserInfo(false);
    syncedUserIdsRef.current.clear();
  }, []);

  const refreshUserInfo = useCallback(async () => {
    if (!api.auth.isTokenValid()) {
      setUserInfo(null);
      setIsLoadingUserInfo(false);
      return;
    }
    setIsLoadingUserInfo(true);
    try {
      const result = await api.user.getUserInfo();
      if (result.code === 200 && result.data) {
        setUserInfo(mapUserInfo(result.data));
      }
    } catch (error) {
      console.warn("Failed to fetch Stable Audio 3 user info", error);
      setUserInfo(null);
    } finally {
      setIsLoadingUserInfo(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkSignedIn || !user?.id || !user.primaryEmailAddress?.emailAddress) {
      queueMicrotask(clearUserState);
      return;
    }

    if (syncedUserIdsRef.current.has(user.id)) {
      void refreshUserInfo();
      return;
    }

    let cancelled = false;
    syncedUserIdsRef.current.add(user.id);

    const sync = async () => {
      setIsLoadingUserInfo(true);
      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Missing Clerk token");

        const result = await api.auth.syncUser({
          uuid: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          nickname: user.fullName || undefined,
          avatar: user.imageUrl || undefined,
          from_login: "google",
          token: clerkToken,
        });

        if (!cancelled && result.code === 200) {
          await refreshUserInfo();
        }
      } catch (error) {
        console.warn("Failed to sync Stable Audio 3 user", error);
        syncedUserIdsRef.current.delete(user.id);
        if (!cancelled) setIsLoadingUserInfo(false);
      }
    };

    void sync();
    return () => {
      cancelled = true;
    };
  }, [clearUserState, clerkSignedIn, getToken, isLoaded, refreshUserInfo, user]);

  const value = useMemo<UserContextValue>(
    () => ({
      userInfo,
      isLoadingUserInfo,
      isSignedIn: Boolean(clerkSignedIn),
      refreshUserInfo,
      clearUserState,
      openSignIn: (options) => {
        if (options?.mode === "sign-up") {
          openSignUp({ forceRedirectUrl: options.forceRedirectUrl });
          return;
        }
        openSignIn({ forceRedirectUrl: options?.forceRedirectUrl });
      },
      signOut: async () => {
        clearUserState();
        await clerkSignOut();
      },
    }),
    [
      clearUserState,
      clerkSignOut,
      clerkSignedIn,
      isLoadingUserInfo,
      openSignIn,
      openSignUp,
      refreshUserInfo,
      userInfo,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return <FallbackUserProvider>{children}</FallbackUserProvider>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkUserBridge>{children}</ClerkUserBridge>
    </ClerkProvider>
  );
}

export const useUserInfo = () => {
  const value = useContext(UserContext);
  if (!value) throw new Error("useUserInfo must be used within UserProvider");
  return value;
};
