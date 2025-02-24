import { useEffect, useState } from "react";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768 || window.innerHeight <= 800); // Adjust breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobileDevice = /android|iphone|ipad|ipod|blackberry|windows phone/i.test(
      userAgent.toLowerCase(),
    );
    setIsMobile(isMobileDevice);
  }, []);

  return isMobile;
};
