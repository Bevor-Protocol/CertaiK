// Import the necessary modules
import { sessionOptions } from "@/lib/config";
import { SessionData } from "@/utils/types";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { SiweMessage } from "siwe";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, signature } = body;
  const headerList = await headers();
  const domain = headerList.get("x-forwarded-host") ?? "";
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const siweMessage = new SiweMessage(message);

  const { data, success, error } = await siweMessage.verify({
    signature,
    nonce: session.nonce,
    domain,
  });
  if (!success) {
    session.destroy();
    throw error;
  }
  session.siwe = data;

  await session.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
