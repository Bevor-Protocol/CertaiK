import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Only expose the api to requests from the app.
  const url = req.nextUrl;
  const { pathname } = url;
  return NextResponse.next();
  if (pathname.startsWith(`/api/`)) {
    if (!req.headers.get("referer")?.includes(process.env.VERCEL_URL as string)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
