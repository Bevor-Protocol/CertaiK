import api from "@/lib/api";

type Params = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { jobId } = await params;
  try {
    const response = await api.get(`/status/job/${jobId}`);

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to retrieve job" }), { status: 400 });
  }
}

export async function POST(req: Request, { params }: Params) {
  const { jobId } = await params;
  try {
    const response = await api.get(`/status/job/retry/${jobId}`);

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to restart the job" }), { status: 400 });
  }
}
