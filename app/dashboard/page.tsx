import { certaikApiAction } from "@/actions";
import { Table } from "@/components/screens/history";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/ui/metric-card";
import { cn } from "@/lib/utils";
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
            "flex flex-col w-full h-full max-w-[1200px] max-h-[600px] gap-10",
          )}
        >
          <div className="flex w-full justify-between *:flex-grow *:basis-1 *:p-4 gap-4">
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
          </div>
          <div className="flex w-full justify-between *:flex-grow *:basis-1 gap-4">
            <div className="border border-gray-800 rounded-md p-4">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-medium">API Key Management</p>
                <p className="text-sm text-gray-400">Manage your API key</p>
                <Button variant="transparent" disabled className="py-1 px-5 w-fit mt-4">
                  {user.auth.exists ? "regenerate api key" : "generate api key"}
                </Button>
              </div>
            </div>
            <div className="border border-gray-800 rounded-md p-4">
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
          </div>
          <div className="flex-grow flex flex-col items-center">
            {user.audits && !user.audits.length ? (
              <>
                <h3 className="my-4">no recent audits</h3>
                <Link href="/" className="fit-content">
                  <Button variant="bright">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <h3>Recent Audits</h3>
                <div className="flex flex-col justify-between overflow-x-hidden flex-grow">
                  <div className="flex flex-col overflow-x-scroll w-full">
                    <div
                      className={cn(
                        "grid grid-cols-9 border-gray-800 min-w-[600px]",
                        " *:text-center *:pb-2 *:text-sm *:md:text-md",
                      )}
                    >
                      <div className="col-span-1">#</div>
                      <div className="col-span-2">User</div>
                      <div className="col-span-1">Type</div>
                      <div className="col-span-1">Method</div>
                      <div className="col-span-2">Address</div>
                      <div className="col-span-1">Network</div>
                      <div className="col-span-1">Created</div>
                    </div>
                    <Table results={user.audits} />
                  </div>
                </div>
                <div className="m-auto">
                  <Link
                    href={`/analytics/history?user_id=${user.user.address}`}
                    className="fit-content"
                  >
                    <Button variant="bright">View Audit History</Button>
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
