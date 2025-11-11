// app/api/forms/submit/route.ts
import { NextResponse } from "next/server";
import { sendSlackNotification } from "@/lib/slack";

export const runtime = "nodejs";

// Simple auth: require x-api-key to match FORMS_API_KEY in env (if set)
function isAuthorized(req: Request) {
  const serverKey = process.env.FORMS_API_KEY;
  if (!serverKey) return true; // no key set -> everything allowed (dev)
  const clientKey = req.headers.get("x-api-key");
  return clientKey === serverKey;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const product = body.product || "unknown-product";
  const form = body.form || "unknown-form";
  const data = body.data || body; // allow either {data:{...}} or raw fields

  // Build a simple Slack message
  const fields = Object.entries(data as Record<string, any>).map(([key, value]) => ({
    type: "mrkdwn",
    text: `*${key}*\n${String(value ?? "")}`,
  }));

  await sendSlackNotification({
    text: `New form submission from ${product} / ${form}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `New submission: ${product} / ${form}`,
        },
      },
      {
        type: "section",
        fields: fields.slice(0, 10), // Slack maxes out fields per section
      },
      ...(fields.length > 10
        ? [
            {
              type: "section",
              fields: fields.slice(10, 20),
            },
          ]
        : []),
    ],
  });

  return NextResponse.json({ ok: true });
}
