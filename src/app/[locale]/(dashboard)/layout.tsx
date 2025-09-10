import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import { routing } from '@/i18n/routing';
import { DashboardAuthProvider } from "./dashboard-auth-provider";

const DashboardLayout = async ({
  params,
  children
}: {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <main className="w-full flex">
      <DashboardAuthProvider locale={locale}>
        <div className="flex-grow transition-all duration-300">
          {children}
        </div>
      </DashboardAuthProvider>
    </main>
  );
};

export default DashboardLayout;
