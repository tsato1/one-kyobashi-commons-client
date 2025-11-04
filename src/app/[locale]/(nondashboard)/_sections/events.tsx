"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { startOfMonth, endOfMonth, addMonths, format, Locale } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { enUS, ja } from "date-fns/locale";

import { useMySheet } from "@/hooks/use-my-sheet";
import { Calendar } from "@/components/ui/calendar-events";
import { useGetMeetingsQuery } from "@/state/api";
import { Event } from './event'

export const Events = () => {
  const locale = useLocale();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [dayEvents, setDayEvents] = useState<Meeting[]>([])

  const { data: meetings, isLoading } = useGetMeetingsQuery({
    dateRange: [
      startOfMonth(new Date()).toISOString(),
      endOfMonth(addMonths(new Date(), 3)).toISOString()
    ] as [string, string]
  });

  return (
    <section id="events" className="w-full max-w-5xl space-y-4 py-20 sm:py-40 px-1 sm:px-2">
      <h2 className="text-center text-3xl sm:text-4xl font-semibold">Events</h2>

      {isLoading && <div className="text-center">Loading...</div>}

      <Calendar
        events={meetings ?? []}
        onItemSelect={(event: Meeting) => { console.log(`asdf event=${event.name}`) }}
        onDaySelect={(date: Date, events: Meeting[]) => {
          setSelectedDate(date)
          setDayEvents(events)
          // go to #event
        }}
        locale={locale === "ja" ? ja : enUS} />

      {selectedDate && (
        <DayEvents
          date={selectedDate}
          events={dayEvents}
          locale={locale === "ja" ? ja : enUS} />
      )}
    </section>
  );
}

interface DayEventsProps {
  date: Date,
  events: Meeting[],
  locale: Locale
}

const DayEvents = ({
  date,
  events,
  locale = enUS,
}: DayEventsProps) => {
  const { onOpen } = useMySheet();

  const openEventSheet = (event: Meeting) => {
    onOpen("OpenEventSheet", {
      title: event.name,
    });
  }

  return (
    <div className="flex flex-col items-center">
      <Event />
      <h2 className="text-lg sm:text-xl font-semibold mb-3">
        {format(date, 'MMM d', { locale }) + `${locale === ja ? '日' : ''}`}
      </h2>
      <div className="space-y-1">
        {events.map((event, id) => (
          <div key={`event_${id}`} className="w-83 sm:w-[638px] lg:w-[919px] cursor-pointer border rounded-md p-2" onClick={() => openEventSheet(event)}>
            <p>{event.name}</p>
            <p>場所：{event.location ? event.location[0].toUpperCase() + event.location.slice(1) : "未定"}</p>
            <span>時間：{format(toZonedTime(event.startDate, event.timezone), 'HH:mm', { locale })}~
              {event.endDate && format(toZonedTime(event.endDate, event.timezone), 'HH:mm', { locale })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}