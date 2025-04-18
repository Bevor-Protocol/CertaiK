import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useChat } from "@/hooks/useContexts";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, DownloadIcon, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  promptType: string;
  contractId: string;
};

const stepToTextMapper = {
  access_control: "access control findings",
  control_flow: "control flow findings",
  data_handling: "data handling findings",
  economic: "economic-related findings",
  unsafe_logic: "logic flaw findings",
  math: "mathematical findings",
  gas_optimization_1: "gas optimization 1st pass",
  gas_optimization_2: "gas optimization 2nd pass",
  gas_optimization_3: "gas optimization 3rd pass",
  reviewer: "generating report",
};

const getReadableText = (step: string): string => {
  if (step in stepToTextMapper) {
    return stepToTextMapper[step as keyof typeof stepToTextMapper];
  }
  return "other findings";
};

const ResultsStep = ({ promptType, contractId }: TerminalProps): JSX.Element => {
  // once removed from the stack, we don't allow going back to this point, so there's
  // no need to retain a state in the parent Terminal component.
  const { setCurrentAuditId } = useChat();

  const {
    mutateAsync,
    data: evalData,
    isError: isEvalError,
    isSuccess: isEvalSuccess,
  } = useMutation({
    mutationFn: async () => certaikApiAction.runEval(contractId, promptType),
  });

  useEffect(() => {
    mutateAsync();
  }, [mutateAsync]);

  // poll for intermediate responses.
  const { data: pollingData, isError: isPollingError } = useQuery({
    queryKey: ["polling", evalData?.id],
    queryFn: async () => certaikApiAction.getAuditStatus(evalData!.id),
    refetchInterval: (query) => {
      const { data } = query.state;
      if (!data) return 1_000;
      if (["success", "failed"].includes(data.status)) {
        return false;
      }
      return 1_000;
    },
    enabled: !!evalData?.id,
  });

  // fetch the completed audit once it's ready.
  const {
    data: auditData,
    isError: isAuditError,
    isSuccess,
  } = useQuery({
    queryKey: ["audit", evalData?.id],
    queryFn: async () =>
      certaikApiAction.getAudit(evalData!.id).then((result) => {
        if (result.status === "success") {
          setCurrentAuditId(evalData!.id);
          return result.result;
        }
        throw new Error("failed audit");
      }),
    enabled: pollingData?.status === "success",
  });

  const terminalRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {!isEvalSuccess && <p>Starting audit...</p>}
        {!!pollingData && !isSuccess && (
          <>
            {pollingData?.steps.map((step) => (
              <div key={step.step} className="flex gap-4 items-center">
                <p>{getReadableText(step.step)}</p>
                {step.status === "processing" && <Loader className="h-4 w-4" />}
                {step.status === "success" && <Check />}
                {step.status === "failed" && <X />}
              </div>
            ))}
          </>
        )}
        {isSuccess && auditData && (
          <ReactMarkdown className="overflow-scroll no-scrollbar markdown">
            {auditData}
          </ReactMarkdown>
        )}
        {(isEvalError || isAuditError || isPollingError) && (
          <div className="mb-2 leading-relaxed whitespace-pre-wrap text-red-400">
            Something went wrong, try again or please reach out
          </div>
        )}
      </div>
      {!auditData && (
        <TerminalInputBar
          onSubmit={() => {}}
          onChange={() => {}}
          disabled={true}
          value={""}
          overrideLoading={!auditData}
          placeholder="Chat feature coming soon..."
        />
      )}
      {!!auditData && !!evalData && <Download auditId={evalData.id} auditContent={auditData} />}
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
