import { setDailySlips } from "@/app/lib/store";

function generateMockSlips() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    events: [
      { match: "Match A", market: "Corners +8.5", odd: 1.22 },
      { match: "Match B", market: "Corners +9.5", odd: 1.28 },
      { match: "Match C", market: "Corners +10.5", odd: 1.31 },
    ],
  }));
}

export async function GET(request) {
  // sécurité simple
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const slips = generateMockSlips();
  setDailySlips(slips);

  return Response.json({
    status: "ok",
    generated: slips.length,
    at: new Date().toISOString(),
  });
}
