// src/pages/Report.tsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ← navigate 추가

type RouteState = {
  departure?: string;
  arrival?: string;
  speed?: number;
  loadRate?: number;
  windSpeed?: number;
  waveHeight?: number;
  reportUrl?: string;
};

type QA = { role: "user" | "assistant"; text: string };

const colors = {
  brand: "#0ea5e9",
  text: "#0f172a",
  sub: "#64748b",
  border: "#e5eaf1",
  bg: "#f8fafc",
  chip: "#eef2ff",
  chipBorder: "#dbeafe",
  successBg: "#ecfdf5",
  success: "#10b981",
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "24px",
    background: colors.bg,
    minHeight: "100vh",
    fontFamily:
      "Segoe UI, Apple SD Gothic Neo, Pretendard, Noto Sans KR, system-ui, sans-serif",
  },
  wrap: { maxWidth: 1080, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  leftHead: { display: "flex", alignItems: "center", gap: 12 },
  h1: { fontSize: 22, fontWeight: 800, color: colors.text },
  pill: {
    display: "inline-block",
    fontSize: 12,
    color: "#2563eb",
    background: colors.chip,
    border: `1px solid ${colors.chipBorder}`,
    borderRadius: 999,
    padding: "4px 10px",
  },
  headBtns: { display: "flex", gap: 8 },
  headBtn: {
    background: colors.brand,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },

  grid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 },
  card: {
    background: "#fff",
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
  },
  viewerHead: {
    padding: "14px 16px",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewerTitle: { fontWeight: 800, color: colors.text },
  btnRow: { display: "flex", gap: 8 },
  btn: {
    background: colors.text,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    cursor: "pointer",
  },
  ghost: { background: "#fff", color: colors.text, border: `1px solid ${colors.border}` },
  viewerBody: { padding: 16 },
  shell: {
    height: 520,
    border: `2px dashed ${colors.border}`,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.sub,
    textAlign: "center",
    background: "#fbfdff",
  },
  meta: { padding: 16 },
  kv: { margin: 0, lineHeight: 1.7, color: colors.text },
  hr: { height: 1, background: colors.border, border: 0, margin: "16px 0" },
  good: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: colors.successBg,
    color: colors.success,
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
  },
};

function formatNum(n?: number) {
  if (typeof n !== "number" || isNaN(n)) return "-";
  return new Intl.NumberFormat("ko-KR").format(n);
}

const Report: React.FC = () => {
  const navigate = useNavigate(); // ← 사용
  const location = useLocation();
  const data = (location.state || {}) as RouteState;

  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    el.innerHTML = "";

    if (data.reportUrl) {
      const iframe = document.createElement("iframe");
      iframe.src = data.reportUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "0";
      el.appendChild(iframe);
    } else {
      const tip = document.createElement("div");
      tip.innerHTML =
        '여기에 외부 보고서가 표시됩니다.<br/>다른 서버에서 받아온 <b>iframe</b> 또는 <b>HTML</b>을 이 컨테이너(<code>#external-report-view</code>)에 마운트하세요.';
      tip.style.color = colors.sub;
      el.appendChild(tip);
    }
  }, [data.reportUrl]);

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* 헤더 */}
        <div style={styles.header}>
          <div style={styles.leftHead}>
            <span style={styles.pill}>ESG Report</span>
            <h1 style={styles.h1}>운항 ESG 요약 보고서</h1>
          </div>

          {/* 오픈형 AI 대화 – 다음 페이지 이동 */}
          <div style={styles.headBtns}>
            <button
              style={styles.headBtn}
              onClick={() => navigate("/assistant", { state: data })}
            >
              오픈형 AI 대화로 이동
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <div style={styles.viewerHead}>
              <div style={styles.viewerTitle}>보고서 뷰어</div>
              <div style={styles.btnRow}>
                <button
                  style={styles.btn}
                  onClick={() => alert("다운로드는 외부 보고서 서버와 연동하세요.")}
                >
                  다운로드
                </button>
                <button
                  style={{ ...styles.btn, ...styles.ghost }}
                  onClick={() => window.location.reload()}
                >
                  새로고침
                </button>
              </div>
            </div>
            <div style={styles.viewerBody}>
              <div id="external-report-view" ref={shellRef} style={styles.shell} />
            </div>
          </section>

          <aside style={styles.card}>
            <div style={styles.meta}>
              <p style={styles.kv}>
                <b>운항 경로:</b> {data.departure || "-"} → {data.arrival || "-"}
              </p>
              <p style={styles.kv}>
                <b>속도:</b> {formatNum(data.speed)} knots
              </p>
              <p style={styles.kv}>
                <b>적재율:</b> {formatNum(data.loadRate)} %
              </p>
              <p style={styles.kv}>
                <b>풍속 / 파고:</b> {formatNum(data.windSpeed)} m/s / {formatNum(data.waveHeight)} m
              </p>

              <hr style={styles.hr} />
              <div style={styles.good}>
                <span>✅</span>
                <span>기본 지표 수집 완료. 외부 보고서만 연결하면 됩니다.</span>
              </div>
              <hr style={styles.hr} />
              <p style={{ ...styles.kv, color: colors.sub }}>
                · 보고서는 다른 서버에서 받은 iframe/HTML을 상단 뷰어에 삽입하세요.
                <br />· 다운로드/공유는 외부 서버 버튼을 쓰거나 이 버튼에 연동해도 됩니다.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Report;

