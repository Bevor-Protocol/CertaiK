import { authAction } from "@/actions";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = [
  "/",
  "/dashboard",
  // Add other protected routes here
];

const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  // somehow can't get the matcher to exclude _next/static or files
  if (pathname.includes(".")) {
    return response;
  }
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  let requireSign = false;
  if (isProtectedRoute) {
    const address = await authAction.getCurrentUser();
    requireSign = !address;
  }
  response.headers.set("x-require-sign", requireSign.toString());

  return response;
};

// Configure which routes the middleware should run on
const config = {
  matcher: "/((?!\\..*|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};

export { config, middleware };
