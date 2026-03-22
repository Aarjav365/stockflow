/**
 * Satori-friendly mark for `app/apple-icon.tsx` — soft tile + light
 * organic shapes (echoes the StockFlow blob mark, not bold “SF” type).
 */
export function OgFaviconMark({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => Math.round(n * scale);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(148deg, #2a2a30 0%, #1c1c22 55%, #202026 100%)",
        borderRadius: s(7),
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: s(20),
          height: s(17),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: s(1),
            top: s(3),
            width: s(12),
            height: s(10),
            borderRadius: s(5),
            background: "rgba(252,252,253,0.9)",
            transform: "rotate(-13deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: s(0),
            bottom: s(2),
            width: s(10),
            height: s(11),
            borderRadius: s(5),
            background: "rgba(232,232,238,0.72)",
            transform: "rotate(11deg)",
          }}
        />
      </div>
    </div>
  );
}
