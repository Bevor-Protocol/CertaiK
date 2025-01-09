"use client";

import BalanceBox from "@/components/api/balance-box";
import BuyBar from "@/components/api/buy-bar";
import CoinAscii from "@/components/api/coin-ascii";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export default function SimplePage() {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [balanceChange, setBalanceChange] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic for form submission
    console.log("Form submitted with input:", inputValue);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="h-screen w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 size-full flex flex-col items-center justify-center">
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4",
            "flex flex-row w-full h-full max-w-[1200px] max-h-[600px]"
          )}
        >
          <div className="flex flex-col w-full h-full flex-1 no-scrollbar">
            <div className="flex flex-col items-start w-full font-mono text-sm">
              <div className="text-blue-400">
                Welcome to the CertaiK API!
              </div>
              <div className="text-blue-400">
                The presale is live and you can receive <span className="font-bold text-green-400">1.25x</span> in API credits from your purchase!
              </div>
              <div className="text-blue-400">
                Buyers will be heavily rewarded for participating in the pre-sale but 
                credits are fully refundable before the API launches. 
              </div>
              <div className="text-yellow-400">
                * API credits allow you to access our premium services and features. *
              </div>
              <BalanceBox balanceChange={balanceChange} />
              <CoinAscii/> 
            {/* <WaifuAscii/> */}
            </div>
            <BuyBar setBalanceChange={setBalanceChange} balanceChange={balanceChange} />
          </div>
        </div>
      </div>
    </main>
  );
}