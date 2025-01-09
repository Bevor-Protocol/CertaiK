"use client";

export default function BalanceBox({
  curBalance,
  curCredit,
  isLoading,
}: {
  curBalance: string | null;
  curCredit: string | null;
  isLoading: boolean;
}) {
  // Create dynamic padding based on the maximum length
  console.log(curBalance, curCredit);
  const certaiPadding = "\u00A0".repeat(
    19 - (isLoading ? "loading...".length : (curBalance || "0")?.length),
  );
  const creditPadding = "\u00A0".repeat(
    23 - (isLoading ? "loading...".length : (curCredit || "0")?.length),
  );

  return (
    <div className="text-green-400 font-mono">
      <div className="sm:inline-block hidden">
        <div>+-------------------------------------------+</div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your $CERTAI Balance:{" "}
          {(isLoading ? "loading..." : parseFloat(curBalance || "0")).toString()}
          {certaiPadding} |
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your API Credits: {(isLoading ? "loading..." : parseFloat(curCredit || "0")).toString()}
          {creditPadding} |
        </div>
        <div>+-------------------------------------------+</div>
      </div>
      <div className="sm:hidden inline-block">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your $CERTAI Balance:
          {(isLoading ? "loading..." : parseFloat(curBalance || "0")).toString()}
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your API Credits: {(isLoading ? "loading..." : parseFloat(curCredit || "0")).toString()}
        </div>
      </div>
    </div>
  );
}
