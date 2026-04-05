import type { NextRequest } from "next/server";
import { authGuard } from "@/lib/middleware/auth-guard";

// Next.js requires this file to be named `middleware.ts` at the project root.
// All route-protection logic lives in src/lib/middleware/auth-guard.ts
export function middleware(request: NextRequest) {
  return authGuard(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

