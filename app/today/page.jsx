export const dynamic = "force-dynamic";

const SPORT_KEYS = [
  "soccer_epl",
  "soccer_spain_la_liga",
  "soccer_italy_serie_a",
  "soccer_germany_bundesliga",
  "soccer_france_ligue_one"
];

// régions possibles: "us", "eu", "uk", "au" (selon ton API/provider)
const REGIONS = "eu";
const ODDS_FORMAT = "decimal";

// On essaie plusieurs markets possibles. Selon l’API, “corners” peut être un autre key.
// On va détecter aussi par le nom/label du market si disponible.
const MARKET_KEYS_TO_TRY = [
  "corners",
  "total_corners",
  "team_corners",
  "corners_1h",
  "corners_2h",
  "alternate_corners",
  "totals" // fallback (au cas où ton feed corners n’est pas dispo, mais tu verras que ce n’est pas "corners")
];

function round2(n) {
  return Math.round(n * 100) / 100;
}
function product(nums) {
  return nums.reduce((p, x) => p * x, 1);
}

// Détecte si un market ressemble à “corners” (selon key/name)
function isCornersMarket(market) {
  const key = String(market?.key || "").toLowerCase();
  const name = String(market?.title || market?.name || "").toLowerCase();
  const combined = `${key} ${name}`;
  return combined.includes("corner");
}

function normalizeCandidates(events) {
  // Renvoie une liste de candidats { match, label, odds }
  const out = [];
  for (const ev of events || []) {
    const home = ev.home_team || ev.homeTeam || ev.home || "";
    const away = ev.away_team || ev.awayTeam || ev.away || "";
    const match = `${home} vs ${away}`.trim();

    for (const bm of (ev.bookmakers || [])) {
      for (const mk of (bm.markets || [])) {
        // On ne garde que les markets corners
        if (!isCornersMarket(mk)) continue;

        for (const o of (mk.outcomes || [])) {
          const price = Number(o.price);
          if (!Number.isFinite(price)) continue;

          // Tes bornes: 1.20–1.50
          if (price < 1.2 || price > 1.5) continue;

          const outcomeName = String(o.name || o.label || "").trim();
          // Exemple label affiché (sans analyse)
          const label = `${match} — ${mk.key}${outcomeName ? ` ${outcomeName}` : ""} (${price.toFixed(2)})`;

          out.push({ match, label, odds: price });
        }
      }
    }
  }
  return out;
}

function buildSlips(candidates) {
  // On veut 10 slips, 3 legs par slip, total 1.50–3.00
  // On essaie aussi d’éviter d’avoir 2 legs du même match dans une fiche (si possible).
  const slips = [];
  let i = 0;

  // On trie par odds croissantes (un peu plus “safe” en théorie)
  const sorted = [...candidates].sort((a, b) => a.odds - b.odds);

  while (slips.length < 10 && i < sorted.length) {
    const legs = [];
    const usedMatches = new Set();

    // On cherche 3 legs compatibles
    let j = i;
    while (legs.length < 3 && j < sorted.length) {
      const c = sorted[j];
      // éviter même match si possible
      if (!usedMatches.has(c.match)) {
        legs.push(c);
        usedMatches.add(c.match);
      }
      j++;
    }

    if (legs.length < 3) break;

    const total = round2(product(legs.map(l => l.odds)));

    if (total >= 1.5 && total <= 3.0) {
      slips.push({ legs, total });
      i = j; // avance
    } else {
      // si ça ne passe pas, on décale d’un cran
      i += 1;
    }
  }

  return slips;
}

async function fetchOddsForSport(apiKey, sportKey, marketKey) {
  const url =
    `https://api.the-odds-api.com/v4/sports/${sportKey}/odds` +
    `?regions=${REGIONS}&markets=${marketKey}&oddsFormat=${ODDS_FORMAT}&apiKey=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${sportKey} ${marketKey} HTTP ${res.status}`);
  return res.json();
}

export default async function TodayPage() {
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey) {
    return (
      <main style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
        <h1>Fiches du jour (Corners)</h1>
        <p style={{ color: "crimson" }}>ODDS_API_KEY manquante dans Vercel.</p>
      </main>
    );
  }

  let allEvents = [];
  let cornersFound = false;

  // On tente plusieurs ligues + plusieurs market keys jusqu’à obtenir des markets “corners”
  try {
    for (const sportKey of SPORT_KEYS) {
      for (const marketKey of MARKET_KEYS_TO_TRY) {
        const events = await fetchOddsForSport(apiKey, sportKey, marketKey);
        allEvents = allEvents.concat(events || []);

        // Est-ce qu’on a au moins un market corners quelque part ?
        const candidatesPreview = normalizeCandidates(events);
        if (candidatesPreview.length > 0) {
          cornersFound = true;
        }

        // Dès qu’on a des corners, on peut continuer à cumuler un peu, mais on ne va pas spammer l’API
        if (cornersFound) break;
      }
      if (cornersFound) break;
    }
  } catch (e) {
    return (
      <main style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
        <h1>Fiches du jour (Corners)</h1>
        <p style={{ color: "crimson" }}>Erreur API: {String(e.message || e)}</p>
      </main>
    );
  }

  const candidates = normalizeCandidates(allEvents);
  const slips = buildSlips(candidates);

  return (
    <main style={{ padding: 16, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 10 }}>Fiches du jour (Corners)</h1>

      {!cornersFound ? (
        <p style={{ color: "#555" }}>
          Je n’ai pas trouvé de marchés “corners” avec ton provider/region.
          (L’API répond, mais sans corners.)  
          Dis-moi quel provider d’odds tu utilises, et je t’adapte les market keys exactes.
        </p>
      ) : slips.length < 10 ? (
        <p style={{ color: "#555" }}>
          Pas assez de cotes corners valides (1.20–1.50) pour sortir 10 fiches aujourd’hui.
          Fiches générées : {slips.length}.
        </p>
      ) : null}

      {slips.map((s, idx) => (
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
      ))}
    </main>
  );
}


