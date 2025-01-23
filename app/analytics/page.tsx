import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { LoadWaifu } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

const Stats = async (): Promise<JSX.Element> => {
  const data = await certaikApiAction.getStats();

  return (
    <div
      className={cn(
        "flex w-full justify-between gap-8 p-6 bg-black/90",
        "border border-gray-800 rounded-lg mb-8",
      )}
    >
      <div>
        <Link href="/analytics/history">
          <Button variant="dark">See Requests</Button>
        </Link>
      </div>
      <div className="flex divide-x-2 *:px-4 divide-gray-400">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{data.n_users}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-sm">Registered Apps</p>
            <p className="text-2xl font-bold">{data.n_apps}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-sm">Audit Requests</p>
            <p className="text-2xl font-bold">{data.n_audits}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-sm">Unique Contracts Observed</p>
            <p className="text-2xl font-bold">{data.n_contracts}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-800 pb-2">
              Gas Optimizations
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-red-500 text-sm">Critical</p>
                <p className="text-2xl font-bold">{data.findings.gas.critical}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-orange-500 text-sm">High</p>
                <p className="text-2xl font-bold">{data.findings.gas.high}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-yellow-500 text-sm">Low</p>
                <p className="text-2xl font-bold">{data.findings.gas.low}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-800 pb-2">Security</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-red-500 text-sm">Critical</p>
                <p className="text-2xl font-bold">{data.findings.security.critical || 0}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-orange-500 text-sm">High</p>
                <p className="text-2xl font-bold">{data.findings.security.high || 0}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-yellow-500 text-sm">Low</p>
                <p className="text-2xl font-bold">{data.findings.security.low || 0}</p>
              </div>
            </div>
          </div>
        </div>
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
