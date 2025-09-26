import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import { Navbar } from "@/components/navbar";
import { routing } from "@/i18n/routing";

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
      <Navbar locale={locale} />
      <main className="h-full flex w-full flex-col pt-16 sm:pt-20">
        {children}
      </main>
    </>
  );
};

export default Layout;
