import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { LoadWaifu } from "@/components/ui/loader";
import MetricCard from "@/components/ui/metric-card";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const Stats = async (): Promise<JSX.Element> => {
  const data = await certaikApiAction.getStats();

  return (
    <div
      className={cn(
        "bg-black/90 border border-gray-800 rounded-lg p-4",
        "w-full h-full max-w-[1200px] max-h-[600px] gap-4",
        "grid grid-cols-4 grid-rows-[min-content,min-content,1fr]",
      )}
    >
      <MetricCard title="Total Users" Icon={BarChart3} stat={data.n_users} />
      <MetricCard title="Registered Apps" Icon={BarChart3} stat={data.n_apps} />
      <MetricCard title="Audits Requested" Icon={BarChart3} stat={data.n_audits} />
      <MetricCard title="Unique Contracts Observed" Icon={BarChart3} stat={data.n_contracts} />
      <div className="border border-gray-800 rounded-md p-4 col-span-2">
        <div className="flex justify-between text-sm">
          <p className="mb-2">Gas Optimizations</p>
        </div>
        <div className="grid grid-cols-4 gap-4 *:text-center">
          <div>
            <p className="text-red-500 text-sm my-2">Critical</p>
            <p className="text-lg font-bold">{data.findings.gas.critical ?? 0}</p>
          </div>
          <div>
            <p className="text-orange-500 text-sm my-2">High</p>
            <p className="text-lg font-bold">{data.findings.gas.high ?? 0}</p>
          </div>
          <div>
            <p className="text-yellow-500 text-sm my-2">Medium</p>
            <p className="text-lg font-bold">{data.findings.gas.medium || 0}</p>
          </div>
          <div>
            <p className="text-green-500 text-sm my-2">Low</p>
            <p className="text-lg font-bold">{data.findings.gas.low ?? 0}</p>
          </div>
        </div>
      </div>
      <div className="border border-gray-800 rounded-md p-4 col-span-2">
        <div className="flex justify-between text-sm">
          <p className="mb-2">Security Vulnerabilities</p>
        </div>
        <div className="grid grid-cols-4 gap-4 *:text-center">
          <div>
            <p className="text-red-500 text-sm my-2">Critical</p>
            <p className="text-lg font-bold">{data.findings.security.critical || 0}</p>
          </div>
          <div>
            <p className="text-orange-500 text-sm my-2">High</p>
            <p className="text-lg font-bold">{data.findings.security.high || 0}</p>
          </div>
          <div>
            <p className="text-yellow-500 text-sm my-2">Medium</p>
            <p className="text-lg font-bold">{data.findings.security.medium || 0}</p>
          </div>
          <div>
            <p className="text-green-500 text-sm my-2">Low</p>
            <p className="text-lg font-bold">{data.findings.security.low || 0}</p>
          </div>
        </div>
      </div>
      <div>
        <Link href="/analytics/history">
          <Button variant="dark">See Requests</Button>
        </Link>
      </div>
    </div>
  );
};

export default function AnalyticsPage(): JSX.Element {
  return (
    <main className="h-svh w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 flex flex-col items-center justify-center size-full">
        <Suspense fallback={<LoadWaifu />}>
          <Stats />
        </Suspense>
      </div>
    </main>
  );
}
