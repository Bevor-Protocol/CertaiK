import { certaikApiAction } from "@/actions";
import { cn } from "@/lib/utils";
import { Message, TerminalStep } from "@/utils/enums";
import { ContractResponseI, MessageType } from "@/utils/types";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setTerminalStep: (step: TerminalStep) => void;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  setContractId: Dispatch<SetStateAction<string>>;
  state: MessageType[];
};

const AddressStep = ({
  setTerminalStep,
  handleGlobalState,
  setContractId,
  state,
}: TerminalProps): JSX.Element => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<MessageType[]>(state);
  const [candidates, setCandidates] = useState<ContractResponseI["candidates"]>([]);

  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleScan = (): void => {
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

    setInput("");
    setLoading(true);
    const address = encodeURIComponent(input);

    certaikApiAction
      .uploadSourceCode({ address })
      .then((result) => {
        if (!result) {
          throw new Error("bad response");
        }
        const { candidates, exists, exact_match } = result;
        if (!exists) {
          setHistory((prev) => [
            ...prev,
            {
              type: Message.ERROR,
              content:
                "Address was found, but it appears to not be validated.\
 Try uploading the source code directly.",
            },
          ]);
        } else if (!exact_match) {
          setCandidates(candidates);
          const networks = candidates.map((candidate) => candidate.network);
          setHistory((prev) => [
            ...prev,
            {
              type: Message.SYSTEM,
              content: `Found contract on multiple networks. \
Please select one by entering its number:
${networks.map((network, i) => `${i + 1}. ${network}`).join("\n")}`,
            },
          ]);
          setStep(1);
        } else {
          const candidate = candidates[0];
          setContractId(candidate.id);
          setHistory((prev) => [
            ...prev,
            {
              type: Message.ASSISTANT,
              content: candidate.source_code,
            },
            {
              type: Message.SYSTEM,
              content: "Does this look right? (y/n)",
            },
          ]);
          setStep(2);
        }
      })
      .catch((error) => {
        console.log(error);
        setHistory((prev) => [
          ...prev,
          {
            type: Message.ERROR,
            content: "Something went wrong",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const handleNetwork = (): void => {
    if (!input) return;

    const inputNum = Number(input);
    if (isNaN(inputNum) || !Number.isInteger(inputNum)) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.SYSTEM,
          content: "Please enter a valid number",
        },
      ]);
      return;
    }

    if (inputNum > candidates.length) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.SYSTEM,
          content: "Not a valid input, try again...",
        },
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.USER,
          content: candidates[inputNum - 1].network,
        },
        {
          type: Message.ASSISTANT,
          content: candidates[inputNum - 1].source_code,
        },
        {
          type: Message.SYSTEM,
          content: "Does this look right? (y/n)",
        },
      ]);
      setContractId(candidates[inputNum - 1].id);
      setInput("");
      setStep(2);
    }
  };

  const handleSubmit = (e: FormEvent): void => {
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
      handleScan();
    } else if (step === 1) {
      handleNetwork();
    } else {
      handleValidate();
    }
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
        overrideLoading={loading}
      />
    </>
  );
};

export default AddressStep;
