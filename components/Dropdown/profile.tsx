"use client";

import * as Card from "@/components/ui/card";
import { useSiwe } from "@/hooks/useContexts";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { trimAddress } from "@/utils/helpers";
import { Check, Copy, LayoutDashboardIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Social } from "../ui/icon";

export const Profile = ({
  address,
  close,
}: {
  address: string;
  close?: () => void;
}): JSX.Element => {
  const { chain, connector } = useAccount();
  const { isCopied, copy } = useCopyToClipboard();
  const { logout } = useSiwe();

  return (
    <Card.Main className="text-xs min-w-52">
      <Card.Content>
        <div className="flex flex-col gap-1 pt-2 pb-1 px-2 w-full">
          <p className="text-sm ">Account</p>
          <div className="flex justify-between items-center">
            <p>{trimAddress(address)}</p>
            <Social>
              {isCopied ? (
                <Check stroke="white" height="1rem" width="1rem" />
              ) : (
                <Copy
                  stroke="white"
                  className="cursor-pointer"
                  onClick={() => copy(address)}
                  height="1rem"
                  width="1rem"
                />
              )}
            </Social>
          </div>
          <div
            className={cn(
              "flex flex-row justify-between items-center",
              "text-xxs text-white/60 flex-nowrap",
            )}
          >
            <p>{connector?.name}</p>
            <p>
              <span>{chain?.name}</span>
              <span
                className={cn(
                  "inline-block h-1 w-1 rounded-full ml-1 align-middle",
                  chain && "bg-green-400",
                  !chain && "bg-red-400",
                )}
              />
            </p>
          </div>
        </div>
      </Card.Content>
      <Card.Footer className="p-1">
        <div className="flex flex-col w-full">
          <Link href="/dashboard" className="w-full" onClick={close}>
            <div
              className={cn(
                "flex items-center relative rounded-lg transition-colors",
                "px-1 py-2 w-full justify-start gap-2 hover:bg-slate-700/40",
              )}
            >
              <LayoutDashboardIcon height="0.85rem" width="0.85rem" stroke="currentColor" />
              <span>Dashboard</span>
            </div>
          </Link>
          <div
            onClick={(): void => {
              close?.();
              logout();
            }}
            className={cn(
              "flex items-center relative rounded-lg transition-colors",
              "px-1 py-2 w-full justify-start gap-2 cursor-pointer",
              "border border-1 border-transparent hover:bg-slate-700/40",
            )}
          >
            <LogOut height="0.85rem" width="0.85rem" />
            <span>Disconnect</span>
          </div>
        </div>
      </Card.Footer>
    </Card.Main>
  );
};
