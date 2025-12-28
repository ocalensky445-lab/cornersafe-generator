export const dynamic = "force-dynamic";

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

export default function TodayPage() {
  const slips = generateMockSlips();

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Fiches du jour (Corners)</h1>

      {slips.map((slip) => (
        <div
          key={slip.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <strong>FICHE #{slip.id}</strong>

          {slip.events.map((e, idx) => (
            <div key={idx}>
              {idx + 1}) {e.match} — {e.market} ({e.odd})
            </div>
          ))}

          <div style={{ marginTop: 8, fontWeight: 700 }}>
            Cote totale :{" "}
            {slip.events
              .reduce((acc, e) => acc * e.odd, 1)
              .toFixed(2)}
          </div>
        </div>
      ))}
    </main>
  );
}


