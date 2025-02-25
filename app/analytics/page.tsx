import { certaikApiAction } from "@/actions";
import Content from "@/components/content";
import TimeSeriesPlot from "@/components/screens/analytics/plot";
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
    <>
      <div
        className={cn(
          "size-full gap-4",
          "grid md:grid-cols-4 md:grid-rows-[min-content,min-content,min-content,1fr]",
          "grid-cols-2 grid-rows-[min-content,min-content,min-content,min-content,1fr]",
        )}
      >
        <MetricCard title="Total Users" Icon={BarChart3} stat={data.n_users} />
        <MetricCard title="Registered Apps" Icon={BarChart3} stat={data.n_apps} />
        <MetricCard title="Audits Requested" Icon={BarChart3} stat={data.n_audits} />
        <MetricCard title="Smart Contracts" Icon={BarChart3} stat={data.n_contracts} />
        <div className="border border-gray-800 rounded-md p-2 md:p-3 lg:p-4 col-span-2">
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
        <div className="border border-gray-800 rounded-md p-2 md:p-3 lg:p-4 col-span-2">
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
        <TimeSeriesPlot data={data.audits_timeseries} title="# audits" />
        <TimeSeriesPlot data={data.users_timeseries} title="# users" />
        <div className="col-span-full mt-auto">
          <Link href="/analytics/history">
            <Button variant="bright" className="w-full">
              See All Audits
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default function AnalyticsPage(): JSX.Element {
  return (
    <Content>
      <Suspense fallback={<LoadWaifu />}>
        <Stats />
      </Suspense>
    </Content>
  );
}
