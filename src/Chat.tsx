import React, { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

const ui = {
  bg: "#f8fafc",
  border: "#e5eaf1",
  text: "#0f172a",
  sub: "#64748b",
  brand: "#0ea5e9",
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: ui.bg,
    padding: 24,
    fontFamily:
      "Segoe UI, Apple SD Gothic Neo, Pretendard, Noto Sans KR, system-ui, sans-serif",
  },
  wrap: { maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: 800, color: ui.text },
  back: {
    background: "#fff",
    border: `1px solid ${ui.border}`,
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    color: ui.sub,
  },

  chatBox: {
    background: "#fff",
    border: `1px solid ${ui.border}`,
    borderRadius: 14,
    boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    overflow: "hidden",
  },
  chatHead: {
    padding: "14px 18px",
    borderBottom: `1px solid ${ui.border}`,
    fontWeight: 700,
    color: ui.text,
  },
  chatBody: {
    flex: 1,
    padding: 18,
    overflowY: "auto",
    display: "grid",
    gap: 10,
    background: "#fafbff",
  },
  user: {
    justifySelf: "end",
    background: "#111827",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 12,
    maxWidth: "75%",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  ai: {
    justifySelf: "start",
    background: "#f3f4f6",
    color: ui.text,
    padding: "10px 14px",
    borderRadius: 12,
    maxWidth: "85%",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: `1px solid ${ui.border}`,
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    border: `1px solid ${ui.border}`,
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
  },
  send: {
    background: ui.brand,
    border: "none",
    borderRadius: 10,
    padding: "0 18px",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};

function Chat(): JSX.Element {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "안녕하세요! 생성형 AI 질의응답 인터페이스에 오신 것을 환영합니다." },
  ]);
  const [q, setQ] = useState("");

  const send = () => {
    if (!q.trim()) return;
    setMsgs(prev => [...prev, { role: "user", text: q }]);
    setQ("");
    // 실제 AI 연동은 나중에 추가
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: "assistant", text: "여기에 AI 응답이 표시됩니다." }]);
    }, 500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h1 style={styles.title}>💬 생성형 AI 질의응답</h1>
          <button style={styles.back} onClick={() => window.history.back()}>
            ← 돌아가기
          </button>
        </div>

        {/* 채팅 박스 */}
        <div style={styles.chatBox}>
          <div style={styles.chatHead}>대화</div>
          <div style={styles.chatBody}>
            {msgs.map((m, i) => (
              <div key={i} style={m.role === "user" ? styles.user : styles.ai}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="무엇이든 물어보세요..."
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button style={styles.send} onClick={send}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
