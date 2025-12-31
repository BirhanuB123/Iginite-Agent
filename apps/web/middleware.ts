import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Note: We're using localStorage for auth on the client side,
// so we don't need server-side middleware checks.
// Client-side protection is handled in each page component.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/teams/:path*"],
};
