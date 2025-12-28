import { getDailySlips } from "@/app/lib/store";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  const slips = getDailySlips();

  if (!slips) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Fiches du jour (Corners)</h1>
        <p>Les fiches du jour arrivent bientôt…</p>
      </main>
    );
  }

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
            Cote totale{" "}
            {slip.events
              .reduce((acc, e) => acc * e.odd, 1)
              .toFixed(2)}
          </div>
        </div>
      ))}
    </main>
  );
}

