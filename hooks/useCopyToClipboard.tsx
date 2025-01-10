import { useState } from "react";

export const useCopyToClipboard = (): {
  isCopied: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copy: (toCopy: any) => void;
} => {
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copy = (toCopy: any): void => {
    setCopied(true);
    navigator.clipboard.writeText(toCopy);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return {
    isCopied: copied,
    copy,
  };
};
