/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum Locale {
  en = 'en',
  ja = 'ja'
}

export const localePattern = Object.values(Locale).join('|');

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

export function formatTime(date: Date, locale: Locale) {
  const pattern = locale === Locale.ja ? "a h:mm" : "h:mm a";
  let formatted = format(date, pattern, { locale: locale === Locale.ja ? ja : enUS });

  if (locale === Locale.ja) {
    formatted = formatted.replace("AM", "午前").replace("PM", "午後");
  }

  return formatted;
}

export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err: any) {
    if (err.response?.status === 401) {
      toast.error("認証エラーが発生しました。ログインし直してください。");
      window.location.href = '/signin';
    } else if (error) {
      toast.error(error);
    } else {
      // todo: send error to monitoring service
      console.error(err);
      toast.error("予期しないエラーが発生しました。サポートに問い合わせてください。");
    }

    throw err;
  }
};

export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  fetchWithBQ: any
) => {
  const createUserResponse = await fetchWithBQ({
    url: "users",
    method: "POST",
    body: {
      cognitoId: user.userId,
      name: user.username,
      email: idToken?.payload?.email || "",
    },
  });

  if (createUserResponse.error) {
    throw new Error("Failed to create user record");
  }

  return createUserResponse;
};
