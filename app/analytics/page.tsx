import { certaikApiAction } from "@/actions";
import { cn } from "@/lib/utils";
import { trimAddress } from "@/utils/helpers";
import Link from "next/link";
import { Suspense } from "react";

const Skeleton = (): JSX.Element => {
  return (
    <div className="w-full flex-col">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse my-2 w-full" />
      ))}
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
            <div className="p-4 text-left basis-3/12">{trimAddress(audit.user_id)}</div>
            <div className="p-4 text-left basis-1/12">{audit.audit_type}</div>
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
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4 flex-col max-w-[1200px] max-h-[600px]",
            "w-full h-full",
          )}
        >
          <div className="border-gray-800 flex">
            <div className="text-left p-4 basis-1/12">#</div>
            <div className="text-left p-4 basis-3/12">User</div>
            <div className="text-left p-4 basis-1/12">Type</div>
            <div className="text-left p-4 basis-1/12">Status</div>
            <div className="text-left p-4 basis-2/12">Method</div>
            <div className="text-left p-4 basis-3/12">Contract Address</div>
            <div className="text-left p-4 basis-1/12">Network</div>
          </div>
          <Suspense fallback={<Skeleton />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
