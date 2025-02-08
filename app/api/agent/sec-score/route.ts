import api from "@/lib/api";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response | undefined> {
  try {
    // Get handle from URL search params
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get('handle');

    if (!handle) {
      throw new Error("Handle is undefined");
    }

    const response = await api.get(`/ai/agent-security/${handle}`);

    if (!response.data) {
      throw new Error("Failed to fetch security score");
    }

    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Error fetching security score:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch security score" },
      { status: 500 }
    );
  }
}
