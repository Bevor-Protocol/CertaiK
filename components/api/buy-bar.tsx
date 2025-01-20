import abiJSON from "@/abis/APICredits.json";
import AdminTools from "@/components/admin-tools";
import { Button } from "@/components/ui/button";
import { useCertaiBalance } from "@/hooks/useBalances";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { getNetworkImage } from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { parseUnits } from "ethers/utils";
import { useEffect, useRef, useState } from "react";
import { erc20Abi, type Log } from "viem";
import { useAccount, useSimulateContract, useWatchContractEvent, useWriteContract } from "wagmi";

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;
const contractAddress = process.env.NEXT_PUBLIC_CREDIT_CONTRACT_ADDRESS as `0x${string}`;

const BuyBar = (): JSX.Element => {
  const isMobile = useIsMobile();
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<"purchase" | "refund" | "approve" | null>(null);
  const [signState, setSignState] = useState<"sign" | "loading" | "error" | "success" | null>();
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { address, chain } = useAccount();
  const { supported } = getNetworkImage(chain);

  const { token, credit, deposit, allowance, promotion } = useCertaiBalance();

  const { writeContract: buyWriteContract } = useWriteContract({
    mutation: {
      onMutate: () => setSignState("sign"),
      onSuccess: () => setSignState("loading"),
      onError: () => setSignState("error"),
    },
  });
  const { writeContract: refundWriteContract } = useWriteContract({
    mutation: {
      onMutate: () => setSignState("sign"),
      onSuccess: () => setSignState("loading"),
      onError: () => setSignState("error"),
    },
  });
  const { writeContract: approveWriteContract } = useWriteContract({
    mutation: {
      onMutate: () => setSignState("sign"),
      onSuccess: () => setSignState("loading"),
      onError: () => setSignState("error"),
    },
  });

  useEffect(() => {
    const disabled = signState === "sign" || signState === "loading" || amount > token.data;
    if (!disabled && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [signState, amount, token.data, isMobile]);

  const { data: buyData } = useSimulateContract({
    address: contractAddress,
    abi: abiJSON.abi,
    functionName: "purchaseCredits",
    args: [parseUnits(amount.toString(), 18)], // TODO: CHANGE BACK TO 18 FOR MAINNET
  });

  const { data: refundData } = useSimulateContract({
    address: contractAddress,
    abi: abiJSON.abi,
    functionName: "refundDeposit",
    args: [parseUnits(amount.toString(), 18)], // TODO: CHANGE BACK TO 18 FOR MAINNET
  });

  const { data: approveData } = useSimulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [
      contractAddress,
      // Infinite approval in bigint
      BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
    ],
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: abiJSON.abi,
    eventName: "CreditsPurchased",
    onLogs(log: Log[]) {
      console.log(log);
      queryClient.invalidateQueries({
        queryKey: credit.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: token.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: deposit.queryKey,
      });
      setSignState("success");
      setAmount(0);
    },
    onError(error: Error) {
      setSignState("error");
      console.error("Error occurred in CreditsPurchased:", error);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: abiJSON.abi,
    eventName: "CreditsRefunded",
    onLogs(log: Log[]) {
      console.log(log);
      queryClient.invalidateQueries({
        queryKey: credit.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: token.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: deposit.queryKey,
      });
      setSignState("success");
      setAmount(0);
    },
    onError(error: Error) {
      setSignState("error");
      console.error("Error occurred in CreditsRefunded:", error);
    },
  });

  useWatchContractEvent({
    address: tokenAddress,
    abi: erc20Abi,
    eventName: "Approval",
    onLogs(log: Log[]) {
      console.log("APPROVAL LOG", log);
      queryClient.invalidateQueries({
        queryKey: allowance.queryKey,
      });
      setSignState("success");
    },
    onError(error: Error) {
      setSignState("error");
      console.error("Error occurred in CreditsRefunded:", error);
    },
  });

  const handleApprove = async (): Promise<void> => {
    console.log(approveData);
    if (approveData && approveData.request) {
      setMethod("approve");
      console.log("Approving CERTAI tokens");
      setSignState("sign");
      approveWriteContract(approveData.request);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAmount(Number(e.target.value));
  };

  const handleBuy = (): void => {
    console.log(buyData);

    if (buyData && buyData.request) {
      setMethod("purchase");
      console.log("Buying credits");
      buyWriteContract(buyData.request);
    }
  };

  const handleRefund = (): void => {
    console.log(refundData);
    if (refundData && refundData.request) {
      setMethod("refund");
      refundWriteContract(refundData.request);
    }
  };

  return (
    <>
      {!address ? (
        <p className="text-white mt-2 font-mono">Connect wallet to purchase credits...</p>
      ) : !supported ? (
        <p className="text-white mt-2 font-mono">Change network to purchase credits...</p>
      ) : (
        <>
          {allowance.data === 0 || allowance.isLoading ? (
            <Button
              variant="bright"
              onClick={handleApprove}
              disabled={allowance.isLoading || signState === "sign" || signState === "loading"}
              className={cn(
                "transition-transform duration-500",
                allowance.isLoading && "animate-pulse",
              )}
            >
              {allowance.isLoading
                ? "Loading..."
                : signState === "sign"
                  ? "Signing..."
                  : signState === "loading"
                    ? "Approving..."
                    : "Approve to purchase credits"}
            </Button>
          ) : (
            <>
              <p className="text-white mt-2 font-mono">
                <span className="text-blue-400 font-bold">
                  {promotion.data ? amount * promotion.data : amount}
                </span>{" "}
                credits [includes{" "}
                <span className="text-green-400 font-bold">
                  {promotion.data ? amount * promotion.data - amount : 0}
                </span>{" "}
                bonus credits!]
                {signState === "success" && method === "purchase" && (
                  <span className="text-green-400 text-bold">
                    &nbsp;Credit Purchase Successful!
                  </span>
                )}
                {signState === "success" && method === "refund" && (
                  <span className="text-green-400 text-bold">&nbsp;Credit Refund Successful!</span>
                )}
              </p>
              <div
                className="flex w-full items-center justify-between font-mono flex-wrap"
                style={{ gap: "2rem" }}
              >
                <div className="flex max-w-full">
                  <span className="text-green-400 mr-2">{">"}</span>
                  <input
                    ref={inputRef}
                    id="quantity"
                    type="number"
                    value={amount === 0 ? "" : amount}
                    onChange={handleChange}
                    disabled={signState === "loading" || signState === "sign"}
                    className={cn(
                      "flex-1 bg-transparent border-none outline-none w-[270px] max-w-[70%]",
                      "text-white font-mono",
                      "placeholder:text-gray-500",
                      "caret-green-400 appearance-none",
                      signState === "loading" ||
                        (signState === "sign" && "cursor-not-allowed opacity-50"),
                    )}
                    placeholder={token.isLoading ? "Loading $CERTAI balance..." : "Input amount"}
                  />
                  <label htmlFor="quantity" className="text-white">
                    $CERTAI
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="bright"
                    disabled={
                      signState === "loading" ||
                      signState === "sign" ||
                      amount === 0 ||
                      amount > token.data
                    }
                    onClick={handleBuy}
                  >
                    <span
                      className={cn(
                        "transition-transform duration-500",
                        method === "purchase" &&
                          (signState === "loading" || signState === "sign") &&
                          "animate-pulse",
                      )}
                    >
                      {method === "purchase" && signState === "sign"
                        ? "Signing..."
                        : method === "purchase" && signState === "loading"
                          ? "Buying..."
                          : "Buy"}
                    </span>
                  </Button>
                  <Button
                    variant="bright"
                    disabled={
                      signState === "loading" ||
                      signState === "sign" ||
                      amount === 0 ||
                      amount > deposit.data
                    }
                    onClick={handleRefund}
                  >
                    <span
                      className={cn(
                        "transition-transform duration-500",
                        method === "refund" &&
                          (signState === "loading" || signState === "sign") &&
                          "animate-pulse",
                      )}
                    >
                      {method === "refund" && signState === "sign"
                        ? "Signing..."
                        : method === "refund" && signState === "loading"
                          ? "Refunding..."
                          : "Refund"}
                    </span>
                  </Button>
                  <AdminTools />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default BuyBar;
