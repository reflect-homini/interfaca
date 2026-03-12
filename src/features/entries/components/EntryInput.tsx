import { useRef, useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (content: string) => void;
  isPending: boolean;
}

export function EntryInput({ onSubmit, isPending }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed.length < 3 || isPending) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isPending, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur-md p-3 sm:p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Reflect on your progress..."
          rows={1}
          disabled={isPending}
          className="glow-input flex-1 resize-none min-h-[44px] max-h-[160px] text-sm leading-relaxed"
          aria-label="Entry content"
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={value.trim().length < 3 || isPending}
          className="shrink-0 h-[44px] w-[44px] rounded-lg transition-all duration-300"
          aria-label="Send entry"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
