import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages } = await req.json();

    // Create a new ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller: ReadableStreamDefaultController): Promise<void> {
        try {
          // Make the API request to your backend
          const response = await fetch("YOUR_API_ENDPOINT", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages }),
          });

          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
          }

          // Get the response as a stream
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No reader available");
          }

          // Process the stream
          let reading = true;
          while (reading) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              reading = false;
              break;
            }

            // Send the chunk to the client
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    // Return the stream with appropriate headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
