import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type RouteState = {
  departure?: string;
  arrival?: string;
  speed?: number;
  loadRate?: number;
  cargo?: string; // TEU 정보
  departureDate?: Date | string;
  arrivalDate?: Date | string;
  reportUrl?: string;
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
  aiBoxBg: '#e7f3ff'
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
  aiBox: {
    background: colors.aiBoxBg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: '13px',
    minHeight: 70,
    color: colors.text,
    fontSize: 15,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 0,
  }
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
      const tip = document.createElement('div');
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
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <div style={styles.viewerHead}>
              <div style={styles.viewerTitle}>보고서 뷰어</div>
              <div style={styles.btnRow}>
                <button
                  style={styles.btn}
                  onClick={() =>
                    alert('다운로드는 외부 보고서 서버와 연동하세요.')
                  }
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
              <div
                id="external-report-view"
                ref={shellRef}
                style={styles.shell}
              />
            </div>
          </section>

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

              {/* 오픈AI 대화용 사각형 박스 (안내문구 대신) */}
              <div style={styles.aiBox}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: colors.brand }}>
                  오픈형 <span style={{ color: "#1163c6" }}>AI와 대화</span>
                </div>
                <div style={{ color: colors.text }}>
                  이곳에서 운항/ESG/환경 관련 질문을 자유롭게 입력하고 AI 답변을 받을 수 있습니다.
                </div>
                {/* 실제 입력/대화 UI는 추후 연결 */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Report;