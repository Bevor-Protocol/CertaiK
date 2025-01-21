"use client";

import { useCertaiBalance } from "@/hooks/useBalances";
import { roundToDecimals } from "@/lib/utils";

const BalanceBox = (): JSX.Element => {
  // Create dynamic padding based on the maximum length
  const { token, credit } = useCertaiBalance();

  const tokenBalance = roundToDecimals(token.data);
  const creditBalance = roundToDecimals(credit.data);

  const tokenPadding = "\u00A0".repeat(
    19 - (token.isLoading ? "loading...".length : String(tokenBalance).length),
  );
  const creditPadding = "\u00A0".repeat(
    23 - (credit.isLoading ? "loading...".length : String(creditBalance)?.length),
  );

  console.log(token.data, credit.data);

  return (
    <div className="text-green-400 font-mono">
      <div className="sm:inline-block hidden">
        <div>+-------------------------------------------+</div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your $CERTAI Balance: {(token.isLoading ? "loading..." : tokenBalance).toString()}
          {tokenPadding} |
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your API Credits: {(credit.isLoading ? "loading..." : creditBalance).toString()}
          {creditPadding} |
        </div>
        <div>+-------------------------------------------+</div>
      </div>
      <div className="sm:hidden inline-block">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your $CERTAI Balance:
          {(token.isLoading ? "loading..." : tokenBalance).toString()}
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your API Credits: {(credit.isLoading ? "loading..." : creditBalance).toString()}
        </div>
      </div>
    </div>
  );
};

export default BalanceBox;
