import abiJSON from "@/abis/APICredits.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiCredits, useCertaiBalance } from "@/hooks/useBalances";
import { parseUnits } from "ethers/utils";
import { useState } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract, useSimulateContract, useWatchContractEvent, useWriteContract } from "wagmi";

export default function BuyBar({ setBalanceChange, balanceChange }: { setBalanceChange: (value: number) => void, balanceChange: number }) {
  const [amount, setAmount] = useState(0);

  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [buying, setBuying] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS;

  const certaiAmount = useCertaiBalance();
  const apiCreditAmount = useApiCredits();

  const { data: buyData } = useSimulateContract({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    functionName: "purchaseCredits",
    args: [parseUnits(amount.toString(), 6)], // TODO: CHANGE BACK TO 18 FOR MAINNET
  });

  const { writeContract: buyWriteContract } = useWriteContract();

  const { data: refundData } = useSimulateContract({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    functionName: "refundDeposit",
    args: [parseUnits(amount.toString(), 6)], // TODO: CHANGE BACK TO 18 FOR MAINNET
  });

  const { writeContract: refundWriteContract } = useWriteContract();

  const certaiContractAddress = process.env.NEXT_PUBLIC_CERTAI_ADDRESS;

  const { data: approveData } = useSimulateContract({
    address: certaiContractAddress?.startsWith("0x") ? (certaiContractAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "approve",
    args: [
        contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : "0x0000000000000000000000000000000000000000",
        BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") // Infinite approval in bigint
      ],
  });

  const { writeContract: approveWriteContract } = useWriteContract();

  const { address } = useAccount();

  const { data: allowanceData } = address ? useReadContract({
    address: certaiContractAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [
        address, // owner
        contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : "0x0000000000000000000000000000000000000000" // spender
      ],
  }) : { data: undefined };

  useWatchContractEvent({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    eventName: 'CreditsPurchased',
    onLogs(log: any) {
      console.log(log)
      handleCreditsPurchased(log);
    },
    onError(error: any) {
      console.error("Error occurred:", error);
      setRefunding(true);
      setBuying(true);
    },
  });

  const handleCreditsPurchased = (log: any) => {
    // Extract relevant data from the log
    const { args } = log;
    // Update your application state or UI
    console.log("Credits purchased:", args);

    
    if (refunding) {
      setRefundSuccess(true);
      setBalanceChange(balanceChange - amount);
    } else if (buying) {
      setPurchaseSuccess(true);
      setBalanceChange(balanceChange + amount);
    }

    setAmount(0);

    setRefunding(false);
    setBuying(false);
    // For example, you might update a state variable to reflect the new balance
  };

  useWatchContractEvent({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    eventName: 'Approve',
    onLogs(log: any) {
      console.log(log)
      handleApproveEvent(log);
    }
  });

  const handleApproveEvent = (log: any) => {
    // Extract relevant data from the log
    const { args } = log;
    // Update your application state or UI
    console.log("Approval complete:", args);

    console.log(amount)
    if (buyData && buyData.request) {
        console.log("Buying credits");
        buyWriteContract(buyData.request);
    }
    // For example, you might update a state variable to reflect the new balance
  };

  const handleApprove = () => {
    if (approveData && approveData.request) {
      console.log("Approving CERTAI tokens");
      approveWriteContract(approveData.request);
    }
  };

  return (
    <>
        <p className="text-white mt-2 font-mono">
        <span className="text-blue-400 font-bold">{amount * 1.25}</span> credits [
            <span className="text-green-400 font-bold">+{amount * 0.25}</span> bonus credits!] 
            {purchaseSuccess && <span className="text-green-400 text-bold">&nbsp;Credit Purchase Successful!</span>}
            {refundSuccess && <span className="text-green-400 text-bold">&nbsp;Credit Refund Successful!</span>}
        </p>
        <div className="flex w-full max-w-sm items-center space-x-2 font-mono">
        <span className="text-green-400 text-lg">{`>`}</span>
        <Input
            type="number"
            id="quantity"
            value={amount}
            onChange={(e) => {setAmount(Number(e.target.value)); setPurchaseSuccess(false); setRefundSuccess(false);}}
            min="0"
            className="text-white border-white bg-black text-xs sm:text-base"
        />
        <Label htmlFor="quantity" className="text-white text-xs sm:text-base">
            $CERTAI
        </Label>
        <Button
            variant="bright"
            disabled={buying || refunding || (certaiAmount === '0' || certaiAmount === undefined) || amount === 0 || Number(amount) > Number(certaiAmount)}
            onClick={async () => {
                console.log(buyData);

                setBuying(true);

                console.log("ALLOWANCE DATA");
                console.log(allowanceData);

                if (allowanceData !== undefined && allowanceData > 0) {
                    if (buyData && buyData.request) {
                        console.log("Buying credits");
                        buyWriteContract(buyData.request);
                    }
                } else {
                    handleApprove();
                }
            }}
            className="text-xs sm:text-base"
        >
            <span className={`transition-transform duration-500 ${refunding ? 'animate-pulse' : ''}`}>
                {buying ? "Buying..." : "Buy"}
            </span>
        </Button>
        <Button
            variant="bright"
            disabled={refunding || buying || (apiCreditAmount === '0' || apiCreditAmount === undefined) || amount === 0 || Number(amount) > Number(apiCreditAmount)}
            onClick={() => {
                if (refundData && refundData.request) {
                    setRefunding(true);

                    refundWriteContract(refundData.request);
                }
            }}
            className="text-xs sm:text-base"
        >
            <span className={`transition-transform duration-500 ${refunding ? 'animate-pulse' : ''}`}>
              {refunding ? "Refunding..." : "Refund"}
            </span>
        </Button>
        </div>
        
    </>
  );
}
