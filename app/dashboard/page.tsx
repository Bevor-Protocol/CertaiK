import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/ui/metric-card";
import { cn, prettyDate } from "@/lib/utils";
import { BarChart3, DollarSign } from "lucide-react";
import Link from "next/link";

const Dashboard = async (): Promise<JSX.Element> => {
  const user = await certaikApiAction.getUserInfo();

  return (
    <main className="h-svh w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 flex flex-col items-center justify-center size-full">
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4",
            "w-full h-full max-w-[1200px] max-h-[600px] gap-4",
            "grid grid-cols-4 grid-rows-[min-content,min-content,1fr]",
          )}
        >
          <MetricCard title="Total Audits" Icon={BarChart3} stat={user.audits.length} />
          <MetricCard title="Unique Contracts" Icon={BarChart3} stat={user.n_contracts} />
          <MetricCard title="Total Credits" Icon={DollarSign} stat={user.audits.length} />
          <MetricCard title="Remaining Credits" Icon={DollarSign} stat={user.audits.length}>
            <Link href="/api-keys">
              <Button variant="transparent" className="py-1 px-5">
                Get More
              </Button>
            </Link>
          </MetricCard>
          <div className="border border-gray-800 rounded-md p-4 col-span-2">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium">API Key Management</p>
              <p className="text-sm text-gray-400">Manage your API key</p>
              <Button variant="transparent" disabled className="py-1 px-5 w-fit mt-4">
                {user.auth.exists ? "regenerate api key" : "generate api key"}
              </Button>
            </div>
          </div>
          <div className="border border-gray-800 rounded-md p-4 col-span-2">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium">Registered Application</p>
              <p className="text-sm text-gray-400">Information about your registered app</p>
              {user.app.exists ? (
                <p className="mt-2">
                  <span className="text-gray-400">App Name: </span>
                  <span className="font-medium">{user.app.name}</span>
                </p>
              ) : (
                <p className="mt-2 text-gray-400">No registered app exists</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center col-span-4">
            {user.audits && !user.audits.length ? (
              <>
                <h3 className="my-4">no recent audits</h3>
                <Link href="/" className="fit-content">
                  <Button variant="bright">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <h3 className="my-4">my recent audits</h3>
                <div className="flex gap-4 w-full justify-start">
                  {user.audits.slice(0, 5).map((audit, i) => (
                    <Link
                      key={audit.id}
                      href={`/analytics/audit/${audit.id}`}
                      className="border border-gray-800 rounded-md p-4 hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center gap-10">
                          <p className="font-medium">{audit.audit_type}</p>
                          <p className="text-sm text-gray-400">{prettyDate(audit.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Method: {audit.contract.method}</p>
                          <p className="text-sm text-gray-400">
                            Network: {audit.contract.network || "N/A"}
                          </p>
                          <p className="text-sm text-gray-400">
                            Contract: {audit.contract.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href={`/analytics/history?user_id=${user.user.address}`}
                    className="fit-content"
                  >
                    <Button variant="bright">View All Audits</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
