import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";
import NavBar from "./nav-bar";
import { Button } from "./ui/button";
import { Wallets, Web3Network } from "./Web3";

const Header: React.FC = () => {
  const { show } = useModal();
  const { address } = useAccount();

  const handleWalletModal = (): void => {
    console.log("clicked");
    show(<Wallets />);
  };

  return (
    <header className="w-full flex justify-center items-center text-white absolute top-0 px-4 left-0 z-[100]">
      <div className="w-full max-w-[1200px] p-4 flex justify-between">
        <Link
          className="cursor-pointer max-w-fit block hidden sm:block"
          href="https://www.certaik.xyz"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
        </Link>
        <NavBar />
        <div className="gap-2 items-center relative flex">
          {!!address ? (
            <>
              <Web3Network />
              {/* <Web3Profile address={address} /> */}
              <Button variant="dark">{`${address.slice(0, 4)}...${address.slice(-3)}`}</Button>
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
