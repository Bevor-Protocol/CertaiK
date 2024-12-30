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

  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

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

    const fetchStream = async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: cleanedFileContent, promptType }),
        signal: AbortSignal.timeout(600000),
      });

      if (!response.ok) {
        console.log("ERROR", response.statusText);
      }
      const data = await response.json();
      // store this in a separate variable so we can access it outside of state.
      setAuditContent(data);
      setLoading(false);
    };
    try {
      fetchStream();
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, [auditContent]);

  const handleSubmit = () => {};

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
            Something went wrong, try again
          </div>
        )}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => {}}
        disabled={true}
        value={""}
        overrideLoading={loading}
        placeholder="Chat feature coming soon..."
      />
    </>
  );
}
