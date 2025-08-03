import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { useAuthStore } from "@/stores/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authLoader = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }
  useAuthStore.getState().getAuthMe();
};
