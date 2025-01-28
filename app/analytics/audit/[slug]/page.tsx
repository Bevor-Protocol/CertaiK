import { certaikApiAction } from "@/actions";
import { Content } from "@/components/screens/audit";
import { cn } from "@/lib/utils";

const AuditPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> => {
  const audit = await certaikApiAction.getAudit((await params).slug);

  return (
    <main className="h-svh w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 size-full flex flex-col items-center justify-center">
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4",
            "flex flex-row w-full h-full max-w-[1200px] max-h-[600px] gap-4",
          )}
        >
          <Content audit={audit} />
        </div>
      </div>
    </main>
  );
};

export default AuditPage;
