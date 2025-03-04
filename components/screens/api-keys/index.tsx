/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import BuyBar from "@/components/api/buy-bar";
import { useCertaiBalance } from "@/hooks/useBalances";
import { roundToDecimals } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const ApiContent = (): JSX.Element => {
  const { token } = useCertaiBalance();

  const tokenBalance = roundToDecimals(token.data);

  return (
    <div className="border border-gray-800 rounded-md p-4 col-span-2">
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-row w-full justify-between flex-wrap">
          <p className="text-lg font-medium">Purchase Credits</p>
          <p>
            $CERTAI:{" "}
            <span className="font-bold">
              {token.isLoading ? "Loading..." : tokenBalance.toString()}
            </span>
          </p>
        </div>
        <p className="text-sm text-yellow-400 hidden md:block">
          API credits enable integration into your app and access to premium services and features
        </p>
        <div className="hidden md:block">
          <Link
            href="https://api.bevor.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit hover:opacity-80 block transition-opacity duration-200"
          >
            <div className="flex flex-row gap-2">
              read the docs{" "}
              <ArrowUpRight size={16} className="inline-block align-baseline" color="gray" />
            </div>
          </Link>
        </div>
      </div>
      <BuyBar />
    </div>
  );
};

export default ApiContent;
