import { NextResponse } from "next/server";
import { sendSlackNotification } from "@/lib/slack";

export const runtime = "nodejs";

// comma-separated list of allowed origins, e.g. https://burfinancial.com,https://www.burfinancial.com
const ALLOWED = (process.env.FORMS_ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const allowOrigin =
    origin && (ALLOWED.length === 0 || ALLOWED.includes(origin)) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400",
  };
}

function isAuthorized(req: Request) {
  const serverKey = process.env.FORMS_API_KEY;
  if (!serverKey) return true; // allow in dev if not set
  const clientKey = req.headers.get("x-api-key");
  return clientKey === serverKey;
}

// Handle CORS preflight
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, {
      status: 401,
      headers: corsHeaders(origin),
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, {
      status: 400,
      headers: corsHeaders(origin),
    });
  }

  const product = body.product || "unknown-product";
  const form = body.form || "unknown-form";
  const data = body.data || body;

  // Shape Slack message
  const fields = Object.entries(data as Record<string, any>).map(([k, v]) => ({
    type: "mrkdwn",
    text: `*${k}*\n${String(v ?? "")}`,
  }));

  await sendSlackNotification({
    text: `New form submission from ${product} / ${form}`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: `New submission: ${product} / ${form}` } },
      { type: "section", fields: fields.slice(0, 10) },
      ...(fields.length > 10 ? [{ type: "section", fields: fields.slice(10, 20) }] : []),
    ],
  });

  return NextResponse.json({ ok: true }, { headers: corsHeaders(origin) });
}
