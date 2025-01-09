import abiJSON from "@/abis/APICredits.json";
import { useState } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

export const useCertaiBalance = () => {
  const { address } = useAccount();
  const [certaiBalance, setCertaiBalance] = useState<string>("0");

  const certaiContractAddress = process.env.NEXT_PUBLIC_CERTAI_ADDRESS || "0x0";

//   console.log(certaiContractAddress);
//   console.log(address);

  const { data: balanceData } = address ? useReadContract({
    address: certaiContractAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  }) : { data: undefined };

//   console.log(balanceData);

if (balanceData === undefined || balanceData === null) {
    return "0";
  } else {
    // Ensure balanceData is converted to a string before using parseUnits
    if (typeof balanceData === 'bigint') {
      return (balanceData / 1000000n).toString(); // TODO: Change to 18 ints on mainnet
    } else {
      console.error("balanceData is not of type 'bigint'");
      return "0";
    }
  }
}

export const useApiCredits = () => {
    const { address } = useAccount();
    const [certaiBalance, setCertaiBalance] = useState<string>("0");
  
    const apiCreditsContractAddress = process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS || "0x0";
  
    console.log(apiCreditsContractAddress);
    console.log(address);
  
    const { data: balanceData } = address ? useReadContract({
      address: apiCreditsContractAddress as `0x${string}`,
      abi: abiJSON.abi,
      functionName: "depositAmount",
      args: [address],
    }) : { data: undefined };
  
    console.log(balanceData);
  
    if (balanceData === undefined || balanceData === null) {
      return "0";
    } else {
      // Ensure balanceData is converted to a string before using parseUnits
      if (typeof balanceData === 'bigint') {
        return (balanceData / 1000000n).toString(); // TODO: Change to 18 ints on mainnet
      } else {
        console.error("balanceData is not of type 'bigint'");
        return "0";
      }
    }
};
