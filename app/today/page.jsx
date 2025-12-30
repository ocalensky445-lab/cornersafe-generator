export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/today`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    return (
      <main style={{ padding: 20 }}>
        <h1>Fiches du jour (Corners)</h1>
        <div style={{ color: "red" }}>Erreur API /api/today</div>
        <pre style={{ whiteSpace: "pre-wrap" }}>{txt}</pre>
      </main>
    );
  }

  const data = await res.json();
  const fiches = Array.isArray(data.fiches) ? data.fiches : [];

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Fiches du jour (Corners)</h1>

      {fiches.length === 0 ? (
        <div>Aucune fiche enregistrée pour aujourd’hui.</div>
      ) : (
        fiches.map((fiche, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 12,
              marginTop: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              FICHE #{idx + 1}
            </div>

            {(fiche?.events || []).map((ev, i) => (
              <div key={i}>
                {i + 1}) {ev}
              </div>
            ))}

            {fiche?.total && (
              <div style={{ marginTop: 8, fontWeight: 700 }}>
                Cote totale : {fiche.total}
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
}


