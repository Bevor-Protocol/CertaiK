import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center text-white absolute top-0 px-4 left-0 z-[999]">
      <div className="w-full max-w-[1200px] p-4">
        <Link
          className="cursor-pointer max-w-fit block"
          href="https://www.certaik.xyz"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
