const Content: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  return (
    <div className="relative z-20 grow w-full overflow-hidden">
      <div className="bg-black/90 p-2 md:p-4 size-full overflow-hidden">{children}</div>
    </div>
  );
};

export default Content;
