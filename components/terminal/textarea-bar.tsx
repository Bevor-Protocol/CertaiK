import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  overrideLoading?: boolean;
}

const TerminalTextArea: React.FC<InputBarProps> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  overrideLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-4 flex items-center relative flex-1">
      <span className="text-green-400 mr-2 self-start">{">"}</span>
      <textarea
        autoFocus={true}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || overrideLoading}
        className={cn(
          "flex-1 bg-transparent border-none outline-hidden h-full resize-none w-full pb-12",
          "text-white font-mono",
          "placeholder:text-gray-500",
          "caret-green-400",
          disabled && "cursor-not-allowed opacity-50",
        )}
        placeholder={!overrideLoading ? "Input your code..." : ""}
      />
      <Button
        variant="bright"
        className="w-full self-end absolute bottom-0"
        type="submit"
        disabled={!value}
      >
        Submit
      </Button>
    </form>
  );
};

export default TerminalTextArea;
