// Import the necessary modules
import { sessionOptions } from "@/lib/config";
import { SessionData } from "@/utils/types";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  session.nonce = generateNonce();
  await session.save();

  return new Response(JSON.stringify({ nonce: session.nonce }), { status: 200 });
}
