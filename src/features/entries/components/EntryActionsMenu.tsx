import { MoveHorizontal as MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface EntryActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function EntryActionsMenu({ onEdit, onDelete }: EntryActionsMenuProps) {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 transition-opacity duration-200 ${
            isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Entry actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Edit entry
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete entry
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
