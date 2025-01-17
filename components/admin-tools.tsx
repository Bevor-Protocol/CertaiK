import abiJSON from "@/abis/APICredits.json";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from "wagmi";

export default function AdminTools(): JSX.Element {
    const { address } = useAccount();
    const [withdrawing, setWithdrawing] = useState(false);
  
    const isAdmin = address?.toLowerCase() === "0x341ab3097c45588af509db745ce0823722e5fb19";
    const contractAddress = process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS;
    const tokenAddress = process.env.NEXT_PUBLIC_CERTAI_ADDRESS;
  
    const { data: contractBalance } = useReadContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [contractAddress as `0x${string}`],
      query: {
        enabled: !!contractAddress,
      },
    });
  
    const { data: withdrawData } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: abiJSON.abi,
      functionName: "withdrawTokens",
      args: [contractBalance || BigInt(0)],
    });
  
    const { data: launchData } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: abiJSON.abi,
      functionName: "launchAPI",
      args: [],
    });
  
    const { writeContract: withdrawWriteContract } = useWriteContract();
    const { writeContract: launchWriteContract } = useWriteContract();
  
    const handleWithdraw = async (): Promise<void> => {
      if (!withdrawData?.request) return;
  
      try {
        setWithdrawing(true);
        await withdrawWriteContract(withdrawData.request);
      } catch (error) {
        console.error("Withdrawal failed:", error);
      } finally {
        setWithdrawing(false);
      }
    };
  
    const handleLaunch = async (): Promise<void> => {
      if (!launchData?.request) return;
      try {
        await launchWriteContract(launchData.request);
      } catch (error) {
        console.error("Launch failed:", error);
      }
    };
    
    if (!isAdmin) {
      return <></>;
    }

    return (
      <div className="flex gap-2">
      <Button
        variant="bright"
        disabled={
          withdrawing ||
          !contractBalance ||
          (typeof contractBalance === "bigint" && contractBalance <= BigInt(0))
        }
        onClick={handleWithdraw}
      >
        <div>
          <span
            className={`transition-transform duration-500 ${withdrawing ? "animate-pulse" : ""}`}
          >
            {withdrawing ? "Withdrawing..." : "Withdraw "}
          </span>
          {contractBalance?.toString() ?? "0"}{" "}
        </div>
      </Button>

      <Button variant="bright" onClick={handleLaunch}>
        Launch API
      </Button>
    </div>
  );
}
