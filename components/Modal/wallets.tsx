"use client";

import { CoinbaseWallet, WalletConnect } from "@/assets/wallet";
import { useModal } from "@/hooks/useContexts";
import walletConfig from "@/lib/config/wallet";
import { sortWallets } from "@/utils/helpers";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Connector, useConnect, useConnectors } from "wagmi";
import { Icon } from "../ui/icon";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

export const Wallets = (): JSX.Element => {
  const [recentConnector, setRecentConnector] = useState("");
  const { connectAsync } = useConnect();
  const { hide } = useModal();

  const connectors = useConnectors();

  useEffect(() => {
    const getRecent = async (): Promise<void> => {
      const recentPromise = walletConfig.storage?.getItem("recentConnectorId") || "";
      if (recentPromise) {
        setRecentConnector((await Promise.resolve(recentPromise)) || "");
      }
    };
    getRecent();
  }, []);

  const handleConnect = ({ connector }: { connector: Connector }): void => {
    connectAsync({ connector })
      .catch((error) => console.log(error))
      .finally(hide);
  };

  const walletsShow = sortWallets([...connectors], recentConnector, true);

  return (
    <div className="flex flex-col relative max-h-full">
      <div onClick={hide} className="cursor-pointer absolute top-0 right-4">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">Connect a Wallet</div>
      <div className="flex flex-col gap-2 text-left overflow-y-scroll flex-grow">
        {walletsShow.map((connector) => (
          <div
            key={connector.uid}
            onClick={(): void => handleConnect({ connector })}
            className="flex justify-start items-center rounded-lg gap-2 relative
px-2 py-1 border border-transparent transition-colors hover:bg-slate-700/40 cursor-pointer"
          >
            {connector.icon ? (
              <Icon image={connector.icon} size="sm" />
            ) : (
              <div className="h-5 w-5">{IconMapper[connector.id]}</div>
            )}
            <span className="whitespace-nowrap text-sm">{connector.name}</span>
            {recentConnector == connector.id && (
              <div className="flex bg-blue-600/50 rounded-xl px-2 py-1 h-fit">
                <span className="text-blue-600 text-xxs">recent</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
