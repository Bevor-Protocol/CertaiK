import { NextResponse } from "next/server";

export async function GET() {
    console.log("Fetching price...");
  try {
    const apiKey = process.env.ALCHEMY_ACCESS_KEY;
    const tokenAddress = process.env.NEXT_PUBLIC_CERTAIK_ADDRESS;

    if (!apiKey || !tokenAddress) {
      throw new Error("Missing required environment variables");
    }

    const response = await fetch("https://price-api.alchemy.com/api/v1/price", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        tokens: [
          {
            chain: "base",
            address: tokenAddress
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response error:", response.status, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const priceInUSD = data?.addresses?.[0]?.price || 0;

    return NextResponse.json({ price: priceInUSD });

  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch token price" }, { status: 500 });
  }
}
