// Import the necessary modules
import crypto from "crypto";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.SHARED_SECRET!;

  const timestamp = Date.now().toString();
  const payload = `${timestamp}:/ws`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return new Response(
    JSON.stringify({
      signature,
      timestamp,
    }),
    { status: 200 },
  );
}
