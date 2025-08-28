import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

interface BaseCalendarProps {
  label?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  trigger?: ReactNode;
  selectedDate?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
}

const BaseCalendar = ({
  label,
  open,
  onOpenChange,
  trigger,
  selectedDate,
  onSelect,
}: BaseCalendarProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="font-semibold text-sm block mb-2">{label}</label>
      )}
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={onSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BaseCalendar;
