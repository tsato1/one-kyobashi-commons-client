import { Navbar } from "@/components/navbar";
import { Hero } from "./_sections/hero";

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({
  params
}: HomeProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen font-palanquin mx-auto flex flex-col items-center overflow-hidden">
      <Navbar locale={locale} />

      <Hero />
    </main>
  );
}
