import { cn } from "@/lib/utils";
import { Message, TerminalStep } from "@/utils/enums";
import { initialState } from "@/utils/initialStates";
import { MessageType } from "@/utils/types";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setTerminalStep: (step: TerminalStep) => void;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  setPromptType: Dispatch<SetStateAction<string>>;
  state: MessageType[];
};

export function AuditTypeStep({
  setTerminalStep,
  handleGlobalState,
  setPromptType,
  state,
}: TerminalProps) {
  const [input, setInput] = useState("");
  const [step, setStep] = useState(state.length === 1 ? 0 : 1);
  const [history, setHistory] = useState<MessageType[]>(state);

  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const handlePrompt = () => {
    switch (input) {
      case "1": {
        setHistory((prev) => [
          ...prev,
          {
            type: Message.USER,
            content: "Security Audit",
          },
          {
            type: Message.SYSTEM,
            content: "Ready for your audit? (y/n)",
          },
        ]);
        setStep(1);
        setPromptType("security");
        break;
      }
      case "2": {
        setHistory((prev) => [
          ...prev,
          {
            type: Message.USER,
            content: "Gas Optimization Audit",
          },
          {
            type: Message.SYSTEM,
            content: "Ready for your audit? (y/n)",
          },
        ]);
        setStep(1);
        setPromptType("gas");
        break;
      }
      default: {
        setHistory((prev) => [
          ...prev,
          {
            type: Message.ERROR,
            content: "Invalid input, try again",
          },
        ]);
        break;
      }
    }
    setInput("");
  };

  const handleReady = () => {
    if (!input) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Not a valid input, try again...",
        },
      ]);
      setInput("");
      return;
    }
    const l = input[0].toLowerCase();
    switch (l) {
      case "y": {
        handleGlobalState(TerminalStep.AUDIT_TYPE, history);
        setTerminalStep(TerminalStep.RESULTS);
        break;
      }
      case "n": {
        setStep(0);
        setHistory((prev) => [...prev, initialState[TerminalStep.AUDIT_TYPE][0]]);
        break;
      }
      default: {
        setHistory((prev) => [
          ...prev,
          {
            type: Message.SYSTEM,
            content: "Not a valid input, try again...",
          },
        ]);
      }
    }
    setInput("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      handlePrompt();
    }
    if (step === 1) {
      handleReady();
    }
  };

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {history.map((message, i) => (
          <div
            key={i}
            className={cn(
              "mb-2 leading-relaxed whitespace-pre-line",
              message.type === Message.SYSTEM && "text-blue-400",
              message.type === Message.USER && "text-green-400",
              message.type === Message.ERROR && "text-red-400",
              message.type === Message.ASSISTANT && "text-white",
            )}
          >
            {message.type === Message.USER && "> "}
            {message.content}
          </div>
        ))}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => setInput(value)}
        value={input}
      />
    </>
  );
}
