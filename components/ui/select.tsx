"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownOption } from "@/utils/types";
import { ChevronDown } from "lucide-react";
import * as Dropdown from "./dropdown";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  placeholder: string;
  options: DropdownOption[];
  current: DropdownOption | null;
  disabled?: boolean;
  handleCurrent: (option: DropdownOption) => void;
}

export const Select: React.FC<Props> = ({
  placeholder,
  className,
  options,
  current,
  disabled = false,
  handleCurrent,
}): JSX.Element => {
  return (
    <div className="w-full">
      <Dropdown.Main>
        <Dropdown.Trigger>
          <Button
            variant="transparent"
            className={cn("flex justify-between w-full py-1", className)}
            disabled={disabled}
          >
            {current?.name ?? placeholder}
            <ChevronDown height="14px" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content className="top-full w-full" hasCloseTrigger>
          <Options options={options} current={current} handleCurrent={handleCurrent} />
        </Dropdown.Content>
      </Dropdown.Main>
    </div>
  );
};

const Options = ({
  close,
  options,
  current,
  handleCurrent,
}: {
  close?: () => void;
  options: DropdownOption[];
  current: DropdownOption | null;
  handleCurrent: (option: DropdownOption) => void;
}): JSX.Element => {
  return (
    <div
      className={cn(
        "h-40 max-h-40 bg-black w-full border border-gray-800 px-2 py-1",
        "overflow-y-scroll rounded",
      )}
    >
      {options.map((option) => (
        <div
          key={option.name}
          onClick={() => {
            if (close) close();
            handleCurrent(option);
          }}
          className={cn(
            "cursor-pointer p-1 hover:bg-gray-700/50 rounded-sm",
            current?.value === option.value && "bg-gray-700/50",
          )}
        >
          {option.name}
        </div>
      ))}
    </div>
  );
};
