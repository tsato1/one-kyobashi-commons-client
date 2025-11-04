"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { addDays, addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useGetAllMeetingsQuery } from "@/state/api";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatTime, Locale } from "@/lib/utils";
import { MeetingResponse } from "@/types";

const MeetingsPage = () => {
  const t = useTranslations("");
  const router = useRouter();
  const locale = useLocale();

  const filters = useMemo(() => ({
    dateRange: [
      startOfMonth(new Date()).toISOString(),
      endOfMonth(new Date()).toISOString()
    ] as [string, string]
  }), []);

  const [dateRange, setDateRange] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  const [startDate, endDate] = dateRange;

  const { data: meetings, isLoading, refetch } = useGetAllMeetingsQuery(filters);

  useEffect(() => {
    refetch()
  }, [refetch])

  const groupedMeetings = meetings
    ? meetings.reduce((acc: Record<string, MeetingResponse[]>, meeting: MeetingResponse) => {
      const dateKey = format(new Date(meeting.startDate), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(meeting);
      return acc;
    }, {})
    : {};

  const selectPreviousMonth = () => {
    setDateRange([
      startOfMonth(addMonths(startDate, -1)),
      endOfMonth(addMonths(startDate, -1)),
    ]);
  };

  const selectNextMonth = () => {
    setDateRange([
      startOfMonth(addMonths(startDate, 1)),
      endOfMonth(addMonths(startDate, 1)),
    ]);
  };

  const handleMeetingClick = (id: string) => {
    router.push(`/trustees/meetings/${id}`);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10 px-1">
      <div className="w-full max-w-[600px] flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="xl"
          onClick={selectPreviousMonth}
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <ChevronLeftIcon className="size-6" />
        </Button>
        <Label className="text-lg sm:text-xl">
          {format(startDate, "LLLL yyyy", { locale: locale === "ja" ? ja : enUS })}
        </Label>
        <Button
          variant="ghost"
          size="xl"
          onClick={selectNextMonth}
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <ChevronRightIcon className="size-6" />
        </Button>
      </div>

      {isLoading ? (
        <p>Loading meetings...</p>
      ) : (
        meetings && meetings.length > 0 ? (
          Object.keys(groupedMeetings).map((dateKey) => (
            <div key={dateKey} className="w-full max-w-[550px] mb-4">
              <h2 className="text-lg font-semibold mb-2">
                {format(new Date(dateKey), "PPP", { locale: locale === "ja" ? ja : enUS })}
              </h2>
              <div className="space-y-1">
                {groupedMeetings[dateKey].map((meeting) => (
                  <div
                    key={meeting.id}
                    role="button"
                    className="relative border rounded shadow p-4 overflow-hidden bg-white cursor-pointer hover:scale-105 transition-all duration-300"
                    onClick={() => handleMeetingClick(meeting.id)}
                  >
                    <p className="w-3/4 text-nowrap text-ellipsis overflow-hidden">{meeting.name}</p>
                    <p className="flex text-sm">
                      <span>時間: {formatTime(new Date(meeting.startDate), locale as Locale)}</span>
                      {meeting.endDate && (
                        <>
                          <span className="px-2">~</span>
                          <span>{formatTime(new Date(meeting.endDate), locale as Locale)}</span>
                        </>
                      )}
                    </p>

                    {new Date() > new Date(meeting.startDate) && (
                      <div className="absolute w-24 top-0 right-0 rotate-45 translate-x-6 translate-y-3 bg-accent">
                        <p className="text-xs text-accent-foreground text-center py-1">終了</p>
                      </div>
                    )}
                    {(new Date() < new Date(meeting.startDate) && addDays(new Date(), 5) > new Date(meeting.startDate)) && (
                      <div className="absolute w-24 top-0 right-0 rotate-45 translate-x-6 translate-y-3 bg-pink-200">
                        <p className="text-xs text-black text-center py-1">もうすぐ</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>ミーティングがありません</p>
        )
      )}
    </div>
  )
}

export default MeetingsPage;
