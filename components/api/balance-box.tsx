"use client";

import { useCertaiBalance } from "@/hooks/useBalances";

const BalanceBox = (): JSX.Element => {
  // Create dynamic padding based on the maximum length
  const { token, credit } = useCertaiBalance();

  const tokenPadding = "\u00A0".repeat(
    19 - (token.isLoading ? "loading...".length : String(token.data).length),
  );
  const creditPadding = "\u00A0".repeat(
    23 - (credit.isLoading ? "loading...".length : String(credit.data)?.length),
  );

  return (
    <div className="text-green-400 font-mono">
      <div className="sm:inline-block hidden">
        <div>+-------------------------------------------+</div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your $CERTAI Balance: {(token.isLoading ? "loading..." : token.data).toString()}
          {tokenPadding} |
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          | Your API Credits: {(credit.isLoading ? "loading..." : credit.data).toString()}
          {creditPadding} |
        </div>
        <div>+-------------------------------------------+</div>
      </div>
      <div className="sm:hidden inline-block">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your $CERTAI Balance:
          {(token.isLoading ? "loading..." : token.data).toString()}
        </div>
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          Your API Credits: {(credit.isLoading ? "loading..." : credit.data).toString()}
        </div>
      </div>
    </div>
  );
};

export default BalanceBox;
