"use client";

import MetricCard from "@/components/ui/metric-card";
import { useCertaiBalance } from "@/hooks/useBalances";
import { DollarSign } from "lucide-react";

const CreditsCard = ({ remainingCredits }: { remainingCredits: number }): JSX.Element => {
  const { credit } = useCertaiBalance();

  return (
    <>
      <MetricCard title="Total Credits" Icon={DollarSign} stat={credit.data} />
      <MetricCard title="Remaining Credits" Icon={DollarSign} stat={remainingCredits} />
    </>
  );
};

export default CreditsCard;
