"use client";
import { ModalContext } from "@/providers/modal";
import { ModalStateI } from "@/utils/types";
import { useContext } from "react";

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
