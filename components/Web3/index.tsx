/* eslint-disable max-len */
"use client";

import { CoinbaseWallet, WalletConnect } from "@/assets/wallet";
import * as Card from "@/components/ui/card";
import * as Dropdown from "@/components/ui/dropdown";
import * as Tooltip from "@/components/ui/tooltip";
import { useModal } from "@/hooks/useContexts";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { walletConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { getNetworkImage, sortWallets, trimAddress } from "@/utils/helpers";
import { Check, ChevronDown, Copy, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Connector, useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import Networks from "../Dropdown/networks";
import { Icon, Social } from "../ui/icon";

export const Profile = ({
  address,
  close,
}: {
  address: string;
  close?: () => void;
}): JSX.Element => {
  const { chain, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { isCopied, copy } = useCopyToClipboard();
  // const { logout } = useSiwe();

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
          <div className="flex flex-row justify-between items-center text-xxs text-white/60 flex-nowrap">
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
          {/* <Link href={`/users/${address}`} className="w-full" onClick={close}>
            <div className="flex items-center relative rounded-lg transition-colors px-1 py-2 w-full justify-start gap-2 hover:bg-slate-700/40">
              <LayoutDashboardIcon height="0.85rem" width="0.85rem" stroke="currentColor" />
              <span>Dashboard</span>
            </div>
          </Link> */}
          <div
            onClick={(): void => {
              close?.();
              // logout();
              disconnect();
            }}
            className={cn(
              "flex items-center relative rounded-lg transition-colors",
              "px-1 py-2 w-full justify-start gap-2 cursor-pointer border",
              "border-1 border-transparent hover:bg-slate-700/40",
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
                "flex justify-center items-center gap-2 px-2 h-12 rounded-lg hover:bg-slate-700/40",
              )}
            >
              <Icon
                size="sm"
                image={networkImg}
                className={cn(
                  !supported && "!bg-auto",
                  supported && networkImg.includes("unknown") && "!bg-auto", // for localhost for now.
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
          <span className="hidden lg:inline-block">{trimAddress(address)}</span>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0" hasCloseTrigger>
        <Profile address={address} />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

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
