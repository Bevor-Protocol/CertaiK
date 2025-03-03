import Sidebar from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="background-container">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col items-center justify-center size-full ml-14 md:ml-0 overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
