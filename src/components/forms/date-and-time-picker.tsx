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
import { date } from "zod";

interface DateAndTimePickerProps {
  name: string;
  control: any;
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean
  locale?: Locale;
  className?: string;
}

export const DateAndTimePicker = ({
  name,
  control,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  locale,
  className,
}: DateAndTimePickerProps) => {
  const date = value;
  const time = value ? format(value, "HH:mm") : "19:00";

  const [open, setOpen] = React.useState(false);

  const handleDateTimeChange = React.useCallback(
    (selectedDate: Date | undefined, selectedTime: string) => {
      if (!selectedDate) {
        onChange(undefined);
        return;
      }

      const [hours, minutes] = selectedTime.split(":").map(Number);
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(hours, minutes, 0);
      onChange(updatedDate);
    },
    [onChange]
  )

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormControl>
          <div className={cn("flex gap-4", className)}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                asChild
                className="bg-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                disabled={disabled}
              >
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-32 justify-between font-normal"
                  disabled={disabled}
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
                  disabled={disabled}
                  onSelect={(date) => {
                    handleDateTimeChange(date, time);
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
                onChange={(e) => { handleDateTimeChange(date, e.target.value) }}
                disabled={disabled}
                className="w-fit [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none" />
            )}
            {date && !required && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange(undefined)}
                disabled={disabled}
              >
                <X />
              </Button>
            )}
          </div>
        </FormControl>
      )} />
  )
}
