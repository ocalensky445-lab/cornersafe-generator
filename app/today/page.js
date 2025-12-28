export const dynamic = "force-dynamic";

function slipText(slip, idx) {
  const lines = [
    `FICHE #${idx + 1}`,
    ...slip.map((l, i) => `${i + 1}) ${l}`),
  ];
  return lines.join("\n");
}

export default function TodayPage() {
  // Version simple: 10 fiches, 3 events, format prêt à coller
  const slips = Array.from({ length: 10 }, (_, i) => ([
    `Match ${String.fromCharCode(65 + i)} — Corners (1.28)`,
    `Match ${String.fromCharCode(66 + i)} — Corners (1.30)`,
    `Match ${String.fromCharCode(67 + i)} — Corners (1.32)`,
  ]));

  return (
    <main style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Fiches du jour (Corners)</h1>

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
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontWeight: 700 }}>FICHE #{idx + 1}</div>

            <button
              onClick={() => navigator.clipboard.writeText(slipText(s, idx))}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Copier
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            {s.map((l, j) => (
              <div key={j} style={{ marginBottom: 6 }}>
                {j + 1}) {l}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, fontWeight: 700 }}>
            Cote totale : 2.19
          </div>
        </section>
      ))}
    </main>
  );
}
