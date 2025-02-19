import { cn } from "@/lib/utils";
import { Message, TerminalStep } from "@/utils/enums";
import { MessageType } from "@/utils/types";
import { FormEvent, useEffect, useRef, useState } from "react";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setTerminalStep: (step: TerminalStep) => void;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  state: MessageType[];
};

const InitialStep = ({ setTerminalStep, handleGlobalState, state }: TerminalProps): JSX.Element => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<MessageType[]>(state);

  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    switch (input) {
      case "1": {
        handleGlobalState(TerminalStep.INITIAL, history);
        setTerminalStep(TerminalStep.INPUT_ADDRESS);
        break;
      }
      case "2": {
        handleGlobalState(TerminalStep.INITIAL, history);
        setTerminalStep(TerminalStep.INPUT_UPLOAD);
        break;
      }
      case "3": {
        handleGlobalState(TerminalStep.INITIAL, history);
        setTerminalStep(TerminalStep.INPUT_PASTE);
        break;
      }
      // case "4": {
      //   handleGlobalState(TerminalStep.INITIAL, history);
      //   setTerminalStep(TerminalStep.INPUT_AGENT);
      //   break;
      // }
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

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        <div className="sm:inline-block hidden text-white mb-4">
          <div>+--------------------------------------------------+</div>
          <div className="w-full">| Welcome to BevorAI {"\u00A0".repeat(30)}|</div>
          <div>| I&apos;m an AI agent for smart contract auditing {"\u00A0".repeat(4)} |</div>
          <div>+--------------------------------------------------+</div>
        </div>
        <div className="sm:hidden inline-block text-white mb-4">
          <div className="w-full">Welcome to BevorAI</div>
          <div className="w-full">I&apos;m an AI agent for smart contract auditing</div>
        </div>
        {history.map((message, i) => (
          <div
            key={i}
            className={cn(
              "mb-2 leading-relaxed whitespace-pre-wrap",
              message.type === Message.SYSTEM && "text-blue-400",
              message.type === Message.USER && "text-green-400",
              message.type === Message.ERROR && "text-red-400",
            )}
          >
            {message.type === Message.USER && "> "}
            {message.content}
          </div>
        ))}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        value={input}
        onChange={(value: string) => setInput(value)}
        disabled={false}
      />
    </>
  );
};

export default InitialStep;
