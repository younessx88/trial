import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getBoardUrl(boardId: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/board/${boardId}`;
}
