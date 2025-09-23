"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Amplify } from "aws-amplify";
import { I18n } from "aws-amplify/utils"
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  translations,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { formFieldsEn, formFieldsJa } from "@/constants/auth-field-data";
import { localePattern } from "@/lib/utils";

I18n.putVocabularies(translations);

// https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN!, // e.g., myapp.auth.us-east-1.amazoncognito.com
          scopes: ["openid", "email"],
          redirectSignIn: process.env.NODE_ENV === "development"
            ? ["http://localhost:3000/welcome"]
            : [`${process.env.NEXT_PUBLIC_FRONTEND_URL!}/welcome`],
          redirectSignOut: process.env.NODE_ENV === "development"
            ? ["http://localhost:3000/"]
            : [`${process.env.NEXT_PUBLIC_FRONTEND_URL!}/`],
          responseType: "code", // Use authorization code grant flow
          providers: ["Google"],
        },
      },
    },
  },
});

const components = {
  Header() {
    return (
      <View className="mt-12 mb-7">
        <Heading level={3} className="!text-2xl !font-bold">
          ONE
          <span className="text-secondary-500 font-light">
            京橋コモンズ
          </span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">Welcome!</span>
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const t = useTranslations("common.auth")
      const { toSignUp } = useAuthenticator();
      const router = useRouter();

      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            {t("dontHaveAccount")} {" "}
            <button
              onClick={() => {
                router.push("/signup")
                toSignUp()
              }}
              className="text-primary-foreground hover:opacity-70 hover:underline underline-offset-4 bg-transparent border-none p-0 cursor-pointer"
            >
              {t("signUpHere")}
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    // todo: don't show radio buttons for crew / trustee and register as crew by default
    // "custom:role": {
    //   type: "hidden",
    //   defaultValue: "crew"
    // },
    FormFields() {
      const t = useTranslations("common.auth")
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend={t("role")}
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value="crew">{t("crew")}</Radio>
            <Radio value="trustee">{t("trustee")}</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const t = useTranslations("common.auth")
      const { toSignIn } = useAuthenticator();
      const router = useRouter();

      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            {t("alreadyHaveAccount")} {" "}
            <button
              onClick={() => {
                router.push("/signin")
                toSignIn()
              }}
              className="text-primary-foreground hover:opacity-70 hover:underline underline-offset-4 bg-transparent border-none p-0 cursor-pointer"
            >
              {t("signIn")}
            </button>
          </p>
        </View>
      );
    },
  },
};

const Auth = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  I18n.setLanguage(locale === "ja" ? "ja" : "en");

  const pattern = new RegExp(`^\\/(${localePattern})\\/(signin|signup)$`);
  const isAuthPage = pattern.test(pathname);
  const isDashboardPage = pathname.startsWith("/trustees") || pathname.startsWith("/crews");

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={locale === "ja" ? formFieldsJa : formFieldsEn}
        socialProviders={["google"]}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
