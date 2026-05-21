"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { checkStableAudioVideoTaskStatus } from "@/modules/api/services/stable-audio";
import { useUserInfo } from "@/modules/user/providers/UserProvider";

export type GenerationTaskStatus = "pending" | "success" | "failed";

export type GenerationTask = {
  taskId: string;
  modelLabel: string;
  prompt?: string;
  createdAt: number;
  updatedAt: number;
  status: GenerationTaskStatus;
  statusMsg?: string;
  videoUrl?: string;
  isLocalPending?: boolean;
};

type AddTaskInput = Omit<GenerationTask, "createdAt" | "updatedAt" | "status"> & {
  createdAt?: number;
};

type TaskCenterContextValue = {
  tasks: GenerationTask[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addTask: (task: AddTaskInput, options?: { open?: boolean }) => void;
  updateTask: (taskId: string, updates: Partial<GenerationTask>) => void;
  replaceTaskId: (tempTaskId: string, task: Pick<GenerationTask, "taskId"> & Partial<GenerationTask>) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
};

const TaskCenterContext = createContext<TaskCenterContextValue | undefined>(undefined);
const STORAGE_KEY = "stableaudio3_tasks";
const POLL_INTERVAL_MS = 5000;

const readStoredTasks = (): GenerationTask[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function TaskCenterProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUserInfo();
  const [tasks, setTasks] = useState<GenerationTask[]>(readStoredTasks);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.slice(0, 30)));
    } catch {
      /* noop */
    }
  }, [tasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<GenerationTask>) => {
    setTasks((current) =>
      current.map((task) =>
        task.taskId === taskId ? { ...task, ...updates, updatedAt: Date.now() } : task,
      ),
    );
  }, []);

  const addTask = useCallback((task: AddTaskInput, options?: { open?: boolean }) => {
    const now = Date.now();
    setTasks((current) => [
      {
        ...task,
        createdAt: task.createdAt || now,
        updatedAt: now,
        status: "pending",
      },
      ...current.filter((item) => item.taskId !== task.taskId),
    ]);
    if (options?.open !== false) setOpen(true);
  }, []);

  const replaceTaskId = useCallback(
    (tempTaskId: string, task: Pick<GenerationTask, "taskId"> & Partial<GenerationTask>) => {
      setTasks((current) =>
        current.map((item) =>
          item.taskId === tempTaskId
            ? {
                ...item,
                ...task,
                taskId: task.taskId,
                isLocalPending: false,
                updatedAt: Date.now(),
              }
            : item,
        ),
      );
    },
    [],
  );

  const removeTask = useCallback((taskId: string) => {
    setTasks((current) => current.filter((task) => task.taskId !== taskId));
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;

    const poll = async () => {
      const pendingTasks = tasks.filter((task) => task.status === "pending" && !task.isLocalPending);
      await Promise.all(
        pendingTasks.map(async (task) => {
          try {
            const result = await checkStableAudioVideoTaskStatus(task.taskId);
            if (result.status === 1) {
              updateTask(task.taskId, {
                status: "success",
                statusMsg: result.statusMsg || "Completed",
                videoUrl: result.videoUrl,
              });
            } else if (result.status === -1) {
              updateTask(task.taskId, {
                status: "failed",
                statusMsg: result.statusMsg || "Generation failed",
              });
            } else {
              updateTask(task.taskId, {
                status: "pending",
                statusMsg: result.statusMsg || "Generating video...",
              });
            }
          } catch (error) {
            updateTask(task.taskId, {
              statusMsg: error instanceof Error ? error.message : "Unable to check task status",
            });
          }
        }),
      );
    };

    const timer = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    void poll();
    return () => window.clearInterval(timer);
  }, [isSignedIn, tasks, updateTask]);

  const value = useMemo<TaskCenterContextValue>(
    () => ({
      tasks,
      isOpen,
      setOpen,
      addTask,
      updateTask,
      replaceTaskId,
      removeTask,
      clearTasks,
    }),
    [addTask, clearTasks, isOpen, removeTask, replaceTaskId, tasks, updateTask],
  );

  return <TaskCenterContext.Provider value={value}>{children}</TaskCenterContext.Provider>;
}

export const useTaskCenter = () => {
  const value = useContext(TaskCenterContext);
  if (!value) throw new Error("useTaskCenter must be used within TaskCenterProvider");
  return value;
};
