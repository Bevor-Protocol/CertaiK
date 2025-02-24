"use client";

import { useCertaiBalance } from "@/hooks/useBalances";
import { roundToDecimals } from "@/lib/utils";

const BalanceBox = (): JSX.Element => {
  // Create dynamic padding based on the maximum length
  const { token } = useCertaiBalance();

  const tokenBalance = roundToDecimals(token.data);

  const tokenPadding = "\u00A0".repeat(
    19 - (token.isLoading ? "loading...".length : String(tokenBalance).length),
  );

  return (
    <div className="text-green-400 font-mono">
      <div className="sm:inline-block hidden">
        <div>+-------------------------------------------+</div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your $CERTAI Balance: {(token.isLoading ? "loading..." : tokenBalance).toString()}
          {tokenPadding} |
        </div>
        <div>+-------------------------------------------+</div>
      </div>
      <div className="sm:hidden inline-block">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your $CERTAI Balance:
          {(token.isLoading ? "loading..." : tokenBalance).toString()}
        </div>
      </div>
    </div>
  );
};

export default BalanceBox;
