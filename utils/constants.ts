import { TerminalStep } from "./enums";

export const stepText = {
  [TerminalStep.INITIAL]: "audit method",
  [TerminalStep.INPUT_ADDRESS]: "audit address",
  [TerminalStep.INPUT_PASTE]: "paste audit",
  [TerminalStep.INPUT_UPLOAD]: "upload audit",
  [TerminalStep.AUDIT_TYPE]: "audit type",
  [TerminalStep.RESULTS]: "results",
};

export const iconSizeMapper: Record<string, Record<string, string>> = {
  xs: {
    desktop: "20px",
    mobile: "20px",
  },
  sm: {
    desktop: "25px",
    mobile: "25px",
  },
  md: {
    desktop: "30px",
    mobile: "25px",
  },
  lg: {
    desktop: "75px",
    mobile: "60px",
  },
  xl: {
    desktop: "90px",
    mobile: "75px",
  },
  xxl: {
    desktop: "120px",
    mobile: "90px",
  },
};

export const ChainPresets: Record<number, string> = {
  // Base
  8453: "/base.svg",
  // Sepolia
  11155111: "/base.svg",
  // Localhost
  1337: "/unknown.svg",
  // anvil
  31337: "/unknown.svg",
  // Default
  99999: "/unknown.svg",
};
