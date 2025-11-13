// middleware.ts
import { auth } from "@/lib/auth";

export default auth(async (req) => {
  const publicPaths = ["/api/track", "/api/auth", "/api/forms/submit"];
  const isPublic = publicPaths.some((p) => req.nextUrl.pathname.startsWith(p));
  if (isPublic) return; // allow through

  // req.auth is set when the user is authenticated
  if (!req.auth) {
    return Response.redirect(new URL("/api/auth/signin", req.url));
  }
});

export const config = {
 matcher: [
    // protect everything except:
    "/((?!login|signup|_next|favicon.ico|api/track/open|api/track/click).*)",
  ],
};
