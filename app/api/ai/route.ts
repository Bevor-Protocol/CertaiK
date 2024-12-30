// Import the necessary modules
import api from "@/lib/api";
import { NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (request.method === "POST") {
    const data = await request.json();
    const { text, promptType } = data;
    if (!text) {
      return NextResponse.json({ error: "Must provide input" }, { status: 400 });
    }

    try {
      const response = await api.post("/ai/eval", {
        contract_code: text,
        audit_type: promptType,
        encode_code: true,
        as_markdown: true,
      });

      if (!response.data) {
        throw new Error("Response body is not readable");
      }

      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error("Error during model call:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
