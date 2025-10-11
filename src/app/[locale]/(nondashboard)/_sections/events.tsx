"use client";

import { startOfMonth, endOfMonth, addMonths } from "date-fns";

import { useGetMeetingsQuery } from "@/state/api";

export const Events = () => {
  const { data: meetings, isLoading } = useGetMeetingsQuery({
    dateRange: [
      startOfMonth(new Date()).toISOString(),
      endOfMonth(addMonths(new Date(), 3)).toISOString()
    ] as [string, string]
  });

  return (
    <section id="events" className="w-full max-w-5xl py-20 sm:py-40">
      <h2 className="text-2xl font-semibold mb-4">Events</h2>
      <p>Details about upcoming events will be posted here.</p>

      {/* todo: show in calendar */}
      {meetings?.map((meeting) =>
        <div key={meeting.id}>
          {meeting.name}
        </div>
      )}
      {isLoading && <>Loading...</>}
    </section>
  );
}