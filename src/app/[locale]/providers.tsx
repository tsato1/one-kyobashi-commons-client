/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NextIntlClientProvider } from 'next-intl';
import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/auth-provider";

interface ProvidersProps {
  locale: "en" | "ja"
  messages: Record<string, any>
  children: React.ReactNode
}
const Providers = ({
  locale,
  messages,
  children
}: ProvidersProps) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StoreProvider>
        <Authenticator.Provider>
          <Auth>{children}</Auth>
        </Authenticator.Provider>
      </StoreProvider>
    </NextIntlClientProvider>
  );
};

export default Providers;
