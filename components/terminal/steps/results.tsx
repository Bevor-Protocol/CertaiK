import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { AuditStatusResponseI, MessageType } from "@/utils/types";
import { Check, DownloadIcon, ExternalLink, X } from "lucide-react";
import Link from "next/link";
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

const stepToTextMapper = {
  access_control: "access control findings",
  control_flow: "control flow findings",
  data_handling: "data handling findings",
  economic: "economic-related findings",
  logic: "logic flaw findings",
  math: "mathematical findings",
  gas_optimization_1: "gas optimization 1st pass",
  gas_optimization_2: "gas optimization 2nd pass",
  gas_optimization_3: "gas optimization 3rd pass",
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
  const [isReady, setIsReady] = useState(false);
  const [steps, setSteps] = useState<AuditStatusResponseI["steps"]>([]);

  useEffect(() => {
    if (!auditId || !isReady) return;
    certaikApiAction
      .getAudit(auditId)
      .then((result) => {
        if (result.status === "success") {
          setAuditContent(result.result);
        } else {
          setIsError(true);
        }
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, auditId, isReady]);

  useEffect(() => {
    if (!auditId) return;

    const interval = setInterval(async () => {
      try {
        const result = await certaikApiAction.getAuditStatus(auditId);
        setSteps(result.steps);

        if (result.status === "success") {
          clearInterval(interval);
          setIsReady(true);
        }
        if (result.status === "failed") {
          clearInterval(interval);
          setIsError(true);
        }
      } catch (error) {
        console.error(error);
        clearInterval(interval);
        setIsError(true);
      }
      // poll every second.
    }, 1000);

    return (): void => clearInterval(interval);
  }, [auditId]);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.length || isLoading) return;
    setIsLoading(true);
    certaikApiAction
      .runEval(contractId, promptType)
      .then((result) => {
        const { id } = result;
        // websocket subscribes to job result
        setAuditId(id);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {(isLoading || !auditContent || isError) && (
          <>
            {steps.map((step) => (
              <div key={step.step} className="flex gap-4 items-center">
                <p>{stepToTextMapper[step.step as keyof typeof stepToTextMapper]}</p>
                {step.status === "processing" && <Loader className="h-4 w-4" />}
                {step.status === "success" && <Check />}
                {step.status === "failed" && <X />}
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
      {isLoading && (
        <TerminalInputBar
          onSubmit={() => {}}
          onChange={() => {}}
          disabled={true}
          value={""}
          overrideLoading={isLoading}
          placeholder="Chat feature coming soon..."
        />
      )}
      {!isLoading && !!auditContent && <Download auditId={auditId} auditContent={auditContent} />}
    </>
  );
};

type DownloadProps = {
  auditContent?: string;
  className?: string;
  auditId: string;
};

const Download: React.FC<DownloadProps> = ({ auditContent, className, auditId }) => {
  const handleDownload = (): void => {
    if (!auditContent) return;
    const blob = new Blob([auditContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-report.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <Link href={`/analytics/audit/${auditId}`}>
        <Button variant="bright">
          <span className="text-sm">View Breakdown</span>
          <ExternalLink size={14} className="ml-1" />
        </Button>
      </Link>
      <Button onClick={handleDownload} variant="bright">
        <span className="text-sm">Download Report</span>
        <DownloadIcon size={14} className="ml-1" />
      </Button>
    </div>
  );
};

export default ResultsStep;
