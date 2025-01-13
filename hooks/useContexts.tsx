import { ModalContext } from "@/providers/modal";
import { SiweContext } from "@/providers/siwe";
import { WebSocketContext, WebSocketContextType } from "@/providers/websocket";
import { ModalStateI, SiweStateI } from "@/utils/types";
import { useContext } from "react";

export const useWs = (): WebSocketContextType => useContext(WebSocketContext);

export const useSiwe = (): SiweStateI => useContext(SiweContext);

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
