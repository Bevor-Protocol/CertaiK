"use client";

import MetricCard from "@/components/ui/metric-card";
import { useCertaiBalance } from "@/hooks/useBalances";
import { ArrowUpRight, DollarSign } from "lucide-react";
import Link from "next/link";

const CreditsCard = (): JSX.Element => {
  const { credit } = useCertaiBalance();

  return (
    <>
      <MetricCard title="Total Credits" Icon={DollarSign} stat={credit.data} />
      <MetricCard title="Remaining Credits" Icon={DollarSign} stat={credit.data}>
        <Link href="/api-keys" className="text-sm">
          Get More <ArrowUpRight size={16} className="inline-block align-baseline" color="gray" />
        </Link>
      </MetricCard>
    </>
  );
};

export default CreditsCard;
