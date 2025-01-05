import { ModalContext } from "@/providers/modal";
import { SiweContext } from "@/providers/siwe";
import { WebSocketContext } from "@/providers/websocket";
import { ModalStateI } from "@/utils/types";
import { useContext } from "react";

export const useWs = () => useContext(WebSocketContext);

export const useSiwe = () => useContext(SiweContext);

export const useModal = (): ModalStateI => {
  const model = useContext(ModalContext);

  const show = (content: React.ReactNode): void => {
    model.setOpen("modal");
    model.setContent(content);
  };

  return {
    show,
    hide: () => model.setOpen("none"),
  };
};
