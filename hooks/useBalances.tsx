import abiJSON from "@/abis/APICredits.json";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";

export const useCertaiBalance = () => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const certaiContractAddress = process.env.NEXT_PUBLIC_CERTAI_ADDRESS || "0x0";

  const {
    data: certaiData,
    isLoading: isCertaiLoading,
    queryKey: certaiQueryKey,
  } = address
    ? useReadContract({
        address: certaiContractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })
    : { data: undefined, isLoading: false };

  const {
    data: creditData,
    isLoading: isCreditLoading,
    queryKey: creditQueryKey,
  } = address
    ? useReadContract({
        address: (process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS || "0x0") as `0x${string}`,
        abi: abiJSON.abi,
        functionName: "depositAmount",
        args: [address],
      })
    : { data: undefined, isLoading: false };

  const handleCreditsPurchased = (log: any) => {
    if (!certaiQueryKey || !creditQueryKey) return;
    // Extract relevant data from the log
    const { args } = log;
    // Update your application state or UI
    queryClient.invalidateQueries({
      queryKey: [creditQueryKey, certaiQueryKey],
    });
    console.log("Credits purchased:", args);
  };

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS as `0x${string}`,
    abi: abiJSON.abi,
    eventName: "CreditsPurchased",
    onLogs(log: any) {
      console.log(log);
      handleCreditsPurchased(log);
    },
  });

  const parsedBalances = useMemo(() => {
    if (!certaiData || !creditData)
      return {
        certaiBalance: null,
        creditBalance: null,
      };
    if (typeof certaiData === "bigint" && typeof creditData === "bigint") {
      return {
        certaiBalance: (certaiData / 1000000n).toString(),
        creditBalance: (creditData / 1000000n).toString(),
      };
    }
    return {
      certaiBalance: null,
      creditBalance: null,
    };
  }, [certaiData, creditData]);

  return {
    ...parsedBalances,
    isLoading: isCertaiLoading || isCreditLoading,
  };
};
