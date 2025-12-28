export async function GET() {
  const ok = Boolean(process.env.ODDS_API_KEY);
  return Response.json({ hasKey: ok });
}
