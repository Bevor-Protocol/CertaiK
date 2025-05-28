"use client";

import AuditTypeStep from "@/components/terminal/steps/audit_type";
import InitialStep from "@/components/terminal/steps/initial";
import AddressStep from "@/components/terminal/steps/input_address";
import FolderUploadStep from "@/components/terminal/steps/input_folder";
import PasteStep from "@/components/terminal/steps/input_paste";
import UploadStep from "@/components/terminal/steps/input_upload";
import ResultsStep from "@/components/terminal/steps/results";
import { cn } from "@/lib/utils";
import { stepText } from "@/utils/constants";
import { TerminalStep } from "@/utils/enums";
import { initialState } from "@/utils/initialStates";
import { MessageType } from "@/utils/types";
import { useState } from "react";

const TerminalContainer: React.FC = () => {
  const [terminalStep, setTerminalStep] = useState<TerminalStep>(TerminalStep.INITIAL);
  const [contractId, setContractId] = useState("");
  const [promptType, setPromptType] = useState<string>("");
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

    let shouldResetContract = false;
    let poppedElement = interStack.pop();

    while (poppedElement !== s) {
      if (
        [
          TerminalStep.INPUT_UPLOAD,
          TerminalStep.INPUT_ADDRESS,
          TerminalStep.INPUT_PASTE,
          TerminalStep.INPUT_FOLDER,
        ].includes(poppedElement as TerminalStep)
      ) {
        shouldResetContract = true;
      }
      interState[poppedElement as TerminalStep] = initialState[poppedElement as TerminalStep];
      poppedElement = interStack.pop();
    }
    setTerminalState(interState);
    setStack(interStack.concat(s));
    setTerminalStep(s);
    if (shouldResetContract) {
      setContractId("");
    }
  };

  return (
    <>
      <div className="flex flex-col size-full space-y-2">
        <div
          className={cn("border-b border-b-gray-500 py-2", "max-w-full overflow-x-scroll shrink-0")}
        >
          <StepsRewind stack={stack.slice(0, stack.length - 1)} handleRewind={handleRewind} />
        </div>
        <div className="flex flex-col w-full no-scrollbar grow overflow-scroll">
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
          {terminalStep == TerminalStep.INPUT_FOLDER && (
            <FolderUploadStep
              setTerminalStep={handleGlobalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INPUT_FOLDER]}
              setContractId={setContractId}
              contractId={contractId}
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
          {terminalStep == TerminalStep.RESULTS && (
            <ResultsStep promptType={promptType} contractId={contractId} />
          )}
        </div>
      </div>
    </>
  );
};

type StepsProps = {
  children?: React.ReactNode;
  stack: TerminalStep[];
  handleRewind: (step: TerminalStep) => void;
  className?: string;
};

const StepsRewind: React.FC<StepsProps> = ({ stack, handleRewind, children, className }) => {
  return (
    <div className={cn("z-1", className)}>
      <div className="flex flex-row gap-2 items-center">
        {stack.length > 0 && <div className="text-gray-500 z-1">Go back to:</div>}
        {stack.map((s) => (
          <div
            key={s}
            className={cn(
              "relative w-fit z-1 whitespace-nowrap text-sm md:text-base",
              "cursor-pointer hover:opacity-90 opacity-70 transition-opacity z-0",
            )}
            onClick={() => handleRewind(s)}
          >
            {stepText[s]}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default TerminalContainer;
