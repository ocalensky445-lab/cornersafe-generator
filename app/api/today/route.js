import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

function todayKey() {
  // clé du jour (YYYY-MM-DD)
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `fiches:${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const key = todayKey();
    const fiches = (await redis.get(key)) || [];
    return NextResponse.json({ key, fiches });
  } catch (e) {
    return NextResponse.json(
      { error: "API today failed", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
