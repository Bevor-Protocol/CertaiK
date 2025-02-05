"use client";

import Networks from "@/components/Dropdown/networks";
import { Profile } from "@/components/Dropdown/profile";
import { Wallets } from "@/components/Modal/wallets";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown";
import { Icon } from "@/components/ui/icon";
import * as Tooltip from "@/components/ui/tooltip";
import { useModal } from "@/hooks/useContexts";
import { cn } from "@/lib/utils";
import { getNetworkImage, trimAddress } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

type Props = {
  address: string | null;
};

export const Web3Network = (): JSX.Element => {
  const { chain } = useAccount();
  const { supported, networkImg } = getNetworkImage(chain);

  return (
    <Dropdown.Main
      className="flex flex-row relative cursor-pointer rounded-lg focus-border"
      tabIndex={0}
    >
      <Dropdown.Trigger>
        <Tooltip.Reference shouldShow={!chain}>
          <Tooltip.Trigger>
            <div
              className={cn(
                "flex justify-center items-center gap-2 px-2",
                "h-12 rounded-lg hover:bg-slate-700/40",
              )}
            >
              <Icon
                size="sm"
                image={networkImg}
                className={cn(
                  !supported && "!bg-auto",
                  // for localhost for now.
                  supported && networkImg.includes("unknown") && "!bg-auto",
                )}
              />
              <ChevronDown />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content side="left" align="start">
            <div className="bg-black shadow rounded-lg cursor-default min-w-40">
              <div className="px-2 py-1">This is an unsupported network</div>
            </div>
          </Tooltip.Content>
        </Tooltip.Reference>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0" hasCloseTrigger>
        <Networks />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

export const Web3Profile = ({ address }: { address: string }): JSX.Element => {
  return (
    <Dropdown.Main
      className="flex flex-row relative cursor-pointer rounded-lg focus-border"
      tabIndex={0}
    >
      <Dropdown.Trigger>
        <div
          className={cn(
            "flex items-center relative cursor-pointer rounded-lg focus-border h-12",
            "hover:bg-slate-700/40 gap-2 text-sm px-2",
          )}
        >
          <Icon size="md" seed={address} />
          <span className="lg:inline-block hidden">{trimAddress(address)}</span>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0" hasCloseTrigger>
        <Profile address={address} />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

const Header: React.FC<Props> = ({ address }) => {
  const { show } = useModal();

  const handleWalletModal = (): void => {
    show(<Wallets />);
  };

  return (
    <header className="w-full text-white z-[100] relative">
      <div className="w-full max-w-[1200px] py-4 flex justify-between items-center m-auto">
        <Link
          className="cursor-pointer block relative"
          href="https://www.certaik.xyz"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <div className="block w-[175px] md:w-[200px] lg:w-[220px] aspect-[1430/498] relative">
            <Image src="/BevorAI-logo.png" alt="Logo" fill />
          </div>
        </Link>
        <NavBar className="md:flex hidden" />
        <div className="gap-2 items-center relative flex">
          {!!address && (
            <>
              <Web3Network />
              <Web3Profile address={address} />
            </>
          )}
          {!address && (
            <Button onClick={handleWalletModal} variant="bright">
              connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
