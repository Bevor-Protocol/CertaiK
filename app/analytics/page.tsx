import { certaikApiAction } from "@/actions";
import { LoadWaifu } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { trimAddress } from "@/utils/helpers";
import Link from "next/link";
import { Suspense } from "react";

const Stats = async (): Promise<JSX.Element> => {
  const data = await certaikApiAction.getStats();

  return (
    <div className="flex w-full justify-between gap-8 p-6 bg-black/90 border border-gray-800 rounded-lg mb-8">
      <div className="space-y-4">
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
          <p className="text-gray-400 text-sm">Unique Contracts</p>
          <p className="text-2xl font-bold">{data.n_contracts}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-gray-800 pb-2">Gas Optimizations</h3>
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
  );
};

const Content = async (): Promise<JSX.Element> => {
  const data = await certaikApiAction.getAudits();
  return (
    <div>
      {data.results.map((audit, ind) => (
        <Link
          key={audit.id}
          href={`/audit/${audit.id}`}
          className="border-t border-gray-800 hover:bg-gray-900 cursor-pointer block"
        >
          <div className="w-full flex">
            <div className="p-4 text-left basis-1/12">{ind}</div>
            <div className="p-4 text-left basis-2/12">{trimAddress(audit.user_id)}</div>
            <div className="p-4 text-left basis-2/12">{audit.audit_type}</div>
            <div className="p-4 text-left basis-1/12">{audit.results_status}</div>
            <div className="p-4 text-left basis-2/12">{audit.contract.method}</div>
            <div className="p-4 text-left basis-3/12">{trimAddress(audit.contract.address)}</div>
            <div className="p-4 text-left basis-1/12">{audit.contract.network}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default function AnalyticsPage(): JSX.Element {
  return (
    <main className="h-screen w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 flex flex-col items-center justify-center size-full">
        <Stats />
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4 flex-col max-w-[1200px] max-h-[600px]",
            "w-full h-full font-mono",
          )}
        >
          <div className="border-gray-800 flex">
            <div className="text-left p-4 basis-1/12">#</div>
            <div className="text-left p-4 basis-2/12">User</div>
            <div className="text-left p-4 basis-2/12">Audit Type</div>
            <div className="text-left p-4 basis-1/12">Status</div>
            <div className="text-left p-4 basis-2/12">Contract Method</div>
            <div className="text-left p-4 basis-3/12">Contract Address</div>
            <div className="text-left p-4 basis-1/12">Network</div>
          </div>
          <Suspense fallback={<LoadWaifu />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
