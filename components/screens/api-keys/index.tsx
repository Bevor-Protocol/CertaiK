/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import BalanceBox from "@/components/api/balance-box";
import BuyBar from "@/components/api/buy-bar";
import { useCertaiBalance } from "@/hooks/useBalances";

const ApiContent = (): JSX.Element => {
  const { promotion } = useCertaiBalance();

  return (
    <div className="flex flex-col w-full h-full flex-1 no-scrollbar">
      <div className="flex flex-col items-start w-full font-mono text-sm flex-1">
        <div className="text-blue-400">Welcome to the BevorAI API!</div>
        <div className="text-blue-400 my-2">
          The presale is live and you can receive{" "}
          <span className="font-bold text-green-400">{promotion.data}x</span> in API credits from
          your purchase! Buyers will be heavily rewarded for participating in the pre-sale but
          credits are fully refundable before the API launches.
        </div>
        <div className="text-yellow-400 my-2">
          * API credits enable integration into your app and access to premium services and features
          *
        </div>
        <BalanceBox />
      </div>
      <BuyBar />
    </div>
  );
};

export default ApiContent;
