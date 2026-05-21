"use client";

import type { ReactNode } from "react";
import { TaskCenterWidget } from "@/modules/task-center/components/TaskCenterWidget";
import { TaskCenterProvider } from "@/modules/task-center/providers/TaskCenterProvider";
import { UserProvider } from "@/modules/user/providers/UserProvider";

export function StableAudioAppProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <TaskCenterProvider>
        {children}
        <TaskCenterWidget />
      </TaskCenterProvider>
    </UserProvider>
  );
}

