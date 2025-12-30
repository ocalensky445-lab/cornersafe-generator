

export const dynamic = "force-dynamic";



function todayKey() {
  // YYYY-MM-DD
  return new Date().toISOString().slice(0, 10);
}

export default async function TodayPage() {
  const key = `fiches:${todayKey()}`;
  

  if (!fiches || !Array.isArray(fiches) || fiches.length === 0) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Fiches du jour (Corners)</h1>
        <p>Aucune fiche pour aujourd’hui.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Fiches du jour (Corners)</h1>

      {fiches.map((fiche) => {
        const total = (fiche.events || [])
          .reduce((acc, e) => acc * (Number(e.odd) || 1), 1)
          .toFixed(2);

        return (
          <div
            key={fiche.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 12,
              marginTop: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              FICHE #{fiche.id}
            </div>

            {(fiche.events || []).map((e, idx) => (
              <div key={idx}>
                {idx + 1}) {e.match} — {e.market} ({e.odd})
              </div>
            ))}

            <div style={{ marginTop: 8, fontWeight: 700 }}>
              Cote totale : {total}
            </div>
          </div>
        );
      })}
    </main>
  );
}


