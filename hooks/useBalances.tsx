import abiJSON from "@/abis/APICredits.json";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";

export const useCertaiBalance = (): {
  certaiBalance?: string | undefined;
  creditBalance?: string | undefined;
  curPromotion?: string | undefined;
  isLoading: boolean;
} => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const certaiContractAddress = process.env.NEXT_PUBLIC_CERTAI_ADDRESS;

  const {
    data: certaiData,
    isLoading: isCertaiLoading,
    queryKey: certaiQueryKey,
  } = useReadContract({
    address: certaiContractAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  if (certaiData) {
    console.log("Certai data found:", certaiData);
    console.log("Type of certaiData:", typeof certaiData);
  }

  const {
    data: creditData,
    isLoading: isCreditLoading,
    queryKey: creditQueryKey,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS as `0x${string}`,
    abi: abiJSON.abi,
    functionName: "depositAmount",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const {
    data: curPromotion,
    isLoading: isPromotionLoading,
    queryKey: promotionQueryKey,
  } = useReadContract({
    address: (process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS || "0x0") as `0x${string}`,
    abi: abiJSON.abi,
    functionName: "promotionalCreditScalar",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const handleCreditsPurchased = (log: any): void => {
    if (!certaiQueryKey || !creditQueryKey) return;
    // Extract relevant data from the log
    const { args } = log;
    // Update your application state or UI
    queryClient.invalidateQueries({
      queryKey: [creditQueryKey, certaiQueryKey, promotionQueryKey],
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
    if (typeof certaiData === "bigint" && typeof creditData === "bigint") {
      return {
        certaiBalance: (certaiData / 1000000n).toString(),
        creditBalance: (creditData / 1000000n).toString(),
        curPromotion: curPromotion?.toString(),
      };
    }
    return {
      certaiBalance: undefined,
      creditBalance: undefined,
      curPromotion: undefined,
    };
  }, [certaiData, creditData, curPromotion]);

  return {
    ...parsedBalances,
    isLoading: ((isCertaiLoading || isCreditLoading || isPromotionLoading) && certaiData === undefined),
  };
};
