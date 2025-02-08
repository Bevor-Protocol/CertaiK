import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<Response | undefined> {
  try {
    // Get handle from URL search params
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("handle");

    console.log("Handle:", handle);

    if (!handle) {
      throw new Error("Handle is undefined");
    }

    console.log("Cookie API Key:", process.env.NEXT_PUBLIC_COOKIE_API_KEY);

    const response = await fetch(
      `https://api.cookie.fun/v2/agents/twitterUsername/${handle}?interval=_7Days`,
      {
        headers: {
          "x-api-key": process.env.COOKIE_API_KEY || "",
        },
      },
    );

    const result = await response.json();
    console.log(result);

    if (!result?.ok?.contracts?.[0]?.contractAddress) {
      throw new Error("Could not find agent contract address");
    }

    const address = result.ok.contracts[0].contractAddress;
    return NextResponse.json({ address });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agent address" },
      { status: 400 },
    );
  }
}
