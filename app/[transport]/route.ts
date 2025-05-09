import certaikApiService from "@/actions/certaik-api/certaik-api.service";
import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    server.tool("echo", "Echo a message", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));

    server.tool(
      "runAudit",
      "Run an audit on the provided code",
      { code: z.string() },
      async ({ code }) => {
        try {
          // Upload the source code
          const uploadResponse = await certaikApiService.uploadSourceCode({
            code,
            userId: process.env.ADMIN_USER_ID || "",
          });

          if (!uploadResponse.contract || !uploadResponse.contract.id) {
            throw new Error("Failed to upload source code");
          }

          const contractId = uploadResponse.contract.id;

          // Run the evaluation
          const evalResponse = await certaikApiService.runEval(
            contractId,
            "security",
            process.env.ADMIN_USER_ID || "",
          );

          return {
            content: [{ type: "text", text: `Audit started with job ID: ${evalResponse.job_id}` }],
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
          return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
          };
        }
      },
    );

    server.tool("getAudits", "Retrieve all audits", {}, async () => {
      try {
        const audits = await certaikApiService.getAudits({});
        return {
          content: [{ type: "text", text: JSON.stringify(audits) }],
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return {
          content: [{ type: "text", text: `Error: ${errorMessage}` }],
        };
      }
    });
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        runAudit: {
          description: "Run an audit on the provided code",
        },
        getAudits: {
          description: "Retrieve all audits",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
  },
);

export { handler as DELETE, handler as GET, handler as POST };
