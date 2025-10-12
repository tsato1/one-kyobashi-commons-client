"use client";

import { useLocale } from "next-intl";
import { startOfMonth, endOfMonth, addMonths } from "date-fns";
import { enUS, ja } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar-events";
import { useGetMeetingsQuery } from "@/state/api";

export const Events = () => {
  const locale = useLocale();

  const { data: meetings, isLoading } = useGetMeetingsQuery({
    dateRange: [
      startOfMonth(new Date()).toISOString(),
      endOfMonth(addMonths(new Date(), 3)).toISOString()
    ] as [string, string]
  });

  // todo
  interface Event {
    id: string;
    name: string;
    category: string;
    date: Date;
  }

  return (
    <section id="events" className="w-full max-w-5xl py-20 sm:py-40">
      <h2 className="text-2xl font-semibold mb-4">Events</h2>

      <Calendar
        events={[{
          id: "0",
          name: "asdf0",
          category: "oij",
          date: new Date()
        }, {
          id: "1",
          name: "asdf1",
          category: "oij",
          date: new Date()
        }, {
          id: "2",
          name: "asdf2asdf",
          category: "oij",
          date: new Date(),
        }] as Event[]}
        onSelect={(event: Event) => { console.log(`asdf event=${event.name}`) }}
        locale={locale === "ja" ? ja : enUS} />

      {isLoading && <>Loading...</>}
    </section>
  );
}