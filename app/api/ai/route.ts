// Import the necessary modules
import api from "@/lib/api";
import { NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

const streamer = (stream: any): ReadableStream => {
  const decoder = new TextDecoder();
  return new ReadableStream({
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async start(controller) {
      stream.on("data", (chunk: any) => {
        const text = decoder.decode(chunk, { stream: true });
        controller.enqueue(text);
      });
      stream.on("end", () => {
        controller.close();
      });
      stream.on("error", () => {
        controller.close();
      });
    },
  });
};

export async function POST(request: Request): Promise<Response | undefined> {
  if (request.method === "POST") {
    const data = await request.json();
    const { text, prompt } = data;
    if (!text || !prompt) {
      return NextResponse.json({ error: "Must provide input" }, { status: 400 });
    }

    try {
      const response = await api.post(
        "/ai/eval",
        {
          contract: text,
          prompt,
        },
        {
          responseType: "stream",
        },
      );

      if (!response.data) {
        throw new Error("Response body is not readable");
      }

      const stream = streamer(response.data);

      return new Response(stream, {
        headers: {
          "Access-Control-Allow-Origin": "app.certaik.xyz", // Replace with your client domain
          "Content-Type": "application/octet-stream",
        },
      });
    } catch (error) {
      console.error("Error during model call:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
