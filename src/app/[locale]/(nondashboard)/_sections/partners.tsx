import { getTranslations } from "next-intl/server";
import { FaArrowsDownToPeople, FaPeopleCarryBox, FaPeopleRobbery } from "react-icons/fa6";


import { InfiniteScroller } from "@/components/infinite-scroller";
import { Button } from "@/components/ui/button";
import { data } from "@/constants/partners-data";

export const Partners = async () => {
  const items = data.map((item, index) => (
    <div
      key={`sponsor_${index}`}
      className="size-[200px] flex items-center justify-center border-3 border-dashed border-neutral-400"
    >
      {item.name}
    </div>
  ));

  const t = await getTranslations("main.partners");

  return (
    <section id="partners" className="w-full bg-secondary/50 py-20 sm:py-40">
      <h2 className="text-center text-2xl font-semibold mb-8 sm:mb-16">{t("title")}</h2>

      <InfiniteScroller
        items={items}
        clones={1}
        gap="40px"
        duration="100s"
        direction="left"
        pauseOnHover={false}
        className="mb-8 sm:mb-16" />

      <div className="space-y-4 sm:space-y-8 mb-8 sm:mb-16">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-x-16 gap-y-4 px-2 sm:px-4">
          <div className="flex flex-col items-center">
            <span className="rounded-full bg-white border-2 border-primary-foreground p-2 mr-2">
              <FaPeopleRobbery className="size-5 sm:size-9" />
            </span>
            <p className="text-base sm:text-lg text-nowrap">{t("description1")}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="rounded-full bg-white border-2 border-primary-foreground p-2 mr-2">
              <FaArrowsDownToPeople className="size-5 sm:size-9" />
            </span>
            <p className="text-base sm:text-lg text-nowrap">{t("description2")}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-center rounded-full bg-white border-2 border-primary-foreground p-2 mr-2">
            <FaPeopleCarryBox className="size-5 sm:size-9" />
          </span>
          <p className="text-base sm:text-lg text-nowrap">{t("description3")}</p>
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          size="xl"
        >
          {t("becomeAPartner")}
        </Button>
      </div>
    </section>
  );
}