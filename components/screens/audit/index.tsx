"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BlockExplorerMapper } from "@/utils/constants";
import { trimAddress } from "@/utils/helpers";
import { AuditResponseI } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowUpRightFromSquareIcon,
  Info,
  MenuIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

export const Content = ({
  audit,
  address,
}: {
  audit: AuditResponseI;
  address: string | null;
}): JSX.Element => {
  const [view, setView] = useState<"contract" | "audit">("audit");
  const [showFindings, setShowFindings] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);

  const handleToggle = (type: "contract" | "audit"): void => {
    setView(type);
  };

  const getBlockExplorer = (network?: string, address?: string): string | undefined => {
    if (!network || !address) return;
    if (!(network in BlockExplorerMapper)) return;
    const explorer = BlockExplorerMapper[network as keyof typeof BlockExplorerMapper];
    return `${explorer}/address/${address}`;
  };

  const explorerUrl = getBlockExplorer(audit.contract.network, audit.contract.address);

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-4 w-full h-full">
      <div className="flex flex-col gap-2 md:mt-8 justify-between">
        <div
          className={cn(
            "flex flex-row order-2 items-center",
            "md:items-start md:flex-col md:order-1",
          )}
        >
          <div>
            <p
              className={cn(
                "cursor-pointer whitespace-nowrap",
                view !== "audit" && "opacity-50 hover:opacity-70",
              )}
              onClick={() => handleToggle("audit")}
            >
              Audit Findings
            </p>
            <p
              className={cn(
                "cursor-pointer whitespace-nowrap",
                view !== "contract" && "opacity-50 hover:opacity-70",
              )}
              onClick={() => handleToggle("contract")}
            >
              Smart Contract Code
            </p>
          </div>
          {view === "contract" && explorerUrl && (
            <Link
              href={explorerUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              className="ml-auto"
            >
              <Button variant="bright" className="w-fit my-2 md:my-0">
                view onchain
                <ArrowUpRightFromSquareIcon size={10} className="ml-2" />
              </Button>
            </Link>
          )}
          {audit.findings.length && view === "audit" && (
            <Button
              variant="bright"
              className="w-fit my-0 md:my-2 ml-auto md:ml-0 text-sm md:text-md relative"
              onClick={() => setShowFindings(!showFindings)}
            >
              {showFindings ? "view report" : "view breakdown"}
            </Button>
          )}
        </div>
        <div
          className={cn(
            "flex order-1 justify-between flex-row gap-4 border-b border-b-gray-600 pb-4",
            "md:order-2 md:border-none md:flex-col md:pb-0",
          )}
        >
          <div className="text-sm md:text-md">
            <h3 className="text-gray-400 mb-2 hidden md:block">Contract Details</h3>
            <div className="space-y-1 *:whitespace-nowrap">
              <p>
                Address:{" "}
                {audit.contract.address ? trimAddress(audit.contract.address) : "Not Provided"}
              </p>
              <p>Network: {audit.contract.network ?? "Not Provided"}</p>
            </div>
          </div>
          <div className="text-sm md:text-md">
            <h3 className="text-gray-400 mb-2 hidden md:block">Audit Details</h3>
            <div className="space-y-1 *:whitespace-nowrap">
              <p>Audit Type: {audit.audit.audit_type}</p>
              <p>Model: {audit.audit.model}</p>
            </div>
          </div>
        </div>
      </div>
      {view === "audit" && !showFindings && (
        <ReactMarkdown className="overflow-scroll no-scrollbar markdown flex-grow">
          {audit.audit.result}
        </ReactMarkdown>
      )}
      {view === "audit" && showFindings && (
        <Findings
          findings={audit.findings}
          selectedFinding={selectedFinding}
          setSelectedFindings={setSelectedFinding}
          isOwner={audit.user.address === address}
        />
      )}
      {view === "contract" && (
        <pre className="overflow-scroll no-scrollbar flex-grow">{audit.contract.code}</pre>
      )}
    </div>
  );
};

// help retain state when click back and forth.
type FindingsProps = {
  findings: AuditResponseI["findings"];
  selectedFinding: string | null;
  setSelectedFindings: React.Dispatch<React.SetStateAction<string | null>>;
  isOwner: boolean;
};

const Findings: React.FC<FindingsProps> = ({
  findings,
  selectedFinding,
  setSelectedFindings,
  isOwner,
}) => {
  const router = useRouter();
  const selectedFindingDetails = useMemo(() => {
    return findings.find((f) => f.id === selectedFinding);
  }, [selectedFinding, findings]);

  const [input, setInput] = useState("");
  const [attestation, setAttestation] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!selectedFindingDetails) return;
    setInput(selectedFindingDetails.feedback ?? "");
    // 0 for no attestation, -1 for rejected, +1 for accepted.
    setAttestation(
      Number(selectedFindingDetails.is_attested) *
        -1 *
        (1 - 2 * Number(selectedFindingDetails.is_verified)),
    );
  }, [selectedFindingDetails]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (variables: { id: string; feedback?: string; verified?: boolean }) =>
      certaikApiAction.submitFeedback(variables.id, variables.feedback, variables.verified),
    onSuccess: () => router.refresh(),
  });

  // Group findings by level
  const findingsByLevel = useMemo(() => {
    const levels = ["critical", "high", "medium", "low"];
    return findings.reduce(
      (acc, finding) => {
        const level = finding.level;
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(finding);
        return acc;
      },
      Object.fromEntries(levels.map((level) => [level, []])) as Record<string, typeof findings>,
    );
  }, [findings]);

  const formatter = (text: string): JSX.Element => {
    const parts = text.split(/(`.*?`)/);
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            // Remove backticks and wrap in code tag
            return (
              <code key={index} className="!text-[0.875em]">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
      </>
    );
  };

  const handleSubmit = async () => {
    if (!isOwner) return;
    if (!selectedFindingDetails) return;
    if (!input && attestation === 0) return;
    const feedback = !input ? undefined : input;
    const verified = attestation === 0 ? undefined : attestation < 0 ? false : true;
    await mutateAsync({
      id: selectedFindingDetails.id,
      feedback,
      verified,
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden w-full flex-grow relative">
      {/* Sidebar */}
      <div className="w-fit block my-2 md:my-0 md:hidden" onClick={() => setIsOpen(true)}>
        <MenuIcon size={16} />
      </div>
      <div
        className={cn(
          "w-full md:w-1/4 border-b md:border-b-0 md:border-r",
          "border-gray-800 overflow-y-auto md:pr-4",
          "md:block inset-0 absolute md:relative bg-black z-20",
          selectedFinding && !isOpen && "hidden md:block",
        )}
      >
        {Object.entries(findingsByLevel).map(([level, levelFindings]) => (
          <div key={level} className="mb-4">
            <h3
              className={cn(
                "text-sm font-medium px-4 py-2",
                level === "critical" && "text-red-500",
                level === "high" && "text-orange-500",
                level === "medium" && "text-yellow-500",
                level === "low" && "text-green-500",
              )}
            >
              {level.toUpperCase()}
            </h3>
            <div className="space-y-1 overflow-x-hidden rounded-md">
              {levelFindings.map((finding) => (
                <div
                  key={finding.id}
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFindings(finding.id);
                  }}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-gray-800/50",
                    "whitespace-nowrap text-ellipsis overflow-x-hidden",
                    selectedFinding === finding.id && "bg-gray-800",
                  )}
                >
                  {finding.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedFindingDetails ? (
          <div className="space-y-4 markdown">
            <p className="text-xl break-words">{formatter(selectedFindingDetails.name)}</p>

            <div>
              <h3 className="text-gray-400 mb-2">Explanation</h3>
              <p className="text-sm break-words">{formatter(selectedFindingDetails.explanation)}</p>
            </div>

            <div>
              <h3 className="text-gray-400 mb-2">Recommendation</h3>
              <p className="text-sm break-words">
                {formatter(selectedFindingDetails.recommendation)}
              </p>
            </div>

            {selectedFindingDetails.reference && (
              <div>
                <h3 className="text-gray-400 mb-2">Reference</h3>
                <p className="text-sm break-words">{formatter(selectedFindingDetails.reference)}</p>
              </div>
            )}

            <div>
              <div className="flex gap-4 items-center">
                <h3 className="text-gray-400 mb-2">User Feedback</h3>
                <Tooltip.Reference>
                  <Tooltip.Trigger>
                    <Info size={16} color="gray" />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <div className="bg-black border border-gray-600 rounded-md p-2 w-48">
                      This is only editable by the user who submitted this audit
                    </div>
                  </Tooltip.Content>
                </Tooltip.Reference>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!isOwner}
                className={cn(
                  isOwner && "border border-gray-600 rounded-md p-1",
                  "flex-1 bg-transparent outline-none min-h-16 resize-y w-full",
                  "text-white font-mono text-sm",
                  "placeholder:text-gray-500",
                  "caret-green-400",
                )}
                placeholder={isOwner ? "input your feedback..." : "None Provided"}
              />
            </div>

            <div className="flex flex-col sm:flex-row mt-4 gap-4 sm:justify-between">
              <div className="flex gap-4 items-center">
                <div
                  className={cn(
                    "border-gray-800 flex items-center cursor-pointer",
                    (!isOwner || isPending) && "opacity-80 pointer-events-none",
                  )}
                  onClick={() => isOwner && setAttestation(1)}
                >
                  <ThumbsUpIcon
                    size={16}
                    className="mr-2"
                    color={attestation > 0 ? "green" : "gray"}
                  />
                  Accept
                </div>
                <div
                  className={cn(
                    "border-gray-800 flex items-center cursor-pointer",
                    (!isOwner || isPending) && "opacity-80 pointer-events-none",
                  )}
                  onClick={() => isOwner && setAttestation(-1)}
                >
                  <ThumbsDownIcon
                    size={16}
                    className="mr-2"
                    color={attestation < 0 ? "red" : "gray"}
                  />
                  Reject
                </div>
              </div>
              {isOwner && (
                <Button variant="bright" onClick={handleSubmit} disabled={isPending}>
                  Submit Feedback
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a finding to view details
          </div>
        )}
      </div>
    </div>
  );
};
