export const dynamic = "force-dynamic";

function formatOdds(n) {
  return Math.round(n * 100) / 100;
}

function makeSlip(index) {
  const matches = [
    "Chelsea vs Everton",
    "Arsenal vs Fulham",
    "Real Sociedad vs Alavés",
    "Milan vs Torino",
    "Dortmund vs Mainz",
    "Betis vs Getafe",
    "PSG vs Nantes",
    "Inter vs Atalanta",
    "Benfica vs Porto",
    "Ajax vs PSV",
    "Lyon vs Monaco",
    "Roma vs Lazio",
    "Sevilla vs Valencia"
  ];

  const markets = [
    "Corners — Match (Over 8.5)",
    "Corners — Match (Over 9.5)",
    "Corners — 1ère mi-temps (Over 3.5)",
    "Corners — 1ère mi-temps (Over 4.5)",
    "Corners — 2e mi-temps (Over 4.5)",
    "Corners — 2e mi-temps (Over 5.5)"
  ];

  let legs = [];
  let total = 1;

  while (true) {
    legs = [];
    total = 1;

    for (let i = 0; i < 3; i++) {
      const m = matches[(index * 3 + i * 2) % matches.length];
      const mk = markets[(index + i) % markets.length];

      const odds = formatOdds(1.2 + ((index + i * 7) % 31) / 100);
      legs.push({ match: m, market: mk, odds });
      total *= odds;
    }

    total = formatOdds(total);
    if (total >= 1.5 && total <= 3.0) break;

    index++;
  }

  return { legs, total };
}

export default function TodayPage() {
  const slips = Array.from({ length: 10 }, (_, i) => makeSlip(i + 1));

  return (
    <main style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Fiches du jour (Corners)</h1>

      {slips.map((s, idx) => (
        <section
          key={idx}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 14,
            marginBottom: 12
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 10 }}>
            FICHE #{idx + 1}
          </div>

          {s.legs.map((l, j) => (
            <div key={j} style={{ marginBottom: 6 }}>
              {j + 1}) {l.match} — {l.market} ({l.odds.toFixed(2)})
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
