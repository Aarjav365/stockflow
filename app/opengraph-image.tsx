import { ImageResponse } from "next/og";

export const alt =
  "StockFlow — Multi-warehouse inventory with receipts, transfers, and audit-ready ledger";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(152deg, #0c0c0c 0%, #1a1a1a 42%, #262626 100%)",
          padding: 64,
          color: "#fafafa",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#a3a3a3",
            marginBottom: 24,
          }}
        >
          StockFlow
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: "980px",
          }}
        >
          Inventory clarity for warehouses, docks and stock teams
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            borderRadius: 9999,
            background: "#fafafa",
            color: "#0a0a0a",
            padding: "18px 32px",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Start free — see your ledger match the floor
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "#a3a3a3",
            maxWidth: "820px",
            lineHeight: 1.45,
          }}
        >
          Receipts, deliveries, transfers and adjustments—multi-warehouse stock
          with a trail you can audit.
        </div>
      </div>
    ),
    { ...size }
  );
}
