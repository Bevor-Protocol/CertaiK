import { certaikApiAction } from "@/actions";
import Content from "@/components/content";
import AdminPanel from "@/components/screens/admin";
import { redirect } from "next/navigation";

const AdminPage = async (): Promise<JSX.Element> => {
  const isAdmin = await certaikApiAction.isAdmin();
  if (!isAdmin) {
    redirect("/terminal");
  }

  return (
    <Content>
      <AdminPanel />
    </Content>
  );
};

export default AdminPage;
