/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

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

export const withApiError = async <T>(
  queryFulfilled: Promise<T>,
  {
    invalidMessage = "リクエストが正しくありません: 400 - bad request",
    notFoundMessage = "リソースが見つかりません: 404 - not found",
    genericMessage = "エラーが発生しました。サポートに問い合わせてください。",
  } = {}
) => {
  try {
    return await queryFulfilled;
  } catch (err: any) {
    const status = err?.error?.status;

    if (status === 400) {
      toast.error(invalidMessage);
    } else if (status === 404) {
      toast.error(notFoundMessage);
      notFound();
    } else if (status >= 500) {
      toast.error(genericMessage);
    }

    throw err;
  }
}

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    throw err;
  }
};

export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  userRole: string,
  fetchWithBQ: any
) => {
  const createEndpoint = userRole?.toLowerCase() === "trustee" ? "/trustees" : "/crews";

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
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
