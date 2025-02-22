import { certaikApiAction } from "@/actions";
import Content from "@/components/content";
import ApiContent from "@/components/screens/api-keys";
import { ApiKeyManagement, AppManagement } from "@/components/screens/dashboard";
import { LoadWaifu } from "@/components/ui/loader";
import MetricCard from "@/components/ui/metric-card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CreditsCard from "../components/CreditsCard";

const Dashboard = async (): Promise<JSX.Element> => {
  const user = await certaikApiAction.getUserInfo();

  return (
    <div
      className={cn(
        "grid gap-4 size-full md:grid-cols-4 md:grid-rows-[min-content,min-content,1fr]",
        "grid-cols-2 grid-rows-[min-content,min-content,min-content,min-content,1fr]",
        "relative",
      )}
    >
      <MetricCard title="Total Audits" Icon={BarChart3} stat={user.n_audits}>
        <Link href={`/analytics/history?user_address=${user.user.address}`} className="text-sm">
          View <ArrowUpRight size={16} className="inline-block align-baseline" color="gray" />
        </Link>
      </MetricCard>
      <MetricCard title="Unique Contracts" Icon={BarChart3} stat={user.n_contracts} />
      <CreditsCard />
      <ApiKeyManagement userAuth={user.auth} />
      <AppManagement userApp={user.app} />
      <div className="col-span-full h-full">
        <ApiContent />
      </div>
    </div>
  );
};

export default function DashboardPage(): JSX.Element {
  return (
    <Content>
      <Suspense fallback={<LoadWaifu />}>
        <Dashboard />
      </Suspense>
    </Content>
  );
}
