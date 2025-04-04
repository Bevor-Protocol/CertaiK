import { certaikApiAction, cookieDaoAction } from "@/actions";
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
  agent = false,
}: TerminalProps & { agent?: boolean }): JSX.Element => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
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

  const handleFetchSecurityScore = async (input: string): Promise<void> => {
    if (!agent) return;
    cookieDaoAction
      .getAgentSecurityScore(input)
      .then((result) => {
        if (!result) {
          throw new Error("bad response");
        }
        return handleScan(result);
      })
      .catch((error) => {
        console.error("Error fetching security score:", error);
      });
  };

  const handleScan = async (securityScore: number): Promise<void> => {
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

    setInput("");
    setLoading(true);

    try {
      let address = input;

      if (agent) {
        console.log("Fetching agent address for handle:", input);
        const response = await cookieDaoAction.getAgentByTwitterHandle(input);
        address = response.address;
      }

      // Check if Solana address (base58 encoded, 32-44 chars)
      const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);

      if (isSolanaAddress) {
        // For Solana addresses, only show security score

        setHistory((prev) => [
          ...prev,
          {
            type: Message.ASSISTANT,
            content: `\n========================================

Agent Security Score: ${securityScore}/100

Powered by Cookie DAO 🍪

========================================`,
          },
        ]);
        return;
      }

      address = encodeURIComponent(address);
      const result = await certaikApiAction.uploadSourceCode({ address });

      if (!result) {
        throw new Error("bad response");
      }

      const { contract, exists } = result;

      if (!exists || !contract) {
        setHistory((prev) => [
          ...prev,
          {
            type: Message.ERROR,
            content:
              "Address was found, but it appears to not be validated.\
 Try uploading the source code directly.",
          },
        ]);
      } else {
        setContractId(contract.id);

        setHistory((prev) => [
          ...prev,
          {
            type: Message.ASSISTANT,
            content: contract.code,
          },
          ...(agent
            ? [
                {
                  type: Message.ASSISTANT,
                  content: `\n========================================
Agent Security Score: ${securityScore}/100
Powered by Cookie DAO 🍪
========================================`,
                },
              ]
            : []),
          {
            type: Message.SYSTEM,
            content: "Does this look right? (y/n)",
          },
        ]);
        setStep(1);
      }
    } catch (error) {
      console.log(error);
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Contract not found",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = (): void => {
    if (!input) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Not a valid address, try again...",
        },
      ]);
      setInput("");
      return;
    }
    const l = input[0].toLowerCase();
    switch (l) {
      case "y": {
        setInput("");
        handleGlobalState(TerminalStep.INPUT_ADDRESS, history);
        setTerminalStep(TerminalStep.AUDIT_TYPE);
        break;
      }
      case "n": {
        setInput("");
        setStep(0);
        setHistory((prev) => [
          ...prev,
          {
            type: Message.SYSTEM,
            content: "Okay, let's try again. Input a smart contract address",
          },
        ]);
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
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (step === 0 || step === 2) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.USER,
          content: input,
        },
      ]);
    }
    if (step === 0) {
      await handleFetchSecurityScore(input);
    } else {
      handleValidate();
    }
  };

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {history.map((message, i) => (
          <div
            key={`${i}`}
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
        overrideLoading={loading}
      />
    </>
  );
};

export default AgentStep;
