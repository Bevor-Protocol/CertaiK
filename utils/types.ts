import { type SiweMessage } from "siwe";
import { Message } from "./enums";

export type MessageType = {
  type: Message;
  content: string;
};

export type SiweStateI = {
  isPending: boolean;
  isSuccess: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ModalContextI = {
  setOpen: React.Dispatch<React.SetStateAction<"modal" | "none">>;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

export type ModalStateI = {
  show: (content: React.ReactNode) => void;
  hide: () => void;
};

export interface SessionData {
  siwe?: SiweMessage;
  nonce?: string;
  user_id?: string;
}

export interface DropdownOption {
  name: string;
  value: string;
}
