import { Message } from "./enums";

export type MessageType = {
  type: Message;
  content: string;
};

export type ModalContextI = {
  setOpen: React.Dispatch<React.SetStateAction<"modal" | "none">>;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

export type ModalStateI = {
  show: (content: React.ReactNode) => void;
  hide: () => void;
};
