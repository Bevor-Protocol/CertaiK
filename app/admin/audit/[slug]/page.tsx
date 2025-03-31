import { certaikApiAction } from "@/actions";
import Content from "@/components/content";
import AdminAuditPanel from "@/components/screens/admin/audit";
import { redirect } from "next/navigation";

const AdminAuditPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> => {
  const isAdmin = await certaikApiAction.isAdmin();
  if (!isAdmin) {
    redirect("/terminal");
  }

  const audit = await certaikApiAction.getAuditWithChildren((await params).slug);

  return (
    <Content className="bg-black/90">
      <AdminAuditPanel audit={audit} />
    </Content>
  );
};

export default AdminAuditPage;
