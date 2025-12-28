export const dynamic = "force-dynamic";

export default function TodayPage() {
  return (
    <main style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>Fiches du jour (Corners)</h1>

      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12
          }}
        >
          <strong>FICHE #{i + 1}</strong>
          <div>1) Match — Corners (1.28)</div>
          <div>2) Match — Corners (1.30)</div>
          <div>3) Match — Corners (1.32)</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>
            Cote totale : 2.19
          </div>
        </div>
      ))}
    </main>
  );
}


