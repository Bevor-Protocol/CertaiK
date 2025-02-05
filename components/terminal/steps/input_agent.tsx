import { certaikApiAction } from "@/actions";
import { cn } from "@/lib/utils";
import { Message, TerminalStep } from "@/utils/enums";
import { MessageType } from "@/utils/types";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setTerminalStep: (step: TerminalStep) => void;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  setContractId: Dispatch<SetStateAction<string>>;
  state: MessageType[];
};

const AgentStep = ({
  setTerminalStep,
  handleGlobalState,
  setContractId,
  state,
}: TerminalProps): JSX.Element => {
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

    if (!input) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Please enter a Twitter handle or Cookie DAO agent link",
        },
      ]);
      return;
    }

    let agentId = input;

    // Handle Cookie DAO URL format
    if (input.includes("cookie.fun")) {
      const parts = input.split("/");
      agentId = parts[parts.length - 1];
    }

    // Remove @ if present in Twitter handle
    if (agentId.startsWith("@")) {
      agentId = agentId.substring(1);
    }

    certaikApiAction
      .getAgentContracts(agentId)
      .then((result) => {
        if (!result || !result.candidates?.length) {
          throw new Error("No contracts found for this agent");
        }
        const candidate = result.candidates[0];
        setContractId(candidate.id);
        handleGlobalState(TerminalStep.INPUT_AGENT, history);
        setTerminalStep(TerminalStep.AUDIT_TYPE);
        setInput("");
      })
      .catch((error) => {
        console.log(error);
        setHistory((prev) => [
          ...prev,
          {
            type: Message.ERROR,
            content: "Could not find any contracts for this agent",
          },
        ]);
      });
  };

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {history.map((message, i) => (
          <div
            key={i}
            className={cn(
              "mb-2 leading-relaxed whitespace-pre-wrap",
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
        disabled={false}
        value={input}
      />
    </>
  );
};

export default AgentStep;
