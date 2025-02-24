import Wrapper from "@/components/content";
import { AuditsSearch, Content } from "@/components/screens/history";

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<JSX.Element> => {
  const queryParams = await searchParams;
  return (
    <Wrapper>
      <div className="flex gap-4 h-full font-mono">
        <AuditsSearch query={queryParams} />
        <Content query={queryParams} />
      </div>
    </Wrapper>
  );
};

export default HistoryPage;
