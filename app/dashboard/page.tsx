import { certaikApiAction } from "@/actions";
import Content from "@/components/content";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/ui/metric-card";
import { cn, prettyDate } from "@/lib/utils";
import { trimAddress } from "@/utils/helpers";
import { ArrowUpRight, BarChart3, DollarSign } from "lucide-react";
import Link from "next/link";

const Dashboard = async (): Promise<JSX.Element> => {
  const user = await certaikApiAction.getUserInfo();

  return (
    <Content>
      <div
        className={cn(
          "grid gap-4 size-full md:grid-cols-4 md:grid-rows-[min-content,min-content,1fr]",
          "grid-cols-2 grid-rows-[min-content,min-content,min-content,min-content,1fr]",
        )}
      >
        <MetricCard title="Total Audits" Icon={BarChart3} stat={user.audits.length} />
        <MetricCard title="Unique Contracts" Icon={BarChart3} stat={user.n_contracts} />
        <MetricCard title="Total Credits" Icon={DollarSign} stat={user.audits.length} />
        <MetricCard title="Remaining Credits" Icon={DollarSign} stat={user.audits.length}>
          <Link href="/api-keys" className="text-sm">
            Get More <ArrowUpRight size={16} className="inline-block align-baseline" color="gray" />
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
        <div className="flex flex-col items-center col-span-full">
          {user.audits && !user.audits.length ? (
            <>
              <h3 className="my-4">no recent audits</h3>
              <Link href="/" className="fit-content">
                <Button variant="bright">Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="my-4 hidden md:block">my recent audits</h3>
              <div className="hidden md:flex gap-4 w-full justify-start max-w-full overflow-x-scroll pb-2">
                {user.audits.slice(0, 5).map((audit) => (
                  <Link
                    key={audit.id}
                    href={`/analytics/audit/${audit.id}`}
                    className={cn(
                      "border border-gray-800 rounded-md p-4",
                      "hover:bg-gray-900 transition-colors min-w-52",
                    )}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center gap-10 whitespace-nowrap">
                        <p className="font-medium">{audit.audit_type}</p>
                        <p className="text-sm text-gray-400">{prettyDate(audit.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Method: {audit.contract.method}</p>
                        <p className="text-sm text-gray-400">
                          Network: {audit.contract.network || "N/A"}
                        </p>
                        <p className="text-sm text-gray-400">
                          Contract:{" "}
                          {audit.contract.address ? trimAddress(audit.contract.address) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-auto md:mt-8 w-full md:w-fit">
                <Link href={`/analytics/history?user_id=${user.user.address}`} className="w-fit">
                  <Button variant="bright" className="w-full md:w-fit">
                    View My Audits
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Content>
  );
};

export default Dashboard;
