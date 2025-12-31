import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET(request) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== "Bearer calenskycornersafe34715029") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // test écriture
    const now = new Date().toISOString();
    await redis.set("last_cron_run", now);

    return NextResponse.json({ success: true, time: now });
  } catch (err) {
    console.error("CRON ERROR:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

