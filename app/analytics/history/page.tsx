import { certaikApiAction } from "@/actions";
import AuditsSearch from "@/components/screens/history";
import { Button } from "@/components/ui/button";
import { LoadWaifu } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { trimAddress } from "@/utils/helpers";
import Link from "next/link";
import { Suspense } from "react";

const Content = async ({
  filters,
}: {
  filters?: { [key: string]: string };
}): Promise<JSX.Element> => {
  const data = await certaikApiAction.getAudits(filters || {});
  return (
    <div className="flex flex-col flex-grow justify-between">
      <div>
        {data.results.map((audit, ind) => (
          <Link
            key={audit.id}
            href={`/audit/${audit.id}`}
            className="border-t border-gray-800 hover:bg-gray-900 cursor-pointer block"
          >
            <div className="w-full flex *:p-2 *:text-center">
              <div className="basis-[10%]">{ind + 1}</div>
              <div className="basis-[20%]">{trimAddress(audit.user_id)}</div>
              <div className="basis-[20%]">{audit.audit_type}</div>
              <div className="basis-[20%]">{audit.contract.method}</div>
              <div className="basis-[20%]">
                {audit.contract.address ? trimAddress(audit.contract.address) : "N/A"}
              </div>
              <div className="basis-[10%]">{audit.contract.network || "N/A"}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center pt-4 mt-4">
        <div className="flex items-center gap-4">
          <Button disabled={false} variant="transparent">
            ←
          </Button>
          <span className="text-sm text-gray-400">Page 1</span>
          <Button disabled={!data.more} variant="transparent">
            →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<JSX.Element> => {
  const queryParams = await searchParams;
  return (
    <main className="h-svh w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 flex flex-col items-center justify-center size-full">
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg",
            "p-4 flex-col max-w-[1200px] max-h-[600px]",
            "w-full h-full font-mono",
          )}
        >
          <div className="flex gap-4 h-full">
            <AuditsSearch />
            <div className="flex-grow flex flex-col">
              <div className="border-gray-800 flex *:text-center *:pb-2">
                <div className="basis-[10%]">#</div>
                <div className="basis-[20%]">User</div>
                <div className="basis-[20%]">Type</div>
                <div className="basis-[20%]">Method</div>
                <div className="basis-[20%]">Address</div>
                <div className="basis-[10%]">Network</div>
              </div>
              <Suspense fallback={<LoadWaifu />}>
                <Content filters={queryParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
