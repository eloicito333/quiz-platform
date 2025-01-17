import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const secs = Math.floor(seconds - hours * 3600 - minutes * 60)
  const parts = []
  if (hours) {
    parts.push(`${hours}h`)
  }
  if (minutes) {
    parts.push(`${minutes}min`)
  }
  if (secs) {
    parts.push(`${secs}s`)
  }
  return parts.join(" ")
}