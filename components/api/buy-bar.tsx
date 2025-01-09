import abiJSON from "@/abis/APICredits.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseUnits } from "ethers/utils";
import { useEffect, useRef, useState } from "react";
import { erc20Abi } from "viem";
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

export default function BuyBar({
  curBalance,
  curCredit,
  isLoading,
}: {
  curBalance: string | null;
  curCredit: string | null;
  isLoading: boolean;
}) {
  const [amount, setAmount] = useState(0);

  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [buying, setBuying] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_API_CREDITS_ADDRESS;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const disabled =
      buying || refunding || isLoading || amount === 0 || Number(amount) > Number(curBalance);
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [buying, refunding, curBalance]);

  const { data: buyData } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: abiJSON.abi,
    functionName: "purchaseCredits",
    args: [parseUnits(amount.toString(), 6)], // TODO: CHANGE BACK TO 18 FOR MAINNET
  });

  const { writeContract: buyWriteContract } = useWriteContract();

  const { data: refundData } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: abiJSON.abi,
    functionName: "refundDeposit",
    args: [parseUnits(amount.toString(), 6)], // TODO: CHANGE BACK TO 18 FOR MAINNET
  });

  const { writeContract: refundWriteContract } = useWriteContract();

  const certaiContractAddress = process.env.NEXT_PUBLIC_CERTAI_ADDRESS;

  const { data: approveData } = useSimulateContract({
    address: certaiContractAddress?.startsWith("0x")
      ? (certaiContractAddress as `0x${string}`)
      : undefined,
    abi: erc20Abi,
    functionName: "approve",
    args: [
      contractAddress?.startsWith("0x")
        ? (contractAddress as `0x${string}`)
        : "0x0000000000000000000000000000000000000000",
      BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), // Infinite approval in bigint
    ],
  });

  const { writeContract: approveWriteContract } = useWriteContract();

  const { address } = useAccount();

  const { data: allowanceData } = address
    ? useReadContract({
        address: certaiContractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "allowance",
        args: [
          address, // owner
          contractAddress?.startsWith("0x")
            ? (contractAddress as `0x${string}`)
            : "0x0000000000000000000000000000000000000000", // spender
        ],
      })
    : { data: undefined };

  useWatchContractEvent({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    eventName: "CreditsPurchased",
    onLogs(log: any) {
      console.log(log);
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
    } else if (buying) {
      setPurchaseSuccess(true);
    }

    setAmount(0);

    setRefunding(false);
    setBuying(false);
    // For example, you might update a state variable to reflect the new balance
  };

  useWatchContractEvent({
    address: contractAddress?.startsWith("0x") ? (contractAddress as `0x${string}`) : undefined,
    abi: abiJSON.abi,
    eventName: "Approve",
    onLogs(log: any) {
      console.log(log);
      handleApproveEvent(log);
    },
  });

  const handleApproveEvent = (log: any) => {
    // Extract relevant data from the log
    const { args } = log;
    // Update your application state or UI
    console.log("Approval complete:", args);

    console.log(amount);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
    setPurchaseSuccess(false);
    setRefundSuccess(false);
  };

  const handleBuy = () => {
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
  };

  const handleRefund = () => {
    if (refundData && refundData.request) {
      setRefunding(true);

      refundWriteContract(refundData.request);
    }
  };

  return (
    <>
      <p className="text-white mt-2 font-mono">
        <span className="text-blue-400 font-bold">{amount * 1.25}</span> credits [includes{" "}
        <span className="text-green-400 font-bold">{amount * 0.25}</span> bonus credits!]
        {purchaseSuccess && (
          <span className="text-green-400 text-bold">&nbsp;Credit Purchase Successful!</span>
        )}
        {refundSuccess && (
          <span className="text-green-400 text-bold">&nbsp;Credit Refund Successful!</span>
        )}
      </p>
      <div className="flex w-full items-center justify-between gap-y-8 gap-x-8 font-mono flex-wrap">
        <div className="flex max-w-full">
          <span className="text-green-400 mr-2">{`>`}</span>
          <input
            ref={inputRef}
            autoFocus={true}
            id="quantity"
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={handleChange}
            disabled={buying || refunding || isLoading}
            className={cn(
              "flex-1 bg-transparent border-none outline-none w-[270px] max-w-[70%]",
              "text-white font-mono",
              "placeholder:text-gray-500",
              "caret-green-400",
              buying || refunding || (isLoading && "cursor-not-allowed opacity-50"),
            )}
            placeholder={isLoading ? "Loading $CERTAI balance..." : "Input amount"}
          />
          <label htmlFor="quantity" className="text-white">
            $CERTAI
          </label>
        </div>
        <div className="flex gap-2">
          <Button
            variant="bright"
            disabled={
              buying ||
              refunding ||
              isLoading ||
              amount === 0 ||
              Number(amount) > Number(curBalance)
            }
            onClick={handleBuy}
          >
            <span
              className={`transition-transform duration-500 ${refunding ? "animate-pulse" : ""}`}
            >
              {buying ? "Buying..." : "Buy"}
            </span>
          </Button>
          <Button
            variant="bright"
            disabled={
              refunding || buying || isLoading || amount === 0 || Number(amount) > Number(curCredit)
            }
            onClick={handleRefund}
          >
            <span
              className={`transition-transform duration-500 ${refunding ? "animate-pulse" : ""}`}
            >
              {refunding ? "Refunding..." : "Refund"}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
