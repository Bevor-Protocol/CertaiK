import { cn } from "@/lib/utils";
import React, { cloneElement, forwardRef, ReactElement } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  children: React.ReactNode;
}

export const Wrapper: React.FC<Props> = ({ children, isOpen }) => {
  if (!isOpen) return <></>;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[990] animate-modal">
      {cloneElement(children as ReactElement, { isOpen })}
    </div>
  );
};

export const Content = forwardRef<HTMLDivElement, Props>(({ children, isOpen, ...rest }, ref) => {
  // if (!open) return <></>;
  return (
    <div
      className={cn(
        "shadow rounded-lg w-[600px] max-w-[80%] max-h-[80%] overflow-scroll border border-white",
        "bg-black p-6 relative",
        isOpen ? "animate-appear" : "animate-disappear",
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

Content.displayName = "Content";
