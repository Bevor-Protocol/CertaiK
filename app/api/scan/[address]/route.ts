import api from "@/lib/api";
import { sessionOptions } from "@/lib/config";
import { SessionData } from "@/utils/types";
import crypto from "crypto";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

type Params = {
  params: Promise<{
    address: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { address } = await params;
  try {
    const secret = process.env.SHARED_SECRET!;

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.siwe) {
      throw new Error("Not authenticated");
    }
    const userAddress = session.siwe.address;

    const timestamp = Date.now().toString();
    const payload = `${timestamp}:/blockchain/scan/${address}`;
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const response = await api.get(`/blockchain/scan/${address}`, {
      headers: {
        "X-Signature": signature,
        "X-Timestamp": timestamp,
        "X-Address": userAddress,
      },
    });

    const { platform, source_code } = response.data;

    return new Response(JSON.stringify({ platform, sourceCode: source_code }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "No source code found for the given address on any platform" }),
      { status: 400 },
    );
  }
}
