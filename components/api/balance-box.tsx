"use client";

import abiJSON from "@/abis/APICredits.json";
import { useApiCredits, useCertaiBalance } from "@/hooks/useBalances";
import { useEffect, useState } from "react";
import { useWatchContractEvent } from "wagmi";

export default function BalanceBox({ balanceChange }: { balanceChange: number }) {
  const [certaiBalance, setCertaiBalance] = useState<string>("0");
  const [apiCredits, setApiCredits] = useState<string>("0");

  const certaiBalanceInitial = useCertaiBalance();
  const apiCreditsInitial = useApiCredits();

  const updateBalances = () => {
    setCertaiBalance(certaiBalanceInitial);
    setApiCredits(apiCreditsInitial);
  };

  useEffect(() => {
    updateBalances();
  }, [certaiBalanceInitial, apiCreditsInitial, certaiBalance]);

  const certaiBalanceStr = certaiBalance?.toString();
  const apiCreditsStr = apiCredits?.toString();

  const handleCreditsPurchased = (log: any) => {
    // Extract relevant data from the log
    const { args } = log;
    // Update your application state or UI
    console.log("Credits purchased:", args);

    // Update balances after credits are purchased
    updateBalances();
  };

  const contractAddress = process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS;

  useWatchContractEvent({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    eventName: 'CreditsPurchased',
    onLogs(log: any) {
      console.log(log)
      handleCreditsPurchased(log);
    },
  });

  // Create dynamic padding based on the maximum length
  const certaiPadding = '\u00A0'.repeat(19 - (certaiBalanceStr?.length || 0));
  const apiCreditsPadding = '\u00A0'.repeat(23 - (apiCreditsStr?.length || 0));

  return (
    <div className="text-green-400 font-mono">
      <div className="hidden sm:block">+-------------------------------------------+</div>
      <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">| Your $CERTAI Balance: {(parseFloat(certaiBalanceStr) - balanceChange).toString()}{certaiPadding} |</div>
      <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">| Your API Credits: {(parseFloat(apiCreditsStr) + balanceChange).toString()}{apiCreditsPadding} |</div>
      <div className="hidden sm:block">+-------------------------------------------+</div>
    </div>
  );
}
