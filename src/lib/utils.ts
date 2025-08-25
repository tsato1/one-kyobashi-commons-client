import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum Locale {
  en = 'en',
  ja = 'ja'
}

export function localeToCountryCode(locale: Locale) {
  switch (locale) {
    case Locale.en:
      return "GB"
    case Locale.ja:
      return "JP"
    default:
      return "GB"
  }
}

export function localeToLanguageString(locale: Locale) {
  switch (locale) {
    case Locale.en:
      return "English"
    case Locale.ja:
      return "日本語"
    default:
      return "English"
  }
}