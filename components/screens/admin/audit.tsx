"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AuditStatus, FindingLevel } from "@/utils/enums";
import { AuditWithChildrenResponseI } from "@/utils/types";
import { useState } from "react";

const AdminAuditPanel = ({ audit }: { audit: AuditWithChildrenResponseI }): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("findings");

  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Audit Not Found</h2>
        <p className="text-gray-400">The requested audit could not be found.</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: AuditStatus): string => {
    switch (status) {
      case AuditStatus.SUCCESS:
        return "bg-green-900/50 text-green-400";
      case AuditStatus.FAILED:
        return "bg-red-900/50 text-red-400";
      case AuditStatus.PROCESSING:
        return "bg-yellow-900/50 text-yellow-400";
      default:
        return "bg-gray-900/50 text-gray-400";
    }
  };

  const getLevelColor = (level: FindingLevel): string => {
    switch (level) {
      case FindingLevel.CRITICAL:
        return "bg-red-900/50 text-red-400";
      case FindingLevel.HIGH:
        return "bg-orange-900/50 text-orange-400";
      case FindingLevel.MEDIUM:
        return "bg-yellow-900/50 text-yellow-400";
      default:
        return "bg-gray-900/50 text-gray-400";
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="bg-gray-800/30 p-4 mb-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span
            className={cn("px-3 py-1 rounded text-sm font-medium", getStatusColor(audit.status))}
          >
            {audit.status}
          </span>
        </div>
        <div className="flex flex-row gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p>{audit.audit_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Created At</p>
            <p>{formatDate(audit.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Processing Time</p>
            <p>
              {audit.processing_time_seconds
                ? `${audit.processing_time_seconds.toFixed(2)}s`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow flex flex-col overflow-hidden"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="findings">Findings ({audit.findings.length})</TabsTrigger>
          <TabsTrigger value="steps">
            Processing Steps ({audit.intermediate_responses.length})
          </TabsTrigger>
          <TabsTrigger value="raw">Result</TabsTrigger>
        </TabsList>
        <TabsContent
          value="findings"
          className="bg-black/90 p-6 rounded-lg flex-grow overflow-auto"
        >
          {audit.findings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No findings available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {audit.findings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-gray-800/30 p-4 rounded-lg border-l-4"
                  style={{
                    borderLeftColor:
                      finding.level === FindingLevel.CRITICAL
                        ? "#ef4444"
                        : finding.level === FindingLevel.HIGH
                          ? "#f97316"
                          : finding.level === FindingLevel.MEDIUM
                            ? "#eab308"
                            : "#3b82f6",
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{finding.name || "Unnamed Finding"}</h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn("px-2 py-1 rounded text-xs", getLevelColor(finding.level))}
                      >
                        {finding.level}
                      </span>
                      {finding.is_verified && (
                        <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs">
                          Verified
                        </span>
                      )}
                      {finding.is_attested && (
                        <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs">
                          Attested
                        </span>
                      )}
                    </div>
                  </div>

                  {finding.explanation && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Explanation</h4>
                      <p className="text-sm">{finding.explanation}</p>
                    </div>
                  )}

                  {finding.recommendation && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Recommendation</h4>
                      <p className="text-sm">{finding.recommendation}</p>
                    </div>
                  )}

                  {finding.reference && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Reference</h4>
                      <p className="text-sm font-mono">{finding.reference}</p>
                    </div>
                  )}

                  {finding.feedback && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Feedback</h4>
                      <p className="text-sm">{finding.feedback}</p>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-gray-500">
                    Created: {formatDate(finding.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="steps" className="bg-black/90 p-6 rounded-lg flex-grow overflow-y-auto">
          {audit.intermediate_responses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No processing steps available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {audit.intermediate_responses.map((step, index) => (
                <div key={step.id} className="bg-gray-800/30 p-4 rounded-lg relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full mr-2">
                        {index + 1}
                      </span>
                      <h3 className="font-medium">{step.step}</h3>
                    </div>
                    <span className={cn("px-2 py-1 rounded text-xs", getStatusColor(step.status))}>
                      {step.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      Processing Time:{" "}
                      {step.processing_time_seconds
                        ? `${step.processing_time_seconds.toFixed(2)}s`
                        : "N/A"}
                    </span>
                    <span>Prompt ID: {step.prompt_id || "N/A"}</span>
                  </div>
                  {step.result && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Result</h4>
                      <div className="bg-black/50 p-3 rounded">
                        <pre className="text-xs whitespace-pre-wrap">{step.result}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="raw" className="bg-black/90 p-6 rounded-lg flex-grow overflow-y-auto">
          {audit.result ? (
            <div className="bg-gray-800/30 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm overflow-auto">{audit.result}</pre>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No raw result available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAuditPanel;
