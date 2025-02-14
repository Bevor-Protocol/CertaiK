"use client";

import AuditTypeStep from "@/components/terminal/steps/audit_type";
import InitialStep from "@/components/terminal/steps/initial";
import AddressStep from "@/components/terminal/steps/input_address";
import AgentStep from "@/components/terminal/steps/input_agent";
import PasteStep from "@/components/terminal/steps/input_paste";
import UploadStep from "@/components/terminal/steps/input_upload";
import ResultsStep from "@/components/terminal/steps/results";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stepText } from "@/utils/constants";
import { TerminalStep } from "@/utils/enums";
import { initialState } from "@/utils/initialStates";
import { MessageType } from "@/utils/types";
import { DownloadIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const TerminalContainer: React.FC = () => {
  const [terminalStep, setTerminalStep] = useState<TerminalStep>(TerminalStep.INITIAL);
  const [contractId, setContractId] = useState("");
  const [auditId, setAuditId] = useState("");
  const [promptType, setPromptType] = useState<string>("");
  const [auditContent, setAuditContent] = useState<string>("");
  const [terminalState, setTerminalState] =
    useState<Record<TerminalStep, MessageType[]>>(initialState);
  const [stack, setStack] = useState<TerminalStep[]>([TerminalStep.INITIAL]);

  const handleGlobalStep = (step: TerminalStep): void => {
    setStack((prev) => [...prev, step]);
    setTerminalStep(step);
  };

  const handleGlobalState = (step: TerminalStep, history: MessageType[]): void => {
    setTerminalState((prev) => ({ ...prev, [step]: history }));
  };

  const handleRewind = (s: TerminalStep): void => {
    // if going back, need to reset state for proceeding steps
    const interStack = stack;
    const interState = terminalState;

    const shouldResetAudit = true; // result doesnt get added to stack for now, always true
    let shouldResetContract = false;
    let poppedElement = interStack.pop();

    while (poppedElement !== s) {
      if (
        [TerminalStep.INPUT_UPLOAD, TerminalStep.INPUT_ADDRESS, TerminalStep.INPUT_PASTE].includes(
          poppedElement as TerminalStep,
        )
      ) {
        shouldResetContract = true;
      }
      interState[poppedElement as TerminalStep] = initialState[poppedElement as TerminalStep];
      poppedElement = interStack.pop();
    }
    setTerminalState(interState);
    setStack(interStack.concat(s));
    setTerminalStep(s);
    if (shouldResetAudit) {
      setAuditContent("");
    }
    if (shouldResetContract) {
      setContractId("");
    }
  };

  return (
    <>
      <div
        className={cn(
          "block md:hidden absolute bottom-full left-0 right-0 bg-black/90",
          "border border-gray-800 rounded-lg py-2 px-4",
          "max-w-full overflow-x-scroll",
        )}
      >
        <StepsRewind stack={stack} terminalStep={terminalStep} handleRewind={handleRewind} />
      </div>
      <div className="flex flex-col md:flex-row size-full">
        <div className="flex flex-col w-full h-full flex-1 no-scrollbar">
          {terminalStep == TerminalStep.INITIAL && (
            <InitialStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INITIAL]}
            />
          )}
          {terminalStep == TerminalStep.INPUT_ADDRESS && (
            <AddressStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INPUT_ADDRESS]}
              setContractId={setContractId}
            />
          )}
          {terminalStep == TerminalStep.INPUT_UPLOAD && (
            <UploadStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INPUT_UPLOAD]}
              setContractId={setContractId}
            />
          )}
          {terminalStep == TerminalStep.INPUT_PASTE && (
            <PasteStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INPUT_PASTE]}
              setContractId={setContractId}
            />
          )}
          {terminalStep == TerminalStep.AUDIT_TYPE && (
            <AuditTypeStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.AUDIT_TYPE]}
              setPromptType={setPromptType}
            />
          )}
          {terminalStep == TerminalStep.INPUT_AGENT && (
            <AgentStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INPUT_AGENT]}
              agent={true}
              setContractId={setContractId}
            />
          )}
          {terminalStep == TerminalStep.RESULTS && (
            <ResultsStep
              state={terminalState[TerminalStep.RESULTS]}
              setAuditContent={setAuditContent}
              auditContent={auditContent}
              promptType={promptType}
              contractId={contractId}
              auditId={auditId}
              setAuditId={setAuditId}
            />
          )}
        </div>
        <StepsRewind
          stack={stack}
          terminalStep={terminalStep}
          handleRewind={handleRewind}
          className="hidden md:flex flex-col"
        >
          <Download auditId={auditId} terminalStep={terminalStep} auditContent={auditContent} />
        </StepsRewind>
      </div>
      <Download
        auditId={auditId}
        terminalStep={terminalStep}
        auditContent={auditContent}
        className="mt-2 md:hidden"
      />
    </>
  );
};

type DownloadProps = {
  terminalStep: TerminalStep;
  auditContent?: string;
  className?: string;
  auditId: string;
};

const Download: React.FC<DownloadProps> = ({ terminalStep, auditContent, className, auditId }) => {
  const handleDownload = (): void => {
    if (!(terminalStep === TerminalStep.RESULTS && auditContent)) return;
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
    <div
      className={cn(
        "flex flex-col gap-2 cursor-pointer absolute left-0 right-0 top-full md:static",
        className,
        terminalStep === TerminalStep.RESULTS && auditContent ? "visible" : "invisible",
      )}
    >
      <Link href={`/analytics/audit/${auditId}`}>
        <Button variant="bright" className="w-full">
          View Breakdown
          <ExternalLink size={14} className="ml-1" />
        </Button>
      </Link>
      <Button onClick={handleDownload} variant="bright" className="w-full">
        Download Report
        <DownloadIcon size={14} className="ml-1" />
      </Button>
    </div>
  );
};

type StepsProps = {
  children?: React.ReactNode;
  stack: TerminalStep[];
  terminalStep: TerminalStep;
  handleRewind: (step: TerminalStep) => void;
  className?: string;
};

const StepsRewind: React.FC<StepsProps> = ({
  stack,
  terminalStep,
  handleRewind,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "z-1 justify-between gap-2 md:gap-1",
        "md:border-l-gray-500 md:border-l-[1px] md:ml-2 md:pl-2",
        "border-l-0, ml-0, pl-0",
        className,
      )}
    >
      <div className="z-10 flex md:block flex-row gap-2">
        <div className="text-gray-500 z-1 hidden md:block">Go back to:</div>
        {stack.map((s) => (
          <div
            key={s}
            className={cn(
              "relative w-fit z-1 whitespace-nowrap text-sm md:text-base",
              s !== terminalStep &&
                "cursor-pointer hover:opacity-90 opacity-70 transition-opacity z-0",
              s === terminalStep && "cursor-default pointer-events-none z-0",
            )}
            onClick={() => handleRewind(s)}
          >
            {stepText[s]}
            {s === terminalStep && (
              <div
                className={cn(
                  "absolute -right-4 top-1/2 -translate-y-1/2 bg-green-500",
                  "w-1 h-1 z-1 rounded-full hidden md:block",
                )}
              />
            )}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default TerminalContainer;
