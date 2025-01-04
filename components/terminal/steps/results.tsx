import { Button } from "@/components/ui/button";
import { useWs } from "@/contexts/websocket";
import { MessageType } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setAuditContent: Dispatch<SetStateAction<string>>;
  contractContent: string;
  promptType: string;
  auditContent: string;
  state: MessageType[];
};

export function ResultsStep({
  setAuditContent,
  contractContent,
  promptType,
  auditContent,
  state,
}: TerminalProps) {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [jobId, setJobId] = useState("");
  const [isRetry, setIsRetry] = useState(false);
  const [allowRetry, setAllowRetry] = useState(true);
  const { setOnMessageHandler, sendMessage } = useWs();

  useEffect(() => {
    setOnMessageHandler((data: any) => {
      if (data.result) {
        setAuditContent(data.result);
        setLoading(false);
      }
    });
  }, [setOnMessageHandler]);

  const terminalRef = useRef<HTMLDivElement>(null);

  const removeComments = (report: string): string => {
    report = report.replace(/\/\/.*$/gm, "");
    report = report.replace(/\/\*[\s\S]*?\*\//g, "");
    report = report
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n");
    return report;
  };

  useEffect(() => {
    if (state.length || loading) return;
    setLoading(true);
    const cleanedFileContent = removeComments(contractContent || "");

    fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: cleanedFileContent, promptType }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        // websocket subscribes to job result
        console.log("Sending we message", result.job_id);
        sendMessage(`subscribe:${result.job_id}`);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      });
  }, [state]);

  const handleRetry = async () => {
    try {
      const response = await fetch(`/api/status/${jobId}`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        setIsRetry(true);
        setIsError(false);
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(false);
    }
  };

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {auditContent && (
          <ReactMarkdown className="overflow-scroll no-scrollbar markdown">
            {auditContent}
          </ReactMarkdown>
        )}
        {isError && (
          <div className="mb-2 leading-relaxed whitespace-pre-wrap text-red-400">
            Something went wrong
            {allowRetry && (
              <Button variant="dark" onClick={handleRetry}>
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
      <TerminalInputBar
        onSubmit={() => {}}
        onChange={(value: string) => {}}
        disabled={true}
        value={""}
        overrideLoading={loading}
        placeholder="Chat feature coming soon..."
      />
    </>
  );
}
