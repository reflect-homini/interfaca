import { format, isToday, isYesterday } from "date-fns";

interface Props {
  date: Date;
}

export function EntryDaySeparator({ date }: Props) {
  let label: string;
  if (isToday(date)) {
    label = "Today";
  } else if (isYesterday(date)) {
    label = "Yesterday";
  } else {
    label = format(date, "EEEE, MMMM d, yyyy");
  }

  return (
    <div className="flex items-center gap-3 py-3 px-2 select-none">
      <div className="flex-1 h-px bg-border/50" />
      <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}
