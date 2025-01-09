"use client";
import { Register, useAccount, useSwitchChain } from "wagmi";

import * as Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChainPresets } from "@/utils/constants";
import { Check } from "lucide-react";
import { Icon } from "../ui/icon";

const Networks = ({ close }: { close?: () => void }): JSX.Element => {
  const { chain: currentChain } = useAccount();
  const { chains, switchChain } = useSwitchChain({
    mutation: {
      onSettled: close,
    },
  });

  return (
    <Card.Main
      className={cn("text-sm min-w-44 shadow", "divide-gray-200/10 divide-y divide-solid")}
    >
      <div className="flex flex-col px-2 py-2 gap-2">
        <p className="text-white/60 pl-2">Select Network:</p>
        {chains.map((chain) => (
          <div
            className={cn(
              "flex items-center relative rounded-lg transition-colors",
              "justify-start gap-2 pl-2 pr-6 py-1",
              currentChain?.id != chain.id ? "cursor-pointer hover:bg-slate-700/40" : "opacity-75",
            )}
            key={chain.id}
            onClick={(): void =>
              switchChain({ chainId: chain.id as Register["config"]["chains"][number]["id"] })
            }
          >
            <Icon
              size="sm"
              image={ChainPresets[chain && chain.id in ChainPresets ? chain.id : 84531]}
              className={cn(
                currentChain?.id == chain.id && "opacity-disable",
                chain.name === "baseGoerli" && "!bg-auto",
              )}
            />
            <span
              className={cn("whitespace-nowrap", currentChain?.id == chain.id && "opacity-disable")}
            >
              {chain.name}
            </span>
            {currentChain?.id == chain.id && (
              <Check
                height="1rem"
                width="1rem"
                className="absolute right-0 fill-primary-light-50"
              />
            )}
          </div>
        ))}
      </div>
    </Card.Main>
  );
};

export default Networks;
