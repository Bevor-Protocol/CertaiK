"use client";

export default function BalanceBox({
  curBalance,
  curCredit,
  //curDeposit,
  newDepositAmount,
  curPromotion,
  isLoading,
}: {
  curBalance?: string | undefined;
  curCredit?: string | undefined;
  curDeposit?: string | undefined;
  newDepositAmount?: number | undefined;
  curPromotion?: string | undefined;
  isLoading: boolean;
}): JSX.Element {
  // Create dynamic padding based on the maximum length
  console.log(curBalance, curCredit);
  //   const certaiPadding = "\u00A0".repeat(
  //     22 - (isLoading ? "loading...".length : (curBalance || "0")?.length),
  //   );
  //   const creditPadding = "\u00A0".repeat(
  //     24 - (isLoading ? "loading...".length : (curCredit || "0")?.length),
  //   );

  return (
    <div className="text-green-400 font-mono">
      <div className="sm:inline-block hidden">
        <div>+-------------------------------------------+</div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your $CERTAI Balance:{" "}
          {isLoading ? "loading..." : parseFloat(curBalance || "0") - (newDepositAmount || 0)}
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your API Credits:{" "}
          {isLoading
            ? "loading..."
            : (
                parseFloat(curCredit || "0") +
                (newDepositAmount || 0) * (parseInt(curPromotion || "0") / 100)
              ).toString()}
        </div>
        <div>+-------------------------------------------+</div>
      </div>
      <div className="sm:hidden inline-block">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your $CERTAI Balance:
          {isLoading ? "loading..." : parseFloat(curBalance || "0") - (newDepositAmount || 0)}
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your API Credits:{" "}
          {isLoading
            ? "loading..."
            : parseFloat(curCredit || "0") +
              (newDepositAmount || 0) * (parseInt(curPromotion || "0") / 100)}
        </div>
      </div>
    </div>
  );
}
