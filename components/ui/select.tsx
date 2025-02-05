"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";
import { DropdownOption } from "@/utils/types";
import { ChevronDown, X } from "lucide-react";
import * as Dropdown from "./dropdown";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  options: DropdownOption[];
  selectedOptions: DropdownOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
}

export const Select: React.FC<Props> = ({
  title,
  className,
  options,
  selectedOptions,
  setSelectedOptions,
}): JSX.Element => {
  const toggleOption = (option: DropdownOption): void => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.value === option.value)
        ? prev.filter((item) => item.value !== option.value)
        : [...prev, option],
    );
  };

  const removeOption = (option: DropdownOption): void => {
    setSelectedOptions((prev) => prev.filter((item) => item.value !== option.value));
  };

  return (
    <div className="w-full">
      <Dropdown.Main>
        <Dropdown.Trigger>
          <Button
            variant="transparent"
            className={cn("flex justify-between w-full py-1", className)}
          >
            {title}
            <ChevronDown height="14px" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content className="top-full w-full">
          <div
            className={cn(
              "h-40 max-h-40 bg-black w-full border border-gray-800 px-2 py-1",
              "overflow-y-scroll",
            )}
          >
            {options.map((option) => (
              <div
                key={option.name}
                onClick={() => toggleOption(option)}
                className={cn(
                  "cursor-pointer p-1 hover:bg-gray-700/50 rounded-sm",
                  selectedOptions.some((item) => item.value === option.value) && "bg-gray-700/50",
                )}
              >
                {option.name}
              </div>
            ))}
          </div>
        </Dropdown.Content>
      </Dropdown.Main>
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 cursor-pointer w-full text-xs">
          {selectedOptions.map((option) => (
            <Pill
              key={option.value}
              className="flex items-center space-x-1"
              onClick={() => removeOption(option)}
            >
              <span>{option.name}</span>
              <X className="h-3 w-3" />
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
};
