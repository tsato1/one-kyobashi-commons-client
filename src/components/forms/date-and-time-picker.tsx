/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { format, Locale } from "date-fns";
import { ChevronDownIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateAndTimePickerProps {
  defaultValue?: Date;
  name: string;
  control: any;
  placeholder?: string;
  locale?: Locale;
  className?: string;
}

export const DateAndTimePicker: React.FC<DateAndTimePickerProps> = ({
  defaultValue,
  name,
  control,
  placeholder,
  locale,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue)
  const [time, setTime] = React.useState<string>(defaultValue ? format(defaultValue, "HH:mm") : "00:00");

  const handleDateTimeChange = React.useCallback(
    (newDate: Date | undefined, newTime: string) => {
      if (newDate) {
        const [hours, minutes] = newTime.split(":")
        const updatedDate = new Date(newDate)
        updatedDate.setHours(parseInt(hours), parseInt(minutes), 0)
        return updatedDate
      }
      return undefined
    },
    []
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl>
          <div className={cn("flex gap-4", className)}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="bg-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-32 justify-between font-normal"
                >
                  {date && !isNaN(date.getTime())
                    ? format(date, "PP", { locale })
                    : placeholder || "Select date"
                  }
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  locale={locale as Locale}
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date)
                    field.onChange(handleDateTimeChange(date, time))
                    setOpen(false)
                  }} />
              </PopoverContent>
            </Popover>
            {date && (
              <Input
                type="time"
                id="time-picker"
                step="60"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value)
                  field.onChange(handleDateTimeChange(date, e.target.value))
                }}
                className="w-fit [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none" />
            )}
            {date && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDate(undefined)}
              >
                <X />
              </Button>
            )}
          </div>
        </FormControl>
      )} />
  )
}
