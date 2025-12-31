import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// ⚠️ IMPORTANT : forcer le mode dynamique
export const dynamic = "force-dynamic";

// Initialisation Redis (Upstash)
const redis = Redis.fromEnv();

export async function GET(request) {
  try {
    // 1️⃣ Vérification du CRON SECRET
    const auth = request.headers.get("authorization");

    if (auth !== "Bearer calenskycornersafe34715029") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2️⃣ Exemple d’action cron (test simple)
    const now = new Date().toISOString();

    await redis.set("last_cron_run", now);

    return NextResponse.json({
      success: true,
      message: "Cron exécuté avec succès",
      time: now,
    });
  } catch (error) {
    console.error("CRON ERROR:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
