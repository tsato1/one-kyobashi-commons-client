"use client";

import React, { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  Locale,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { enUS } from 'date-fns/locale';

import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  name: string;
  category: string;
  date: Date;
}

interface CalendarProps {
  onSelect: (event: Event) => void;
  events: Event[];
  locale: Locale;
}

const eachDayOfMonth = (month: Date): Date[] => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days: Date[] = [];
  const currentDay = start;

  while (currentDay <= end) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
};

export const Calendar = ({
  onSelect,
  events,
  locale = enUS,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthsToShow = [currentMonth];

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isFirstMonth = isSameMonth(currentMonth, new Date());
  const isLastMonth = isSameMonth(currentMonth, addMonths(new Date(), 2));

  const weekdays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });

    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(start, i);
      return format(day, "EEE", { locale })
    });
  }, [currentMonth, locale]);

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const days = eachDayOfMonth(month);
    const firstDayOfWeek = monthStart.getDay();

    return (
      <div className="w-full rounded-lg shadow-md py-4 px-1">
        <div className="flex items-center gap-x-2 mb-4">
          <Button
            variant="ghost"
            size="xl"
            onClick={prevMonth}
            className="flex-1 text-start hover:bg-transparent hover:text-accent"
            disabled={isFirstMonth}
          >
            <ChevronLeftIcon />
          </Button>
          <h2 className="text-xl sm:text-2xl font-semibold text-center">
            {format(month, 'MMMM yyyy', { locale })}
          </h2>
          <Button
            variant="ghost"
            size="xl"
            onClick={nextMonth}
            className="flex-1 text-end hover:bg-transparent hover:text-accent"
            disabled={isLastMonth}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {weekdays.map((day) => (
            <div key={day} className="font-medium text-sm text-gray-600 py-1">{day}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          {days.map((day) => {
            const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day));
            return (
              <div
                key={day.toString()}
                className={`w-11 sm:w-[88px] lg:w-32 h-20 flex flex-col rounded text-center text-nowrap space-y-0.5
                  ${isSameMonth(day, month) ? 'bg-gray-50' : 'bg-gray-200'} `}
                onClick={() => dayEvents.length > 0 && onSelect(dayEvents[0])}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    title={event.name}
                    className="text-xs truncate w-full cursor-pointer bg-primary rounded transition-all duration-200 p-0.5"
                    onClick={() => onSelect(event)}
                  >
                    {event.name}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span
                    className="text-xs"
                    onClick={() => { /* todo: implement */ }}
                  >
                    ...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      {monthsToShow.map((month, index) => (
        <div key={index}>{renderMonth(month)}</div>
      ))}
    </div>
  );
};
