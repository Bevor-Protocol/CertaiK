"use client";

import { cn } from "@/lib/utils";
import { trimAddress } from "@/utils/helpers";
import { AuditResponseI } from "@/utils/types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export const Content = ({ audit }: { audit: AuditResponseI }): JSX.Element => {
  const [view, setView] = useState<"contract" | "audit">("audit");

  const handleToggle = (type: "contract" | "audit"): void => {
    setView(type);
  };

  return (
    <>
      <div className="flex flex-col gap-4 basis-1 mt-8 justify-between">
        <div>
          <p
            className={cn("cursor-pointer", view !== "audit" && "opacity-50")}
            onClick={() => handleToggle("audit")}
          >
            Audit Findings
          </p>
          <p
            className={cn("cursor-pointer", view !== "contract" && "opacity-50")}
            onClick={() => handleToggle("contract")}
          >
            Smart Contract Code
          </p>
        </div>
        <div>
          <div className="my-4">
            <h3 className="text-gray-400 mb-2">Contract Details</h3>
            <div className="space-y-1 *:whitespace-nowrap">
              <p>Address: {trimAddress(audit.contract.address)}</p>
              <p>Network: {audit.contract.network}</p>
            </div>
          </div>
          <div>
            <h3 className="text-gray-400 mb-2">Audit Details</h3>
            <div className="space-y-1 *:whitespace-nowrap">
              <p>Audit Type: {audit.audit.audit_type}</p>
              <p>Model: {audit.audit.model}</p>
              <p>Prompt Version (internal): {audit.audit.prompt_version}</p>
            </div>
          </div>
        </div>
      </div>
      {view === "audit" && (
        <ReactMarkdown className="overflow-scroll no-scrollbar markdown flex-grow">
          {audit.audit.result}
        </ReactMarkdown>
      )}
      {view === "contract" && (
        <pre className="overflow-scroll no-scrollbar flex-grow">{audit.contract.code}</pre>
      )}
    </>
  );
};
