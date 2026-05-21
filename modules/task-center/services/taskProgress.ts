import type { GenerationTask } from "../providers/TaskCenterProvider";

type TaskProgressInput = Pick<GenerationTask, "createdAt" | "isLocalPending" | "status">;

export const getEstimatedTaskProgress = (task: TaskProgressInput) => {
  if (task.status === "success" || task.status === "failed") return 100;
  if (task.isLocalPending) return 8;

  const elapsedSec = Math.max(0, (Date.now() - task.createdAt) / 1000);
  const tick = 1.5;
  const ticks = Math.floor(elapsedSec / tick);
  const firstPhaseTicks = Math.floor(30 / tick);
  const firstPhase = Math.min(ticks, firstPhaseTicks) * 2;
  const secondPhase = Math.max(0, ticks - firstPhaseTicks) * 1;

  return Math.min(95, firstPhase + secondPhase);
};

export const getTaskProgressStage = (task: TaskProgressInput) => {
  if (task.status === "success") return "Completed";
  if (task.status === "failed") return "Failed";
  if (task.isLocalPending) return "Submitting request";

  const progress = getEstimatedTaskProgress(task);
  if (progress < 18) return "Preparing generation";
  if (progress < 45) return "Queuing render";
  if (progress < 75) return "Rendering motion";
  return "Finalizing output";
};

export const getTaskProgressHint = (task: TaskProgressInput) => {
  if (task.status !== "pending") return "";
  if (task.isLocalPending) return "Sending your prompt and settings to the generator.";

  const elapsedSec = Math.max(0, (Date.now() - task.createdAt) / 1000);
  if (elapsedSec >= 30) {
    return "Video generation usually takes about 2 minutes. You can keep this running in the background.";
  }
  return "Your request is in progress. The preview will update when the video is ready.";
};
