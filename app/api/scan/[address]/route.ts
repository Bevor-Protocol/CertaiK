import api from "@/lib/api";

type Params = {
  params: Promise<{
    address: string;
  }>;
};

export async function GET(req: Request, { params }: Params): Promise<Response | undefined> {
  const { address } = await params;
  try {
    const response = await api.get(`/blockchain/scan/${address}`);

    const { platform, source_code } = response.data;

    return new Response(JSON.stringify({ platform, sourceCode: source_code }), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ error: "No source code found for the given address on any platform" }),
      { status: 400 },
    );
  }
}
