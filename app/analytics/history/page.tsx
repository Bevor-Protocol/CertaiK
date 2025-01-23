import { AuditsSearch, Content } from "@/components/screens/history";
import { cn } from "@/lib/utils";

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
            <AuditsSearch className="mt-8" query={queryParams} />
            <div className="flex-grow flex flex-col">
              <div className="border-gray-800 flex *:text-center *:pb-2">
                <div className="basis-[5%]">#</div>
                <div className="basis-[25%]">User</div>
                <div className="basis-[10%]">Type</div>
                <div className="basis-[10%]">Method</div>
                <div className="basis-[25%]">Address</div>
                <div className="basis-[10%]">Network</div>
                <div className="basis-[15%]">Created</div>
              </div>
              <Content query={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
