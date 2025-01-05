"use client";

import { useModal } from "@/hooks/useContexts";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Wallets, Web3Network, Web3Profile } from "./Web3";

type Props = {
  address: string | null;
};

const Header: React.FC<Props> = ({ address }) => {
  const { show } = useModal();

  const handleWalletModal = (): void => {
    console.log("clicked");
    show(<Wallets />);
  };

  return (
    <header className="w-full flex justify-center items-center text-white absolute top-0 px-4 left-0 z-[100]">
      <div className="w-full max-w-[1200px] p-4 flex justify-between">
        <Link
          className="cursor-pointer max-w-fit block"
          href="https://www.certaik.xyz"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
        </Link>
        <div className="gap-2 items-center relative flex">
          {!!address && (
            <>
              <Web3Network />
              <Web3Profile address={address} />
            </>
          )}
          {!address && (
            <Button onClick={handleWalletModal} variant="dark">
              connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
