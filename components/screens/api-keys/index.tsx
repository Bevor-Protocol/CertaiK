/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import BalanceBox from "@/components/api/balance-box";
import BuyBar from "@/components/api/buy-bar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ApiContent = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex flex-col justify-end w-full font-mono text-sm h-full",
        isMobile && isOpen && "absolute bg-black inset-0",
      )}
    >
      {(!isMobile || isOpen) && (
        <>
          <div className="flex-1">
            <BalanceBox />
            <div className="text-yellow-400 my-2">
              * API credits enable integration into your app and access to premium services and
              features *
            </div>
          </div>
          <BuyBar />
        </>
      )}
      {isMobile && (
        <Button variant="bright" className="w-full mt-4" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Back to Dashboard" : "Get Credits"}
        </Button>
      )}
    </div>
  );
};

export default ApiContent;
