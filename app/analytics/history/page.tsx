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
            <AuditsSearch query={queryParams} />
            <Content query={queryParams} />
          </div>
        </div>
      </div>
    </main>
  );
};
