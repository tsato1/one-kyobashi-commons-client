import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Navbar locale={locale} />
        <main className="flex pt-16 sm:pt-20">
          <DashboardAuthProvider>
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </DashboardAuthProvider>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
