import { certaikApiAction } from "@/actions";
import authService from "@/actions/auth/auth.service";
import Wrapper from "@/components/content";
import { Content } from "@/components/screens/audit";

const AuditPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> => {
  const audit = await certaikApiAction.getAudit((await params).slug);
  const address = await authService.currentUser();

  return (
    <Wrapper>
      <Content audit={audit} address={address} />
    </Wrapper>
  );
};

export default AuditPage;
