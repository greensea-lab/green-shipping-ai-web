# Green Shipping AI Web - 개발 가이드

## 📋 목차

1. [프로젝트 구조 및 파일 설명](#1-프로젝트-구조-및-파일-설명)
2. [개발 환경 준비](#2-개발-환경-준비)
3. [프로젝트 다운로드 및 설치](#3-프로젝트-다운로드-및-설치)
4. [개발 서버 실행](#4-개발-서버-실행)
5. [코드 수정 및 테스트](#5-코드-수정-및-테스트)
6. [환경 격리 및 관리](#6-환경-격리-및-관리)
7. [의존성 관리](#7-의존성-관리)
8. [환경별 설정](#8-환경별-설정)
9. [문제 해결](#9-문제-해결)
10. [추가 학습](#10-추가-학습)

---

## 1. 프로젝트 구조 및 파일 설명

### 1-1. 전체 프로젝트 구조

```
green-shipping-ai-web/
├── 📁 src/                    # 소스 코드 메인 폴더
│   ├── 📁 components/         # 재사용 가능한 컴포넌트들
│   ├── 📁 pages/             # 페이지 컴포넌트들
│   ├── 📁 config/            # 설정 파일들
│   ├── 📄 App.tsx            # 메인 앱 컴포넌트
│   ├── 📄 index.tsx          # 앱 진입점
│   └── 📄 ...                # 기타 소스 파일들
├── 📁 public/                # 정적 파일들
├── 📄 package.json           # 프로젝트 설정 및 의존성
├── 📄 tsconfig.json          # TypeScript 설정
├── 📄 .eslintrc.js           # 코드 검사 설정
├── 📄 .prettierrc            # 코드 포맷팅 설정
├── 📄 env.*                  # 환경별 설정 파일들
└── 📄 README.md              # 프로젝트 가이드
```

### 1-2. 폴더별 상세 설명

#### 📁 `src/` - 소스 코드 메인 폴더
**역할:** 모든 React 컴포넌트와 TypeScript 코드가 위치하는 핵심 폴더

**주요 파일들:**
- `index.tsx`: 앱의 진입점 (React 앱을 DOM에 연결)
- `App.tsx`: 최상위 컴포넌트 (라우팅 및 전체 레이아웃)
- `App.css`: App 컴포넌트 전용 스타일
- `index.css`: 전역 스타일
- `reportWebVitals.ts`: 성능 측정 도구

#### 📁 `src/components/` - 재사용 컴포넌트
**역할:** 여러 페이지에서 재사용할 수 있는 UI 컴포넌트들

**현재 컴포넌트들:**
- `HelloAntd.tsx`: Ant Design 버튼 예제 컴포넌트
- `EnvironmentInfo.tsx`: 환경 정보 표시 컴포넌트

#### 📁 `src/pages/` - 페이지 컴포넌트
**역할:** 각 라우트에 해당하는 페이지 컴포넌트들

**현재 페이지들:**
- `Home.tsx`: 메인 홈페이지 컴포넌트

#### 📁 `src/config/` - 설정 파일들
**역할:** 앱 전체에서 사용하는 설정값들

**현재 설정들:**
- `environment.ts`: 환경변수 관리 (API URL, 앱 이름 등)

#### 📁 `public/` - 정적 파일들
**역할:** 웹사이트에서 직접 접근할 수 있는 파일들

**주요 파일들:**
- `index.html`: 메인 HTML 템플릿
- `manifest.json`: PWA(Progressive Web App) 설정



### 1-3. 설정 파일들 설명

#### 📄 `package.json` - 프로젝트 설정
**역할:** 프로젝트 정보, 의존성, 스크립트 정의

**주요 섹션들:**
```json
{
  "name": "프로젝트 이름",
  "version": "버전",
  "dependencies": "런타임 의존성",
  "devDependencies": "개발 도구 의존성",
  "scripts": "실행 명령어들"
}
```

#### 📄 `tsconfig.json` - TypeScript 설정
**역할:** TypeScript 컴파일러 설정

**주요 설정들:**
- `target`: 컴파일할 JavaScript 버전
- `strict`: 엄격한 타입 검사
- `jsx`: React JSX 처리 방식

#### 📄 `.eslintrc.js` - 코드 검사 설정
**역할:** ESLint를 통한 코드 품질 검출 규칙

**검사 항목들:**
- 코드 스타일 일관성
- 잠재적 오류 검출
- TypeScript 타입 검사

#### 📄 `.prettierrc` - 코드 포맷팅 설정
**역할:** Prettier를 통한 자동 코드 포맷팅 규칙

**포맷팅 규칙들:**
- 들여쓰기 (2칸 공백)
- 세미콜론 사용
- 따옴표 스타일

### 1-4. 파일 확장자 이해하기

#### 📄 `.tsx` - TypeScript + JSX
**사용 시기:** React 컴포넌트를 작성할 때
**특징:** TypeScript의 타입 안전성 + React JSX 문법

**예시:**
```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { Button } from 'antd';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onClick}>클릭</Button>
    </div>
  );
};

export default MyComponent;
```

**언제 사용하나요?**
- React 컴포넌트 생성 시
- JSX 문법을 사용하는 파일
- TypeScript 타입 정의가 필요한 컴포넌트

#### 📄 `.ts` - TypeScript
**사용 시기:** JavaScript 로직만 작성할 때 (JSX 없음)
**특징:** TypeScript의 타입 안전성

**예시:**
```typescript
// src/utils/calculator.ts
interface CalculationResult {
  result: number;
  operation: string;
}

export const add = (a: number, b: number): CalculationResult => {
  return {
    result: a + b,
    operation: 'addition'
  };
};

export const multiply = (a: number, b: number): CalculationResult => {
  return {
    result: a * b,
    operation: 'multiplication'
  };
};
```

**언제 사용하나요?**
- 유틸리티 함수 작성 시
- API 호출 함수 작성 시
- 타입 정의 파일 작성 시
- JSX를 사용하지 않는 로직

#### 📄 `.css` - Cascading Style Sheets
**사용 시기:** 스타일링을 작성할 때
**특징:** 웹페이지의 디자인과 레이아웃 정의

**예시:**
```css
/* src/components/MyComponent.css */
.my-component {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fafafa;
}

.my-component h1 {
  color: #1890ff;
  font-size: 24px;
  margin-bottom: 16px;
}

.my-component button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.my-component button:hover {
  background-color: #40a9ff;
}
```

**언제 사용하나요?**
- 컴포넌트별 스타일 작성 시
- 전역 스타일 정의 시
- CSS 애니메이션 작성 시

#### 📄 `.js` / `.jsx` - JavaScript
**사용 시기:** TypeScript를 사용하지 않을 때
**특징:** 일반 JavaScript (타입 검사 없음)

**예시:**
```javascript
// src/utils/helper.js (TypeScript 사용하지 않을 때)
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

**언제 사용하나요?**
- TypeScript를 사용하지 않는 프로젝트
- 간단한 유틸리티 함수
- 외부 라이브러리와의 호환성이 중요한 경우

### 1-5. 파일 확장자 선택 가이드

#### 🎯 React 컴포넌트 작성 시
```bash
# ✅ 권장: TypeScript + JSX
touch src/components/MyComponent.tsx

# ❌ 비권장: JavaScript + JSX
touch src/components/MyComponent.jsx
```

#### 🎯 유틸리티 함수 작성 시
```bash
# ✅ 권장: TypeScript
touch src/utils/calculator.ts

# ❌ 비권장: JavaScript
touch src/utils/calculator.js
```

#### 🎯 스타일 파일 작성 시
```bash
# ✅ 권장: CSS
touch src/components/MyComponent.css

# ✅ 대안: CSS Modules
touch src/components/MyComponent.module.css

# ✅ 대안: Styled Components (TypeScript)
touch src/components/MyComponent.styles.ts
```

#### 🎯 타입 정의 파일 작성 시
```bash
# ✅ 권장: TypeScript 타입 정의
touch src/types/index.ts

# ✅ 대안: 타입 정의만 있는 파일
touch src/types/index.d.ts
```

### 1-6. 파일 확장자별 특징 비교

| 확장자 | 용도 | 타입 검사 | JSX 지원 | 컴파일 필요 |
|--------|------|-----------|----------|-------------|
| `.tsx` | React 컴포넌트 | ✅ | ✅ | ✅ |
| `.ts` | 유틸리티, 로직 | ✅ | ❌ | ✅ |
| `.css` | 스타일링 | ❌ | ❌ | ❌ |
| `.js` | JavaScript 로직 | ❌ | ❌ | ❌ |
| `.jsx` | React 컴포넌트 (JS) | ❌ | ✅ | ❌ |


src/
├── 📁 hooks/           # 커스텀 React Hooks
├── 📁 utils/           # 유틸리티 함수들
├── 📁 types/           # TypeScript 타입 정의
├── 📁 services/        # API 호출 함수들
├── 📁 styles/          # 스타일 파일들
└── 📁 assets/          # 이미지, 아이콘 등
```

**필요에 따라 추가:**
- `hooks/`: 재사용 가능한 커스텀 훅
- `utils/`: 공통 유틸리티 함수
- `types/`: TypeScript 인터페이스 정의
- `services/`: 백엔드 API 호출 함수
- `styles/`: CSS/SCSS 파일들
- `assets/`: 정적 리소스들

---

## 2. 개발 환경 준비

### 2-1. Node.js 설치

**macOS 사용자:**
1. 터미널을 엽니다 (Spotlight에서 "터미널" 검색)
2. 아래 명령어를 입력합니다:
   ```bash
   brew install node
   ```
3. 설치 확인:
   ```bash
   node --version
   npm --version
   ```
   ✅ 성공 시: `v18.x.x` 또는 `v20.x.x` 같은 버전이 표시됩니다.

**Windows 사용자:**
1. [Node.js 공식 사이트](https://nodejs.org/)에 접속
2. "LTS" 버전 다운로드 (초록색 버튼)
3. 다운로드한 파일을 실행하여 설치
4. 설치 완료 후 명령 프롬프트(cmd)를 열고 확인:
   ```cmd
   node --version
   npm --version
   ```

### 2-2. 코드 에디터 설치

**VS Code 설치 (추천):**
1. [VS Code 공식 사이트](https://code.visualstudio.com/)에서 다운로드
2. 설치 후 실행
3. 추천 확장 프로그램 설치:
   - TypeScript and JavaScript Language Features
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

---

## 3. 프로젝트 다운로드 및 설치

### 3-1. 프로젝트 폴더 생성

**macOS:**
```bash
# 터미널에서
cd ~/Desktop
mkdir green-shipping-ai-web
cd green-shipping-ai-web
```

**Windows:**
```cmd
# 명령 프롬프트에서
cd C:\Users\[사용자이름]\Desktop
mkdir green-shipping-ai-web
cd green-shipping-ai-web
```

### 3-2. 프로젝트 파일 복사

현재 프로젝트의 모든 파일을 위에서 생성한 폴더에 복사합니다.

### 3-3. 의존성 설치

**macOS/Linux:**
```bash
npm install --legacy-peer-deps
```

**Windows:**
```cmd
npm install --legacy-peer-deps
```

✅ 성공 시: `added XXX packages` 메시지가 표시됩니다.

---

## 4. 개발 서버 실행

### 4-1. 기본 실행 (가장 간단한 방법)

**macOS/Linux:**
```bash
npm start
```

**Windows:**
```cmd
npm start
```

### 4-2. 자동으로 브라우저 열기

서버가 시작되면 자동으로 브라우저가 열리고 `http://localhost:3000`에 접속됩니다.

✅ 성공 시: "Green Shipping AI" 웹페이지가 표시됩니다.

### 4-3. 개발 서버 특징

- **실시간 업데이트**: 코드를 수정하면 자동으로 브라우저가 새로고침됩니다
- **에러 표시**: 코드에 오류가 있으면 브라우저에 에러 메시지가 표시됩니다
- **개발자 도구**: 브라우저의 개발자 도구(F12)를 사용하여 디버깅할 수 있습니다

---

## 5. 코드 수정 및 테스트

### 5-1. 첫 번째 코드 수정

1. VS Code에서 `src/pages/Home.tsx` 파일을 엽니다
2. 아래와 같이 수정합니다:

```tsx
import React from 'react';
import HelloAntd from '../components/HelloAntd';
import EnvironmentInfo from '../components/EnvironmentInfo';

const Home: React.FC = () => {
  return (
    <div>
      <h2>안녕하세요! 🎉</h2>
      <p>이곳은 제가 만든 첫 번째 웹페이지입니다.</p>
      <HelloAntd />
      <EnvironmentInfo />
    </div>
  );
};

export default Home;
```

3. 파일을 저장합니다 (Ctrl+S 또는 Cmd+S)
4. 브라우저에서 자동으로 업데이트되는 것을 확인합니다

### 5-2. 컴포넌트 추가하기

1. `src/components/` 폴더에 `MyComponent.tsx` 파일을 생성합니다
2. 아래 코드를 작성합니다:

```tsx
import React from 'react';
import { Card, Button, Space } from 'antd';

const MyComponent: React.FC = () => {
  const handleClick = () => {
    alert('안녕하세요! 이것은 제가 만든 첫 번째 컴포넌트입니다! 🎉');
  };

  return (
    <Card title="내가 만든 컴포넌트" style={{ margin: '16px 0' }}>
      <p>이것은 제가 직접 만든 컴포넌트입니다!</p>
      <Space>
        <Button type="primary" onClick={handleClick}>
          클릭해보세요!
        </Button>
        <Button>다른 버튼</Button>
      </Space>
    </Card>
  );
};

export default MyComponent;
```

3. `src/pages/Home.tsx`에서 새 컴포넌트를 import하고 사용합니다:

```tsx
import React from 'react';
import HelloAntd from '../components/HelloAntd';
import EnvironmentInfo from '../components/EnvironmentInfo';
import MyComponent from '../components/MyComponent';

const Home: React.FC = () => {
  return (
    <div>
      <h2>안녕하세요! 🎉</h2>
      <p>이곳은 제가 만든 첫 번째 웹페이지입니다.</p>
      <HelloAntd />
      <EnvironmentInfo />
      <MyComponent />
    </div>
  );
};

export default Home;
```

---

## 6. 환경 격리 및 관리

### 6-1. Node.js의 환경 격리 방식

**프로젝트별 격리:**
- 각 프로젝트 폴더에 `node_modules/` 폴더가 생성됩니다
- `package.json` 파일에 의존성 목록이 기록됩니다
- 다른 프로젝트와 완전히 격리됩니다

**폴더 구조:**
```
my-project/
├── node_modules/     # 설치된 패키지들
├── package.json      # 의존성 목록
├── src/             # 소스 코드
└── ...
```

### 6-2. Node Version Manager (nvm) - 선택사항

**Node.js 버전 관리 도구:**

**macOS/Linux:**
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Node.js 버전 관리
nvm install 18.17.0    # 특정 버전 설치
nvm use 18.17.0        # 버전 전환
nvm list               # 설치된 버전 확인
```

**Windows:**
```bash
# nvm-windows 설치
# https://github.com/coreybutler/nvm-windows 에서 다운로드

# 사용법은 동일
nvm install 18.17.0
nvm use 18.17.0
```

### 6-3. 프로젝트별 Node.js 버전 관리

**package.json에 Node.js 버전 지정:**
```json
{
  "name": "green-shipping-ai-web",
  "version": "0.1.0",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

**nvm으로 자동 버전 전환:**
```bash
# .nvmrc 파일 생성
echo "18.17.0" > .nvmrc

# 프로젝트 폴더에서 자동으로 버전 전환
nvm use
```

### 6-4. 환경 격리 확인 방법

**설치된 패키지 확인:**
```bash
# 현재 프로젝트의 패키지 확인
npm list

# 전역 패키지 확인
npm list -g
```

**프로젝트 정보 확인:**
```bash
# package.json 내용 확인
cat package.json

# Node.js 버전 확인
node --version
```

### 6-5. 환경 정리

**프로젝트 삭제 시:**
```bash
# node_modules 삭제
rm -rf node_modules

# package-lock.json 삭제
rm package-lock.json
```

**전체 재설치:**
```bash
# 의존성 완전 재설치
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 7. 의존성 관리

### 7-1. 의존성이란?

의존성(Dependencies)은 프로젝트에서 사용하는 외부 라이브러리들입니다.
예: React, Ant Design, TypeScript 등

### 7-2. 새로운 패키지 추가하기

**일반적인 패키지 추가:**
```bash
# 개발에 필요한 패키지 추가
npm install axios

# 개발 도구 패키지 추가 (테스트, 빌드 도구 등)
npm install --save-dev jest
```

**특정 버전 설치:**
```bash
# 특정 버전 설치
npm install react@18.2.0

# 최신 버전 설치
npm install react@latest
```

### 7-3. 의존성 충돌 해결

**문제 상황:**
```bash
npm error ERESOLVE could not resolve
npm error Found: package@1.0.0
npm error node_modules/package
npm error   dev package@"^2.0.0" from the root project
```

**해결 방법:**

1. **권장 방법 (legacy-peer-deps 사용):**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **강제 설치 (주의 필요):**
   ```bash
   npm install --force
   ```

3. **패키지 잠금 파일 삭제 후 재설치:**
   ```bash
   rm package-lock.json
   npm install
   ```

### 7-4. 의존성 업데이트

**특정 패키지 업데이트:**
```bash
# 특정 패키지만 업데이트
npm update react

# 모든 패키지 업데이트
npm update
```

**최신 버전으로 업데이트:**
```bash
# 패키지 최신 버전 확인
npm outdated

# 최신 버전으로 업데이트
npm install react@latest
```

### 7-5. 불필요한 패키지 제거

```bash
# 패키지 제거
npm uninstall axios

# 개발 도구 패키지 제거
npm uninstall --save-dev jest
```

### 7-6. 자주 사용하는 패키지들

**UI 라이브러리:**
```bash
npm install antd          # UI 컴포넌트
npm install @mui/material # Material UI
npm install styled-components # CSS-in-JS
```

**상태 관리:**
```bash
npm install redux @reduxjs/toolkit # Redux
npm install zustand                 # Zustand
npm install recoil                 # Recoil
```

**라우팅:**
```bash
npm install react-router-dom       # 라우팅
npm install react-router-hash-link # 해시 라우팅
```

**HTTP 클라이언트:**
```bash
npm install axios    # HTTP 클라이언트
npm install fetch    # 내장 fetch API
```

**개발 도구:**
```bash
npm install --save-dev eslint        # 코드 검사
npm install --save-dev prettier      # 코드 포맷팅
npm install --save-dev jest          # 테스트
npm install --save-dev @types/node   # TypeScript 타입
```

### 7-7. package.json 이해하기

```json
{
  "dependencies": {
    "react": "^18.2.0",        // 프로덕션에 필요한 패키지
    "antd": "^5.12.8"
  },
  "devDependencies": {
    "eslint": "^8.0.0",        // 개발에만 필요한 패키지
    "prettier": "^3.0.0"
  }
}
```

- **dependencies**: 실제 서비스에서 필요한 패키지들
- **devDependencies**: 개발할 때만 필요한 패키지들 (테스트, 빌드 도구 등)

---

## 8. 환경별 설정

### 8-1. 환경이란?

웹 애플리케이션은 여러 환경에서 실행됩니다:
- **Local**: 내 컴퓨터에서 개발할 때
- **Development**: 개발 서버에서 테스트할 때  
- **Production**: 실제 사용자들이 사용할 때

### 8-2. 환경별 실행

**로컬 환경 (개발용):**
```bash
npm run start:local
```

**개발 서버 환경 (테스트용):**
```bash
npm run start:dev
```

**프로덕션 환경 (실제 서비스용):**
```bash
npm run start:prod
```

### 8-3. 환경 정보 확인

웹페이지에서 "환경 정보" 카드를 통해 현재 설정된 환경을 확인할 수 있습니다.

---

## 9. 문제 해결

### 9-1. 자주 발생하는 문제들

**Q: "command not found: npm" 에러가 발생합니다**
A: Node.js가 설치되지 않았습니다. 1-1단계를 다시 확인해주세요.

**Q: "port 3000 is already in use" 에러가 발생합니다**
A: 다른 프로그램이 3000번 포트를 사용하고 있습니다.
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID번호] /F
```

**Q: "ERESOLVE could not resolve" 에러가 발생합니다**
A: 의존성 충돌입니다. 다음 명령어로 해결하세요:
```bash
npm install --legacy-peer-deps
```

**Q: "Module not found" 에러가 발생합니다**
A: 파일 경로나 import 문을 확인해주세요. 대소문자도 정확히 맞춰야 합니다.

**Q: 브라우저가 자동으로 열리지 않습니다**
A: 수동으로 브라우저를 열고 `http://localhost:3000`에 접속해주세요.

**Q: 코드를 수정해도 브라우저가 업데이트되지 않습니다**
A: 브라우저를 새로고침(F5)하거나 개발 서버를 재시작해주세요.

**Q: "Cannot find module" 에러가 발생합니다**
A: 의존성이 제대로 설치되지 않았습니다. 다음을 시도해주세요:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 9-2. 개발 도구 사용법

**브라우저 개발자 도구 (F12):**
- Console: 에러 메시지 확인
- Elements: HTML 구조 확인
- Network: 네트워크 요청 확인

**VS Code 단축키:**
- `Ctrl+S` (Windows) / `Cmd+S` (Mac): 파일 저장
- `Ctrl+Z` (Windows) / `Cmd+Z` (Mac): 실행 취소
- `F5`: 디버깅 시작

### 9-3. 유용한 명령어들

```bash
# 코드 검사 및 수정
npm run lint

# 코드 포맷팅
npm run format

# 타입 검사
npm run type-check

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build:prod

# 의존성 확인
npm list

# 패키지 정보 확인
npm info [패키지명]
```

---

## 10. 추가 학습

### 10-1. 다음 단계

이제 기본적인 개발 환경이 준비되었습니다. 다음을 학습해보세요:

1. **React 컴포넌트 만들기**
2. **Ant Design 컴포넌트 사용하기**
3. **TypeScript 타입 정의하기**
4. **라우팅 (페이지 이동) 구현하기**
5. **상태 관리 (Redux, Zustand 등)**
6. **API 연동 (axios, fetch 등)**

### 10-2. 학습 자료

- [React 공식 문서](https://react.dev/learn)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [Ant Design 공식 문서](https://ant.design/components/overview/)
- [npm 공식 문서](https://docs.npmjs.com/)

---

## 🎉 축하합니다!

이제 웹 프론트엔드 개발을 시작할 준비가 완료되었습니다! 
궁금한 점이 있으면 언제든 질문해주세요.

---

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 