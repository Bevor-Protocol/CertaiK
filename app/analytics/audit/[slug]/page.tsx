import { certaikApiAction } from "@/actions";
import authService from "@/actions/auth/auth.service";
import Wrapper from "@/components/content";
import { Content } from "@/components/screens/audit";
import { LoadWaifu } from "@/components/ui/loader";
import { Suspense } from "react";

const Audit = async ({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> => {
  const audit = await certaikApiAction.getAudit((await params).slug);
  const user = await authService.currentUser();

  return <Content audit={audit} address={user?.address ?? ""} />;
};

export default function AuditPage({ params }: { params: Promise<{ slug: string }> }): JSX.Element {
  return (
    <Wrapper className="bg-black/90 border-t border-gray-800">
      <Suspense fallback={<LoadWaifu />}>
        <Audit params={params} />
      </Suspense>
    </Wrapper>
  );
}
