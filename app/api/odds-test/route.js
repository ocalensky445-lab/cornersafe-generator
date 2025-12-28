export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;

  // endpoint simple (EPL + markets=h2h est quasiment toujours supporté)
  const url =
    `https://api.the-odds-api.com/v4/sports/soccer_epl/odds` +
    `?regions=eu&markets=h2h&oddsFormat=decimal&apiKey=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text(); // on prend texte pour voir l'erreur exacte si ça fail

  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" }
  });
}
