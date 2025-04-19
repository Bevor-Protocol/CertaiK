"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { BlockExplorerMapper } from "@/utils/constants";
import { trimAddress } from "@/utils/helpers";
import { AuditResponseI } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowUpRightFromSquareIcon,
  DownloadIcon,
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
  const [view, setView] = useState<"contract" | "report" | "breakdown">("report");
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);

  const handleToggle = (type: "contract" | "report" | "breakdown"): void => {
    setView(type);
  };

  const getBlockExplorer = (network?: string, address?: string): string | undefined => {
    if (!network || !address) return;
    if (!(network in BlockExplorerMapper)) return;
    const explorer = BlockExplorerMapper[network as keyof typeof BlockExplorerMapper];
    return `${explorer}/address/${address}`;
  };

  const handleDownload = (): void => {
    const blob = new Blob([audit.result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-report.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const explorerUrl = getBlockExplorer(audit.contract.network, audit.contract.address);

  return (
    <div className="flex flex-col gap-0 w-full h-full">
      <div className="flex flex-col gap-2 justify-between">
        <div
          className={cn(
            "flex justify-between lg:justify-start",
            "flex-row gap-4 border-b border-b-gray-600 pb-4",
            "flex-wrap items-center",
          )}
        >
          <div className="text-sm">
            <div className="*:whitespace-nowrap">
              <p>Audit Type: {audit.audit_type}</p>
              <p>
                Address:{" "}
                {audit.contract.address ? trimAddress(audit.contract.address) : "Not Provided"}
              </p>
              <p>Network: {audit.contract.network ?? "Not Provided"}</p>
            </div>
          </div>
          <div className="w-full *:w-1/2 ml-0 flex flex-row gap-2 lg:ml-auto lg:w-fit">
            <Button onClick={handleDownload} variant="bright" className="w-full text-sm">
              Download Report
              <DownloadIcon size={24} className="ml-1" />
            </Button>
            <Link
              href={explorerUrl ?? ""}
              aria-disabled={!explorerUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              className={cn("text-sm relative", !explorerUrl && "pointer-events-none")}
            >
              <Button variant="bright" className="w-full text-sm" disabled={!explorerUrl}>
                view onchain
                <ArrowUpRightFromSquareIcon size={10} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <div className={cn("flex flex-row items-center")}>
          <div className={cn("flex flex-row gap-2 overflow-x-scroll pb-4")}>
            <div
              className={cn(
                "cursor-pointer whitespace-nowrap flex justify-center items-center",
                "border border-gray-500 rounded-2xl py-1 px-2 text-sm",
                view !== "report" && "opacity-50 hover:opacity-70",
              )}
              onClick={() => handleToggle("report")}
            >
              Report
            </div>
            <div
              className={cn(
                "cursor-pointer whitespace-nowrap flex justify-center items-center",
                "border border-gray-500 rounded-2xl py-1 px-2 text-sm",
                view !== "breakdown" && "opacity-50 hover:opacity-70",
              )}
              onClick={() => handleToggle("breakdown")}
            >
              Breakdown
            </div>
            <div
              className={cn(
                "cursor-pointer whitespace-nowrap flex justify-center items-center",
                "border border-gray-500 rounded-2xl py-1 px-2 text-sm",
                view !== "contract" && "opacity-50 hover:opacity-70",
              )}
              onClick={() => handleToggle("contract")}
            >
              Contract Code
            </div>
          </div>
        </div>
      </div>
      {view === "report" && (
        <ReactMarkdown className="overflow-scroll no-scrollbar markdown grow">
          {audit.result}
        </ReactMarkdown>
      )}
      {view === "breakdown" && (
        <Findings
          findings={audit.findings}
          selectedFinding={selectedFinding}
          setSelectedFindings={setSelectedFinding}
          isOwner={audit.user.address === address}
        />
      )}
      {view === "contract" && (
        <pre className="overflow-scroll no-scrollbar grow text-xs">{audit.contract.code}</pre>
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
  const [showSuccess, setShowSuccess] = useState(false);
  const isMobile = useIsMobile();

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
    onSuccess: () => {
      setShowSuccess(true);
      router.refresh();
    },
  });

  useEffect(() => {
    if (!isPending && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
      return (): void => clearTimeout(timer);
    }
  }, [isPending, showSuccess]);

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
    // First split by multi-line code blocks
    const multiLineParts = text.split(/(```[\s\S]*?```)/);

    return (
      <>
        {multiLineParts.map((part, idx) => {
          // Handle multi-line code blocks
          if (part.startsWith("```")) {
            const code = part.slice(3, -3).replace(/^solidity\n/, ""); // Remove language identifier
            return (
              <pre key={idx} className="text-[0.875em]! bg-gray-800/50 p-2 rounded-md my-2">
                {code}
              </pre>
            );
          }

          // Handle inline code blocks
          const inlineParts = part.split(/(`.*?`)/);
          return (
            <span key={idx}>
              {inlineParts.map((inlinePart, inlineIdx) => {
                if (inlinePart.startsWith("`") && inlinePart.endsWith("`")) {
                  return (
                    <code key={inlineIdx} className="text-[0.875em]!">
                      {inlinePart.slice(1, -1)}
                    </code>
                  );
                }
                return inlinePart;
              })}
            </span>
          );
        })}
      </>
    );
  };

  const handleSubmit = async (): Promise<void> => {
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
    <div className="flex flex-row h-full overflow-hidden w-full grow relative">
      <div className="w-fit block my-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon size={16} />
      </div>
      <div
        className={cn(
          "w-full md:w-64 md:max-w-1/3",
          "border-gray-800 overflow-y-auto md:pr-4 md:static md:inset-[unset]",
          "inset-0 absolute bg-black z-20",
          selectedFinding && !isOpen && "hidden",
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
                    if (isMobile) setIsOpen(false);
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
          <div className="space-y-4 markdown relative">
            <div className="absolute -top-6 right-0">
              <span
                className={cn(
                  "text-sm font-medium",
                  selectedFindingDetails.level === "critical" && "text-red-500",
                  selectedFindingDetails.level === "high" && "text-orange-500",
                  selectedFindingDetails.level === "medium" && "text-yellow-500",
                  selectedFindingDetails.level === "low" && "text-green-500",
                )}
              >
                {selectedFindingDetails.level.toUpperCase()}
              </span>
            </div>
            <div className="text-xl break-words">{formatter(selectedFindingDetails.name)}</div>
            <div>
              <h3 className="text-gray-400 mb-2">Explanation</h3>
              <div className="text-sm break-words">
                {formatter(selectedFindingDetails.explanation)}
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 mb-2">Recommendation</h3>
              <div className="text-sm break-words">
                {formatter(selectedFindingDetails.recommendation)}
              </div>
            </div>

            {selectedFindingDetails.reference && (
              <div>
                <h3 className="text-gray-400 mb-2">Reference</h3>
                <div className="text-sm break-words">
                  {formatter(selectedFindingDetails.reference)}
                </div>
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
                  isOwner && "border border-gray-600 rounded-md p-1 resize-y",
                  !isOwner && "min-h-fit resize-none",
                  "flex-1 bg-transparent outline-hidden min-h-16 w-full",
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
                <Button variant="bright" onClick={handleSubmit} disabled={isPending || showSuccess}>
                  {showSuccess ? "Success" : "Submit Feedback"}
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
