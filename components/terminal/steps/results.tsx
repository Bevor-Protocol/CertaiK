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
};

type ValidWsSteps =
  | "generating_candidates"
  | "generating_judgements"
  | "generating_report"
  | "done"
  | "error";

const ResultsStep = ({
  setAuditContent,
  promptType,
  auditContent,
  state,
  contractId,
}: TerminalProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [jobId, setJobId] = useState("");
  const [steps, setSteps] = useState<ValidWsSteps[]>([]);
  const { setOnMessageHandler, sendMessage, isConnected, reconnect } = useWs();

  useEffect(() => {
    if (!jobId) return;
    if (steps.includes("done")) {
      certaikApiAction
        .getAudit(jobId)
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
  }, [steps, jobId]);

  useEffect(() => {
    setOnMessageHandler((data: any): void => {
      setSteps((prev) => [...prev, data.step]);
      if (data.step === "done") {
        setAuditContent(JSON.stringify(data.result));
        setIsLoading(false);
      }
      if (data.step === "error") {
        setIsError(true);
        setIsLoading(false);
      }
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
        setJobId(id);
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
        {!isConnected && <p className="">we're having issues connecting to the server</p>}
        {(isLoading || !auditContent || isError) && (
          <>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-center">
                <p>{step}</p>
                {i < steps.length - 1 ? (
                  <Check />
                ) : isError ? (
                  <X />
                ) : (
                  <Loader className="h-4 w-4" />
                )}
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
