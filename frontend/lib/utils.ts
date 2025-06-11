import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function saveUserInterests(interests: string[]) {
  // Placeholder: Store interests in localStorage for now
  // Replace with backend API call (e.g., FastAPI) later
  localStorage.setItem('userInterests', JSON.stringify(interests))
}

export function getUserInterests(): string[] {
  // Placeholder: Retrieve interests from localStorage
  const interests = localStorage.getItem('userInterests')
  return interests ? JSON.parse(interests) : []
}