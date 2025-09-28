import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { NavbarLanding } from "./_components/navbar-landing";

const Layout = async ({
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
    <>
      <NavbarLanding locale={locale} />
      <main className="h-full flex w-full flex-col pt-16 sm:pt-20">
        {children}
      </main>
    </>
  );
};

export default Layout;
