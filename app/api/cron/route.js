import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

export async function GET(request) {
  const auth = request.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 🔥 FICHES DÉMO (on branchera les vraies cotes plus tard)
  const fiches = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    events: [
      { match: `Match ${i * 3 + 1}`, market: "Corners", odd: 1.28 },
      { match: `Match ${i * 3 + 2}`, market: "Corners", odd: 1.30 },
      { match: `Match ${i * 3 + 3}`, market: "Corners", odd: 1.32 }
    ],
    totalOdd: 2.19
  }));

  // 🧠 On stocke les fiches du jour
  const dateKey = new Date().toISOString().slice(0, 10);
  await redis.set(`fiches:${dateKey}`, fiches);

  return Response.json({
    ok: true,
    storedFor: dateKey,
    count: fiches.length
  });
}
