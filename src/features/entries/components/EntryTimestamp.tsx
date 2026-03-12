import { format } from "date-fns";

interface Props {
  date: Date;
}

export function EntryTimestamp({ date }: Props) {
  return (
    <div className="flex justify-center py-1 select-none">
      <span className="text-[11px] text-muted-foreground/70">
        {format(date, "h:mm a")}
      </span>
    </div>
  );
}
