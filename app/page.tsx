"use client";

import AuditTypeStep from "@/components/terminal/steps/audit_type";
import InitialStep from "@/components/terminal/steps/initial";
import AddressStep from "@/components/terminal/steps/input_address";
import PasteStep from "@/components/terminal/steps/input_paste";
import UploadStep from "@/components/terminal/steps/input_upload";
import ResultsStep from "@/components/terminal/steps/results";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stepText } from "@/utils/constants";
import { TerminalStep } from "@/utils/enums";
import { initialState } from "@/utils/initialStates";
import { MessageType } from "@/utils/types";
import { useState } from "react";

const TerminalAuditPage: React.FC = () => {
  const [terminalStep, setTerminalStep] = useState<TerminalStep>(TerminalStep.INITIAL);
  const [contractContent, setContractContent] = useState<string>("");
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
      setContractContent("");
    }
  };

  return (
    <main className="h-svh w-screen bg-black text-white z-1">
      <div className="relative px-4 py-24 z-20 size-full flex flex-col items-center justify-center">
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4",
            "flex flex-row w-full h-full max-w-[1200px] max-h-[600px]",
          )}
        >
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
                setContractContent={setContractContent}
              />
            )}
            {terminalStep == TerminalStep.INPUT_UPLOAD && (
              <UploadStep
                setTerminalStep={handleGlobalStep}
                handleGlobalState={handleGlobalState}
                state={terminalState[TerminalStep.INPUT_UPLOAD]}
                setContractContent={setContractContent}
              />
            )}
            {terminalStep == TerminalStep.INPUT_PASTE && (
              <PasteStep
                setTerminalStep={handleGlobalStep}
                handleGlobalState={handleGlobalState}
                state={terminalState[TerminalStep.INPUT_PASTE]}
                setContractContent={setContractContent}
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
            {terminalStep == TerminalStep.RESULTS && (
              <ResultsStep
                state={terminalState[TerminalStep.RESULTS]}
                setAuditContent={setAuditContent}
                auditContent={auditContent}
                contractContent={contractContent}
                promptType={promptType}
              />
            )}
          </div>
          <div
            className={cn(
              "hidden flex-col z-1 justify-between gap-1 border-l-[1px]",
              "border-l-gray-500 pl-2 ml-2 md:flex",
            )}
          >
            <div className="z-10">
              <div className="text-gray-500 z-1">Go back to:</div>
              {stack.map((s) => (
                <div
                  key={s}
                  className={cn(
                    "relative w-fit z-1",
                    s !== terminalStep && "cursor-pointer hover:opacity-80 transition-opacity z-0",
                    s === terminalStep && "cursor-default pointer-events-none opacity-80 z-0",
                  )}
                  onClick={() => handleRewind(s)}
                >
                  {stepText[s]}
                  {s === terminalStep && (
                    <div
                      className={cn(
                        "absolute -right-4 top-1/2 -translate-y-1/2 bg-green-500",
                        "w-1 h-1 z-1 rounded-full",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div
              className={cn(
                "flex justify-start cursor-pointer w-full max-w-[900px]",
                terminalStep === TerminalStep.RESULTS && auditContent ? "visible" : "invisible",
              )}
            >
              <Button onClick={handleDownload} variant="bright" className="w-fit" type="submit">
                Download Report
              </Button>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "flex justify-start cursor-pointer w-full max-w-[900px] mt-2",
            terminalStep === TerminalStep.RESULTS && auditContent ? "visible" : "invisible",
            "md:hidden",
          )}
        >
          <Button onClick={handleDownload} variant="bright" className="w-fit" type="submit">
            Download Report
          </Button>
        </div>
      </div>
    </main>
  );
};

export default TerminalAuditPage;
