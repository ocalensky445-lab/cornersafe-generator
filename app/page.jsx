export const dynamic = "force-dynamic";

function product(arr) {
  return arr.reduce((p, x) => p * x, 1);
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

function pickSlips(candidates, slipsWanted = 10) {
  // candidates: [{ label, odds }]
  const slips = [];
  let i = 0;

  // Simple algo: on prend des groupes de 3 dans la liste filtrée
  while (slips.length < slipsWanted && i + 2 < candidates.length) {
    const legs = [candidates[i], candidates[i + 1], candidates[i + 2]];
    const total = round2(product(legs.map(l => l.odds)));

    if (total >= 1.5 && total <= 3.0) {
      slips.push({ legs, total });
      i += 3;
    } else {
      // sinon on décale pour trouver une combinaison qui passe
      i += 1;
    }
  }
  return slips;
}

export default async function TodayPage() {
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey) {
    return (
      <main style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
        <h1>Fiches du jour (Corners)</h1>
        <p style={{ color: "crimson" }}>
          Erreur: variable ODDS_API_KEY manquante dans Vercel.
        </p>
      </main>
    );
  }

  // 1) Choisis un sport_key soccer. On part sur "soccer_epl" en exemple.
  // Plus tard: on prendra plusieurs ligues (EPL, LaLiga, Serie A, etc.)
  const sportKey = "soccer_epl";

  // 2) Markets: dépend du provider. Commence par tester un market corners supporté.
  // NOTE: Tu devras peut-être ajuster "markets" selon ce que ton API renvoie.
  // The Odds API documente les market keys sur leur page "betting markets".
  const regions = "us";        // ou "eu" selon ton besoin
  const oddsFormat = "decimal";

  // IMPORTANT: remplace "totals" par le market corners exact si disponible chez ton provider.
  // Pour MVP, on teste "totals" (sur certains feeds c'est "totals" = over/under).
  // Ensuite on passera au vrai market "corners" si le provider le propose.
  const markets = "totals";

  const url =
    `https://api.the-odds-api.com/v4/sports/${sportKey}/odds` +
    `?regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&apiKey=${apiKey}`;

  let events = [];
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    events = await res.json();
  } catch (e) {
    return (
      <main style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
        <h1>Fiches du jour (Corners)</h1>
        <p style={{ color: "crimson" }}>
          Erreur API odds: {String(e.message || e)}
        </p>
      </main>
    );
  }

  // 3) Transforme en candidats (MVP)
  // Chaque event contient bookmakers -> markets -> outcomes.
  const candidates = [];
  for (const ev of events) {
    const matchName = `${ev.home_team} vs ${ev.away_team}`;

    for (const bm of (ev.bookmakers || [])) {
      for (const mk of (bm.markets || [])) {
        for (const out of (mk.outcomes || [])) {
          const price = Number(out.price);
          if (!Number.isFinite(price)) continue;

          // Filtre tes règles: 1.20 à 1.50
          if (price < 1.2 || price > 1.5) continue;

          // Label affiché (sans analyse)
          candidates.push({
            label: `${matchName} — ${mk.key} ${out.name} (${price.toFixed(2)})`,
            odds: price
          });
        }
      }
    }
  }

  // 4) Compose 10 fiches (3 legs)
  const slips = pickSlips(candidates, 10);

  return (
    <main style={{ padding: 16, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 10 }}>Fiches du jour (Corners)</h1>

      {slips.length === 0 ? (
        <p style={{ color: "#555" }}>
          Pas assez de cotes valides (1.20–1.50) pour générer des fiches aujourd’hui.
          Essaie une autre ligue ou un autre market.
        </p>
      ) : (
        slips.map((s, idx) => (
          <section key={idx} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>FICHE #{idx + 1}</div>
            {s.legs.map((l, j) => (
              <div key={j} style={{ marginBottom: 6 }}>
                {j + 1}) {l.label}
              </div>
            ))}
            <div style={{ marginTop: 10, fontWeight: 700 }}>
              Cote totale : {s.total.toFixed(2)}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
