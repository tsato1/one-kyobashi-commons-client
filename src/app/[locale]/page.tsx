import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "./_sections/hero";
import { Sponsors } from "./_sections/sponsors";
import { Subhero } from "./_sections/subhero";
import { Events } from "./_sections/events";

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

      <Sponsors />

      <Subhero />

      <Events />

      <Footer />
    </main>
  );
}
