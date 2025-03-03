const Content: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  return (
    <div className="relative px-4 z-20 grow max-w-[1200px] w-full">
      <div className="bg-black/90 border border-gray-800 rounded-lg p-2 md:p-4 absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export default Content;
