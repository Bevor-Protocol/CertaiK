"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const NavBar: React.FC<{ className: string }> = ({ className }) => {
  const [selected, setSelected] = useState<"terminal" | "api">("terminal");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/api-keys") {
      setSelected("api");
    } else {
      setSelected("terminal");
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        "bg-black/90 border border-gray-800 rounded-lg px-8 py-2 w-[300px]",
        "flex justify-between items-center",
        className,
      )}
    >
      <Link href="/" passHref>
        <div
          className={cn("cursor-pointer relative", selected === "terminal" && " text-green-400")}
          onClick={() => setSelected("terminal")}
        >
          {selected === "terminal" && (
            <span className="absolute left-0 -translate-x-full">{">"}</span>
          )}
          Terminal
        </div>
      </Link>
      <Link href="/api-keys" passHref>
        <div
          className={cn("cursor-pointer relative", selected === "api" && " text-green-400")}
          onClick={() => setSelected("api")}
        >
          {selected === "api" && <span className="absolute left-0 -translate-x-full">{">"}</span>}
          API
        </div>
      </Link>
    </div>
  );
};

export default NavBar;
