// src/Report.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

type RouteState = {
  departure?: string;
  arrival?: string;
  speed?: number;
  loadRate?: number;   // 사용 안 함(타입만 유지)
  cargo?: string;      // TEU 정보
  departureDate?: Date | string;
  arrivalDate?: Date | string;
  reportUrl?: string;
};

type ChatMsg = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string; // HH:mm
};

const colors = {
  brand: '#0ea5e9',
  text: '#0f172a',
  sub: '#64748b',
  border: '#e5eaf1',
  bg: '#f8fafc',
  chip: '#eef2ff',
  chipBorder: '#dbeafe',
  successBg: '#ecfdf5',
  success: '#10b981',
  aiBoxBg: '#e7f3ff',

  // Chat
  kakaoYellow: '#fee500',
  bubbleGray: '#ffffff',
  bubbleShadow: '0 1px 3px rgba(2,6,23,0.06)',
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px',
    background: colors.bg,
    minHeight: '100vh',
    fontFamily:
      'Segoe UI, Apple SD Gothic Neo, Pretendard, Noto Sans KR, system-ui, sans-serif',
  },
  wrap: { maxWidth: 1080, margin: '0 auto' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // 우측 버튼 삭제했으므로 flex-start
    marginBottom: 16,
  },
  leftHead: { display: 'flex', alignItems: 'center', gap: 12 },
  h1: { fontSize: 22, fontWeight: 800, color: colors.text },
  pill: {
    display: 'inline-block',
    fontSize: 12,
    color: '#2563eb',
    background: colors.chip,
    border: `1px solid ${colors.chipBorder}`,
    borderRadius: 999,
    padding: '4px 10px',
  },

  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 },
  card: {
    background: '#fff',
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    boxShadow: '0 6px 16px rgba(15,23,42,0.05)',
  },
  viewerHead: {
    padding: '14px 16px',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewerTitle: { fontWeight: 800, color: colors.text },
  btnRow: { display: 'flex', gap: 8 },
  btn: {
    background: colors.text,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
  },
  ghost: {
    background: '#fff',
    color: colors.text,
    border: `1px solid ${colors.border}`,
  },
  viewerBody: { padding: 16 },
  shell: {
    height: 520,
    border: `2px dashed ${colors.border}`,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.sub,
    textAlign: 'center',
    background: '#fbfdff',
    overflow: 'hidden',
  },
  meta: { padding: 16 },
  kv: { margin: 0, lineHeight: 1.7, color: colors.text },
  hr: { height: 1, background: colors.border, border: 0, margin: '16px 0' },
  good: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: colors.successBg,
    color: colors.success,
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 13,
  },

  /** ===== Kakao-like Chat UI ===== */
  chatWrap: {
    display: 'flex',
    flexDirection: 'column',
    height: 360,                // 카드 안에서 적절한 높이
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    overflow: 'hidden',
    background: '#ffffff',
  },
  chatHead: {
    padding: '10px 12px',
    borderBottom: `1px solid ${colors.border}`,
    fontWeight: 800,
    color: colors.text,
    fontSize: 14,
    background: '#fafcff',
  },
  chatBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 12px 8px',
    background: '#f9fafb',
  },
  chatRow: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '74%',
    padding: '8px 10px',
    borderRadius: 14,
    boxShadow: colors.bubbleShadow,
    lineHeight: 1.45,
    fontSize: 14,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  bubbleLeft: {
    background: colors.bubbleGray,
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    background: colors.kakaoYellow,
    borderTopRightRadius: 4,
  },
  time: {
    fontSize: 11,
    color: colors.sub,
    margin: '0 6px',
  },
  chatInputBar: {
    borderTop: `1px solid ${colors.border}`,
    padding: 8,
    display: 'flex',
    gap: 8,
    background: '#fff',
  },
  chatInput: {
    flex: 1,
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    background: colors.brand,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '0 14px',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
  },
};

function formatNum(n?: number) {
  if (typeof n !== 'number' || isNaN(n)) return '-';
  return new Intl.NumberFormat('ko-KR').format(n);
}

function formatDate(date?: Date | string) {
  if (!date) return '-';
  try {
    if (typeof date === 'string') {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch {
    return '-';
  }
}

const Report: React.FC = () => {
  const location = useLocation();
  const data = (location.state || {}) as RouteState;

  const shellRef = useRef<HTMLDivElement | null>(null);

  /** ====== Viewer(좌측) ====== */
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    el.innerHTML = '';

    if (data.reportUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = data.reportUrl;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = '0';
      el.appendChild(iframe);
    } else {
      // 리포트 URL이 없으면 안내 문구 유지(원 코드 유지)
      const tip = document.createElement('div');
      tip.innerHTML =
        '여기에 외부 보고서가 표시됩니다.<br/>다른 서버에서 받아온 <b>iframe</b> 또는 <b>HTML</b>을 이 컨테이너(<code>#external-report-view</code>)에 마운트하세요.';
      tip.style.color = colors.sub;
      el.appendChild(tip);
    }
  }, [data.reportUrl]);

  /** ====== Kakao-like Chat(우측 하단) ====== */
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      id: 'm1',
      role: 'ai',
      text: '안녕하세요! 운항/ESG 관련 궁금한 점을 보내주세요 😊',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // 전송
  const send = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: 'user', text, time: now };
    setMsgs((m) => [...m, userMsg]);
    setInput('');

    // 아주 간단한 데모 응답(실제 AI 연동 X)
    setTimeout(() => {
      const replyText =
        text.includes('배출') || text.toLowerCase().includes('co2')
          ? '이번 항차의 총 배출량은 1767.077 kg/CO2로 집계되어 있어요.'
          : text.includes('속도') || text.toLowerCase().includes('speed')
            ? '평균 속도는 12 kn으로 고정되어 있어요.'
            : '확인했어요! 다른 것도 물어보세요 🙂';

      const aiMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMsgs((m) => [...m, aiMsg]);
    }, 450);
  };

  // Enter로 전송
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // 자동 스크롤
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [msgs.length]);

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* 헤더 */}
        <div style={styles.header}>
          <div style={styles.leftHead}>
            <span style={styles.pill}>ESG Report</span>
            <h1 style={styles.h1}>운항 ESG 요약 보고서</h1>
          </div>
        </div>

        <div style={styles.grid}>
          {/* 좌측: 보고서 뷰어 */}
          <section style={styles.card}>
            <div style={styles.viewerHead}>
              <div style={styles.viewerTitle}>보고서 뷰어</div>
              <div style={styles.btnRow}>
                <button
                  style={styles.btn}
                  onClick={() => alert('다운로드는 외부 보고서 서버와 연동하세요.')}
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

          {/* 우측: 메타 + 채팅 */}
          <aside style={styles.card}>
            <div style={styles.meta}>
              <p style={styles.kv}>
                <b>운항 경로:</b> {data.departure || '-'} → {data.arrival || '-'}
              </p>
              <p style={styles.kv}>
                <b>평균 속도:</b> {formatNum(data.speed)} knots
              </p>
              <p style={styles.kv}>
                <b>적재량:</b> {data.cargo ? `${data.cargo} TEU` : '-'}
              </p>
              <p style={styles.kv}>
                <b>출발 날짜:</b> {formatDate(data.departureDate)}
              </p>
              <p style={styles.kv}>
                <b>도착 날짜:</b> {formatDate(data.arrivalDate)}
              </p>

              <hr style={styles.hr} />
              <div style={styles.good}>
                <span>✅</span>
                <span>기본 지표 수집 완료. 외부 보고서만 연결하면 됩니다.</span>
              </div>
              <hr style={styles.hr} />

              {/* ✅ 카톡 스타일 대화 박스 */}
              <div style={styles.chatWrap}>
                <div style={styles.chatHead}>오픈형 AI 채팅</div>

                <div style={styles.chatBody} ref={bodyRef}>
                  {msgs.map((m) => {
                    const isUser = m.role === 'user';
                    return (
                      <div
                        key={m.id}
                        style={{
                          ...styles.chatRow,
                          ...(isUser ? styles.rowRight : styles.rowLeft),
                        }}
                      >
                        {!isUser && (
                          <span style={{ ...styles.time, marginLeft: 4, marginRight: 6 }}>
                            {m.time}
                          </span>
                        )}
                        <div
                          style={{
                            ...styles.bubble,
                            ...(isUser ? styles.bubbleRight : styles.bubbleLeft),
                          }}
                        >
                          {m.text}
                        </div>
                        {isUser && (
                          <span style={{ ...styles.time, marginLeft: 6, marginRight: 4 }}>
                            {m.time}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={styles.chatInputBar}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="메시지를 입력하세요…"
                    style={styles.chatInput}
                  />
                  <button onClick={send} style={styles.sendBtn}>
                    전송
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Report;
