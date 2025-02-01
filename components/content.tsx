import { headers } from "next/headers";

const Blocking = (): JSX.Element => {
  return <h3>connect your wallet and sign in with ethereum to view this content</h3>;
};

const Content: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  // Doing this via the middleware allows us to manage this on a per-route basis.
  const headersList = await headers();
  const requireSign = headersList.get("x-require-sign") === "true";

  return (
    <div className="relative px-4 z-20 flex-grow max-w-[1200px] w-full">
      {requireSign ? (
        <Blocking />
      ) : (
        // absolutely positioning this contrains the height to within the flex-grow,
        // without explicitly needing to set the max-height
        <div className="bg-black/90 border border-gray-800 rounded-lg p-4 absolute inset-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default Content;
