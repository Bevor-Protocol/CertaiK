"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar: React.FC<{ className: string }> = ({ className }) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-black/90 border border-gray-800 rounded-lg px-8 py-2 w-[300px]",
        "flex justify-between items-center",
        className,
      )}
    >
      <Link href="/" passHref>
        <div className={cn("cursor-pointer relative", pathname === "/" && " text-green-400")}>
          {pathname === "/" && <span className="absolute left-0 -translate-x-full">{">"}</span>}
          terminal
        </div>
      </Link>
      <Link href="/api-keys" passHref>
        <div
          className={cn("cursor-pointer relative", pathname === "/api-keys" && " text-green-400")}
        >
          {pathname === "/api-keys" && (
            <span className="absolute left-0 -translate-x-full">{">"}</span>
          )}
          api
        </div>
      </Link>
      <Link href="/analytics" passHref>
        <div
          className={cn(
            "cursor-pointer relative",
            pathname.includes("/analytics") && " text-green-400",
          )}
        >
          {pathname.includes("/analytics") && (
            <span className="absolute left-0 -translate-x-full">{">"}</span>
          )}
          analytics
        </div>
      </Link>
    </div>
  );
};

export default NavBar;
