import api from "@/lib/api";

export async function GET(): Promise<Response | undefined> {
  try {
    const response = await api.get("/blockchain/gas");
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
