import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const authorization = request.headers.get("authorization");
  if (!url || !anonKey || !cloudName || !apiKey || !apiSecret) return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 500 });
  if (!authorization) return NextResponse.json({ error: "Sign in before uploading images." }, { status: 401 });
  const authClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before uploading images." }, { status: 401 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `field-notes/${user.id}`;
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  return NextResponse.json({ signature, timestamp, apiKey, cloudName, folder });
}
