import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { useWs } from "@/hooks/useContexts";
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

const ResultsStep = ({
  setAuditContent,
  contractContent,
  promptType,
  auditContent,
  state,
}: TerminalProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [jobId, setJobId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRetry, setIsRetry] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allowRetry, setAllowRetry] = useState(true);
  const { setOnMessageHandler, sendMessage } = useWs();

  useEffect(() => {
    setOnMessageHandler((data: any): void => {
      if (data.result) {
        setAuditContent(data.result);
        setLoading(false);
      }
    });
  }, [setOnMessageHandler, setAuditContent]);

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
    certaikApiAction
      .runEval(cleanedFileContent, promptType)
      .then((result) => {
        const { job_id } = result;
        // websocket subscribes to job result
        setJobId(job_id);
        console.log("Sending ws message", job_id);
        sendMessage(`subscribe:${job_id}`);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      });
  }, [state]);

  const handleRetry = async (): Promise<void> => {
    try {
      const success = await certaikApiAction.retryFailedEval(jobId);

      if (success) {
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
        onChange={() => {}}
        disabled={true}
        value={""}
        overrideLoading={loading}
        placeholder="Chat feature coming soon..."
      />
    </>
  );
};

export default ResultsStep;
