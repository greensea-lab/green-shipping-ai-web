// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Simulation from "./Simulation";
import Result from "./Result";
import Report from "./Report";
import Chat from "./Chat";

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        {/* 메인 */}
        <Route path="/" element={<Home />} />

        {/* 시뮬레이션 흐름 */}
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/result" element={<Result />} />
        <Route path="/report" element={<Report />} />

        {/* 오픈형 AI 대화 */}
        <Route path="/chat" element={<Chat />} />
        {/* /assistant 로 이동해도 Chat이 열리도록 별칭 라우트 추가 */}
        <Route path="/assistant" element={<Chat />} />

        {/* 알 수 없는 경로는 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
