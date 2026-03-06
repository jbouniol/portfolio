import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Jonathan Bouniol — Data, AI & Business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f172a 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#fafafa",
              fontFamily: "monospace",
              letterSpacing: "-0.02em",
            }}
          >
            JB
          </span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#3b82f6",
              fontFamily: "monospace",
            }}
          >
            .
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          Jonathan Bouniol
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 400,
            color: "#a3a3a3",
            lineHeight: 1.3,
            marginBottom: "40px",
          }}
        >
          Data, AI & Business Strategy
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["Mines Paris PSL", "Albert School", "18+ Projects"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                border: "1px solid #262626",
                borderRadius: "999px",
                fontSize: "18px",
                color: "#a3a3a3",
                fontFamily: "monospace",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "18px",
            color: "#525252",
            fontFamily: "monospace",
          }}
        >
          jonathanbouniol.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
