/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import BalanceBox from "@/components/api/balance-box";
import BuyBar from "@/components/api/buy-bar";
import { useCertaiBalance } from "@/hooks/useBalances";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SimplePage(): JSX.Element {
  const [inputValue, setInputValue] = useState("");

  const { certaiBalance, creditBalance, curPromotion, depositBalance, isLoading } = useCertaiBalance();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Placeholder logic for form submission
    console.log("Form submitted with input:", inputValue);
  };

  return (
    <main className="h-screen w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 size-full flex flex-col items-center justify-center">
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4",
            "flex flex-row w-full h-full max-w-[1200px] max-h-[600px]",
          )}
        >
          <div className="flex flex-col w-full h-full flex-1 no-scrollbar">
            <div className="flex flex-col items-start w-full font-mono text-sm flex-1">
              <div className="text-blue-400">Welcome to the CertaiK API!</div>
              <div className="text-blue-400 my-2">
                The presale is live and you can receive{" "}
                <span className="font-bold text-green-400">1.25x</span> in API credits from your
                purchase! Buyers will be heavily rewarded for participating in the pre-sale but
                credits are fully refundable before the API launches.
              </div>
              <div className="text-yellow-400 my-2">
                * API credits enable integration into your app and access to premium services and
                features *
              </div>
              <BalanceBox
                curBalance={certaiBalance}
                curCredit={creditBalance}
                curDeposit={depositBalance}
                isLoading={isLoading}
              />
              {/* <CoinAscii /> */}
              {/* <WaifuAscii/> */}
            </div>
            <BuyBar curBalance={certaiBalance} curCredit={creditBalance} curDeposit={depositBalance} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
