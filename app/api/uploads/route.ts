// app/api/uploads/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export const runtime = "nodejs"; // ensure Node (crypto, aws-sdk v3)

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
} = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET) {
  throw new Error("Missing AWS env vars (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET)");
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const key = `emails/${randomUUID()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    })
  );

  // Region-aware URL (most regions use this form; for us-east-1 you can drop `.us-east-1`)
  const url =
    AWS_REGION === "us-east-1"
      ? `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${key}`
      : `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({ url });
}
