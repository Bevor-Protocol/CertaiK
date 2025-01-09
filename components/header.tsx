"use client";

import { useModal } from "@/hooks/useContexts";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";
import NavBar from "./nav-bar";
import { Button } from "./ui/button";
import { Wallets, Web3Network, Web3Profile } from "./Web3";

const Header: React.FC = () => {
  const { show } = useModal();
  const { address } = useAccount();

  const handleWalletModal = (): void => {
    show(<Wallets />);
  };

  return (
    <header className="w-full flex justify-center items-center text-white absolute top-0 px-4 left-0 z-[100]">
      <div className="w-full max-w-[1200px] p-4 flex justify-between items-center">
        <Link
          className="cursor-pointer max-w-fit block"
          href="https://www.certaik.xyz"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
        </Link>
        <NavBar className="md:flex hidden" />
        <div className="gap-2 items-center relative flex">
          {!!address ? (
            <>
              <Web3Network />
              <Web3Profile address={address} />
            </>
          ) : (
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
