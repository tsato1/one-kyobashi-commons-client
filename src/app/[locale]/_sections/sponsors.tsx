import { getTranslations } from "next-intl/server";

import { InfiniteScroller } from "@/components/infinite-scroller";
import { Button } from "@/components/ui/button";
import { data } from "@/constants/sponsors-data";

export const Sponsors = async () => {
  const items = data.map((item, index) => (
    <div
      key={`sponsor_${index}`}
      className="size-[200px] flex items-center justify-center border-3 border-dashed border-neutral-400"
    >
      {item.name}
    </div>
  ));

  const t = await getTranslations("main.sponsors");

  return (
    <section id="sponsors" className="w-full bg-neutral-200 px-2 sm:px-4 py-20 sm:py-40">
      <h2 className="text-center text-2xl font-semibold mb-8 sm:mb-16">{t("title")}</h2>

      <InfiniteScroller
        items={items}
        clones={1}
        gap="40px"
        duration="100s"
        direction="left"
        pauseOnHover={false}
        className="mb-8 sm:mb-16" />

      <div className="text-center">
        <Button
          variant="outline"
          size="xl"
        >
          {t("becomeASponsor")}
        </Button>
      </div>
    </section>
  );
}