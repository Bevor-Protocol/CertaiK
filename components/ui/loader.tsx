"use client";

import coinAscii from "@/assets/ascii/coin";
import { cn } from "@/lib/utils";

export const Loader = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("conic animate-spin duration-1250", className)} />;
};

export const LoaderFull = ({ className }: { className: string }): JSX.Element => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader className={className} />
    </div>
  );
};

export const LoadWaifu = () => {
  return (
    <div className="w-full h-full flex items-center justify-center animate-pulse-more">
      <pre className="text-blue-100 whitespace-pre-wrap text-[0.2rem] leading-tight">
        {coinAscii}
      </pre>
    </div>
  );
};

export const Skeleton = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("bg-muted animate-pulse rounded-md", className)} />;
};
