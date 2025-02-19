import { certaikApiAction } from "@/actions";
import { Loader } from "@/components/ui/loader";
import { useWs } from "@/hooks/useContexts";
import { MessageType } from "@/utils/types";
import { Check, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setAuditContent: Dispatch<SetStateAction<string>>;
  promptType: string;
  auditContent: string;
  state: MessageType[];
  contractId: string;
  auditId: string;
  setAuditId: Dispatch<SetStateAction<string>>;
};

type WsStep = { name: string; status: string };

const stepToTextMapper = {
  access_control: "access control findings",
  control_flow: "control flow findings",
  data_handling: "data handling findings",
  economic: "economic-related findings",
  logic: "logic flaw findings",
  math: "mathematical findings",
  report: "generating report",
};

const ResultsStep = ({
  setAuditContent,
  promptType,
  auditContent,
  state,
  contractId,
  auditId,
  setAuditId,
}: TerminalProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [steps, setSteps] = useState<WsStep[]>([]);
  const { setOnMessageHandler, sendMessage, isConnected, reconnect } = useWs();

  useEffect(() => {
    if (!auditId) return;
    const reportDone = steps.find((step) => step.name === "report" && step.status === "done");
    if (reportDone) {
      certaikApiAction
        .getAudit(auditId)
        .then((result) => {
          if (result.audit.status === "success") {
            setAuditContent(result.audit.result);
          } else {
            setIsError(true);
          }
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, auditId]);

  useEffect(() => {
    setOnMessageHandler((data: any): void => {
      setSteps((prev) => {
        const existingStepIndex = prev.findIndex((step) => step.name === data.name);
        if (existingStepIndex !== -1) {
          // Update the status of the existing step
          const updatedSteps = [...prev];
          updatedSteps[existingStepIndex] = { name: data.name, status: data.status };
          return updatedSteps;
        } else {
          // Append the new step
          return [...prev, { name: data.name, status: data.status }];
        }
      });
    });
  }, [setOnMessageHandler, setAuditContent]);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.length || isLoading) return;
    if (!isConnected) {
      reconnect();
      return;
    }
    setIsLoading(true);
    certaikApiAction
      .runEval(contractId, promptType)
      .then((result) => {
        const { id } = result;
        // websocket subscribes to job result
        setAuditId(id);
        sendMessage(`subscribe:${id}`);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isConnected]);

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {!isConnected && <p className="">we&apos;re having issues connecting to the server</p>}
        {(isLoading || !auditContent || isError) && (
          <>
            {steps.map((step) => (
              <div key={step.name} className="flex gap-4 items-center">
                <p>{stepToTextMapper[step.name as keyof typeof stepToTextMapper]}</p>
                {step.status === "start" && <Loader className="h-4 w-4" />}
                {step.status === "done" && <Check />}
                {step.status === "error" && <X />}
              </div>
            ))}
          </>
        )}
        {auditContent && (
          <ReactMarkdown className="overflow-scroll no-scrollbar markdown">
            {auditContent}
          </ReactMarkdown>
        )}
        {isError && (
          <div className="mb-2 leading-relaxed whitespace-pre-wrap text-red-400">
            Something went wrong, try again or please reach out
          </div>
        )}
      </div>
      <TerminalInputBar
        onSubmit={() => {}}
        onChange={() => {}}
        disabled={true}
        value={""}
        overrideLoading={isLoading}
        placeholder="Chat feature coming soon..."
      />
    </>
  );
};

export default ResultsStep;
