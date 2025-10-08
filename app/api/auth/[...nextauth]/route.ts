// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
// or, equivalently:
// export const GET = handlers.GET;
// export const POST = handlers.POST;
