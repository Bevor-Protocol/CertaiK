import * as React from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "bright" | "dark" | "transparent";
}

const Button: React.FC<ButtonProps> = (props) => {
  const { type, className, variant, disabled, children, ...rest } = props;
  return (
    <button
      type={type}
      className={cn(
        "flex items-center justify-center outline-none whitespace-nowrap",
        "focus-visible:opacity-80",
        "appearance-none bg-gradient-to-r text-white rounded-md text-base",
        variant !== "transparent" && "min-w-36 h-9 py-2 px-5",
        variant === "transparent" && "border border-gray-800 px-2",
        variant === "bright" && "from-cyan-500 to-purple-500",
        variant === "dark" && "from-gray-500 to-gray-700",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:opacity-80 transition-opacity cursor-pointer",
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
Button.displayName = "Input";

export { Button };
