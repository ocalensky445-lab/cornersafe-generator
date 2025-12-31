import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  // 1) Sécurité cron
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2) Vérif env Upstash (évite crash build/runtime)
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Upstash env vars",
        need: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
      },
      { status: 500 }
    );
  }

  // 3) Import + init Redis uniquement ici (pas au top)
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({ url, token });

  // 4) Exemple: on écrit une “preuve de vie” (tu pourras remplacer par ta logique)
  const now = new Date().toISOString();
  await redis.set("cron:last_run", now);

  return NextResponse.json({ ok: true, now });
}
