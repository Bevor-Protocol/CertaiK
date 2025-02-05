// Import the necessary modules

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response | undefined> {
  if (request.method === "POST") {
    const data = await request.json();
    console.log("RECEIVED", data);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
}
