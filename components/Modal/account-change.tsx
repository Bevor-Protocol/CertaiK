"use client";

import { useAccount } from "wagmi";

import { CoinbaseWallet, WalletConnect } from "@/assets/wallet";
import { Icon } from "@/components/ui/icon";
import { Loader } from "@/components/ui/loader";
import { useSiwe } from "@/hooks/useContexts";
import { trimAddress } from "@/utils/helpers";
import React from "react";
import { Button } from "../ui/button";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

type Props = {
  verifiedAddress: string;
};

const RequestAccountChange = ({ verifiedAddress }: Props): JSX.Element => {
  const { connector: activeConnector } = useAccount();
  const { logout, isPending } = useSiwe();

  if (!activeConnector) return <></>;

  return (
    <div className="items-center justify-center flex flex-col">
      <p className="font-bold text-xl my-4">Switch Wallet</p>
      <div className="relative h-14 w-14">
        {activeConnector.icon ? (
          <Icon
            image={activeConnector.icon}
            size="md"
            className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
        ) : (
          <div className="h-10 w-10">{IconMapper[activeConnector.id]}</div>
        )}
        {isPending && <Loader className="h-14 w-14" />}
        {!isPending && <div className="conic-full h-14 w-14 bg-green-400" />}
      </div>
      <p className="text-sm text-center mt-4">
        Switch to wallet {trimAddress(verifiedAddress)} to make it active, or logout.
      </p>
      <p className="my-2">or</p>
      <Button onClick={logout} disabled={!isPending} variant="dark">
        Log out
      </Button>
    </div>
  );
};

export default RequestAccountChange;
