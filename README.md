# Green Shipping AI Web

> 완전 초보자를 위한 WebStorm + React 개발환경 설정 가이드

## 🎯 이 가이드를 따르면

✅ GitHub에서 프로젝트를 다운로드할 수 있어요  
✅ WebStorm에서 웹사이트를 실행할 수 있어요  
✅ 코드를 수정하면 바로 브라우저에서 확인할 수 있어요  

**예상 시간:** 20분 (처음 하는 경우)

---

## 🚀 1단계: WebStorm에서 프로젝트 가져오기

### WebStorm 열기

**WebStorm을 실행하면 나오는 화면들:**

**화면 1: 빈 시작 화면**
- "New Project" 
- **"Get from VCS"** ← 이것 클릭! 
- "Open"

**화면 2: 기존 프로젝트가 있는 화면**
- `File` 메뉴 → `New` → `Project from Version Control...` 클릭

### 프로젝트 주소 입력

**나타나는 창에서:**
```
URL: https://github.com/greensea-lab/green-shipping-ai-web.git
```

**저장할 폴더 (Directory):**
- **Windows**: `C:\Users\내컴퓨터이름\WebStormProjects\green-shipping-ai-web`
- **Mac**: `/Users/내컴퓨터이름/WebStormProjects/green-shipping-ai-web`

💡 **내 컴퓨터 이름 찾는 법:**
- **Windows**: 파일 탐색기 열기 → 왼쪽에서 "내 PC" 보기
- **Mac**: Finder → 상단 메뉴에서 자신의 이름 확인

### 다운로드 실행

1. **"Clone" 버튼 클릭**
2. **진행률 바 확인** (인터넷 속도에 따라 1-3분)
3. **"프로젝트를 어떻게 열까요?" 창이 뜸**
   - "This Window" 또는 "New Window" 아무거나 클릭

✅ **성공 신호:** WebStorm 왼쪽에 폴더 목록이 보임

---

## 🔧 2단계: Node.js 확인하기

### 터미널 열기

**WebStorm 하단에서 터미널 찾기:**
- 화면 맨 아래 "Terminal" 탭 클릭
- 또는 `Alt + F12` (Windows) / `Option + F12` (Mac)

**터미널이 안 보이면:**
- `View` 메뉴 → `Tool Windows` → `Terminal`

### Node.js 있는지 확인

**검은 화면(터미널)에 입력:**
```bash
node --version
```
**Enter 키 누르기**

**npm도 확인:**
```bash
npm --version
```

### 결과 확인

✅ **좋은 결과 (이 중 하나면 OK):**
```
v16.20.0    또는    v18.17.0    또는    v20.9.0
8.19.0      또는    9.6.7       또는    10.1.0
```

❌ **안 좋은 결과:**
```
'node'은(는) 내부 또는 외부 명령이 아닙니다
node: command not found
```

### Node.js 설치 (안 좋은 결과가 나온 경우)

**Windows 사용자:**
1. [nodejs.org](https://nodejs.org/) 사이트 접속
2. **왼쪽 초록색 버튼** 클릭 (LTS 추천)
3. 다운로드된 파일 실행 → 계속 "Next" 클릭
4. 설치 완료 후 **WebStorm 완전 종료 후 다시 실행**
5. 터미널에서 다시 `node --version` 확인

**Mac 사용자:**
```bash
# 터미널에서 이 명령어들 하나씩 실행
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

---

## 📂 3단계: 프로젝트 파일 확인

### 올바른 폴더인지 확인

**터미널에서 입력:**
```bash
ls
```
**또는**
```bash
dir
```

✅ **보여야 하는 것들:**
```
package.json
src
public
README.md
tsconfig.json
```

❌ **이런 게 없으면 잘못된 폴더:**
- `package.json` 파일이 없음
- `src` 폴더가 없음

**잘못된 폴더에 있다면:**
```bash
cd green-shipping-ai-web
ls
```

---

## ⚡ 4단계: 필요한 프로그램들 설치

### 설치 명령어 실행

**터미널에서 이 명령어를 정확히 입력:**
```bash
npm install --legacy-peer-deps
```

### 설치 과정 확인

**정상적인 설치 과정:**
1. **첫 30초:** 아무것도 안 나타남 (정상)
2. **1-3분:** 진행률 표시 `[████████████████] 100%`
3. **마지막:** `added 1500+ packages in 2m` 같은 메시지

**나타나는 메시지들:**
- 🟡 **노란색 WARN**: 무시해도 됨 (정상)
- 🟡 **"deprecated"**: 무시해도 됨 (정상)  
- 🔴 **빨간색 ERROR**: 문제 있음 (아래 해결방법 참고)

### 설치 완료 확인

**터미널에서 확인:**
```bash
ls
```

✅ **새로 생긴 폴더:** `node_modules` (크기가 매우 큰 폴더)

---

## 🚀 5단계: 웹사이트 실행하기

### 서버 시작

**터미널에서 입력:**
```bash
npm start
```

### 실행 과정 (약 30초-1분)

**1단계:** `Starting the development server...`  
**2단계:** 여러 줄의 메시지들...  
**3단계:** `Compiled successfully!`  
**4단계:** 브라우저가 자동으로 열림

### 성공 확인

✅ **성공 신호들:**
- 브라우저에서 자동으로 `http://localhost:3000` 열림
- "Green Shipping AI" 웹페이지 표시
- 터미널에 "Compiled successfully!" 메시지

🎉 **축하합니다! 웹 개발 환경 설정 완료!**

---

## 🛠️ 이제 사용할 수 있는 명령어들

```bash
# 서버 실행 (가장 자주 사용)
npm start

# 서버 중지
Ctrl + C

# 코드 정리
npm run format

# 코드 검사
npm run lint
```

---

## ⚠️ 문제가 생겼을 때

### "Clone이 안 돼요!"

**문제 1: "Repository not found"**
```
해결: URL을 다시 정확히 복사
https://github.com/greensea-lab/green-shipping-ai-web.git
```

**문제 2: "Authentication failed"**
```
해결: 
1. GitHub 계정으로 로그인되어 있는지 확인
2. WebStorm → File → Settings → Version Control → GitHub에서 계정 설정
```

### "Node.js가 안 돼요!"

**문제: "node: command not found"**
```
해결:
1. Node.js 재설치 (nodejs.org에서 LTS 버전)
2. WebStorm 완전 종료 후 재시작
3. 컴퓨터 재시작
```

### "npm install이 안 돼요!"

**문제 1: 빨간색 에러 메시지**
```bash
# 해결 방법 1: 캐시 정리
npm cache clean --force
npm install --legacy-peer-deps

# 해결 방법 2: 완전 재설치
rm -rf node_modules
npm install --legacy-peer-deps
```

**문제 2: "EACCES 권한 에러" (Mac/Linux)**
```bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### "npm start가 안 돼요!"

**문제 1: "Port 3000 is already in use"**
```bash
# 해결: 다른 포트 사용
PORT=3001 npm start
```

**문제 2: "Module not found"**
```bash
# 해결: 다시 설치
npm install --legacy-peer-deps
```

### "브라우저가 안 열려요!"

**해결:**
1. 수동으로 브라우저 열기
2. 주소창에 `http://localhost:3000` 입력

---

## ✅ 최종 체크리스트

**완료했다면 체크하세요:**

### 기본 설정
- [ ] WebStorm에서 프로젝트 열기 성공
- [ ] `node --version` 명령어 작동
- [ ] `npm --version` 명령어 작동

### 프로젝트 설정  
- [ ] `package.json` 파일 확인
- [ ] `npm install --legacy-peer-deps` 성공
- [ ] `node_modules` 폴더 생성됨

### 실행 확인
- [ ] `npm start` 명령어 성공
- [ ] 브라우저에서 웹사이트 확인
- [ ] "Green Shipping AI" 페이지 표시

---

## 🆘 그래도 안 되나요?

**마지막 해결책:**
1. **컴퓨터 재시작**
2. **WebStorm 재설치**
3. **Node.js 완전 삭제 후 재설치**
4. **프로젝트를 `C:\dev\` 같은 짧은 경로에 다시 clone**

**도움 요청:**
- 에러 메시지 전체를 복사해서 구글에서 검색
- 개발자 커뮤니티에서 질문하기
- 팀 동료에게 화면 공유로 도움 요청

---
## 🎓 코드 개발 시작 가이드

### 🚀 첫 번째 코드 수정하기

**1단계: 파일 열기**
- WebStorm 왼쪽에서 `src` → `pages` → `Home.tsx` 더블클릭
- 또는 `Ctrl + Shift + N` (Windows) / `Cmd + Shift + O` (Mac)으로 파일 검색

**2단계: 코드 수정**
```tsx
// Home.tsx 파일에서 이 부분을 찾아서
<h1>Green Shipping AI</h1>

// 이렇게 변경해보세요
<h1>내가 만든 첫 번째 웹사이트! 🎉</h1>
```

**3단계: 저장 및 확인**
- `Ctrl + S` (Windows) / `Cmd + S` (Mac)으로 저장
- 브라우저가 자동으로 새로고침되는 것 확인

### 🎨 컴포넌트 만들기 연습

**새로운 컴포넌트 만들기:**

1. **파일 생성:** `src/components/` 폴더에 `MyFirstComponent.tsx` 생성
2. **코드 작성:**
```tsx
import React from 'react';
import { Button, Card, Space } from 'antd';

const MyFirstComponent: React.FC = () => {
  const handleClick = () => {
    alert('안녕하세요! 제가 만든 첫 번째 컴포넌트입니다! 🎉');
  };

  return (
    <Card title="내가 만든 컴포넌트" style={{ margin: '16px 0' }}>
      <p>이것은 제가 직접 만든 React 컴포넌트입니다!</p>
      <Space>
        <Button type="primary" onClick={handleClick}>
          클릭해보세요!
        </Button>
        <Button>다른 버튼</Button>
      </Space>
    </Card>
  );
};

export default MyFirstComponent;
```

3. **사용하기:** `Home.tsx`에서 import하고 사용
```tsx
import MyFirstComponent from '../components/MyFirstComponent';

// Home 컴포넌트 안에 추가
<MyFirstComponent />
```

### 📝 실전 코딩 연습

**연습 1: 텍스트 변경하기**
```tsx
// Home.tsx에서
<p>환영합니다!</p>

// 이렇게 변경
<p>안녕하세요! 저는 웹 개발자가 되고 싶습니다! 💪</p>
```

**연습 2: 버튼 추가하기**
```tsx
// Home.tsx에 추가
import { Button } from 'antd';

// 컴포넌트 안에 추가
<Button type="primary" style={{ margin: '10px' }}>
  나의 첫 번째 버튼
</Button>
```

**연습 3: 카드 컴포넌트 만들기**
```tsx
// Home.tsx에 추가
import { Card } from 'antd';

// 컴포넌트 안에 추가
<Card title="내 정보" style={{ margin: '16px 0' }}>
  <p>이름: 웹 개발자 지망생</p>
  <p>목표: React 마스터 되기</p>
  <p>현재: 첫 번째 프로젝트 진행 중</p>
</Card>
```

### 🔧 유용한 개발 팁

**코드 작성 시:**
- `Ctrl + Space`: 자동완성
- `Ctrl + /`: 주석 처리/해제
- `Alt + Enter`: 빠른 수정 제안
- `F12`: 정의로 이동

**디버깅 시:**
- 브라우저 F12 → Console 탭에서 에러 확인
- React Developer Tools 확장 프로그램 설치
- `console.log()` 사용해서 값 확인

**파일 구조:**
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── utils/         # 유틸리티 함수
├── types/         # TypeScript 타입 정의
└── styles/        # CSS 파일들
```

### 📚 추천 학습 자료

**React 기초:**
- [React 공식 튜토리얼](https://react.dev/learn/tutorial-tic-tac-toe)
- [React 기초 강의 (한글)](https://www.youtube.com/watch?v=wGxzYjUYsAs)

**TypeScript:**
- [TypeScript 핸드북](https://typescript-kr.github.io/)
- [TypeScript 기초 강의](https://www.youtube.com/watch?v=JgwOqQqXj8E)

**Ant Design:**
- [Ant Design 공식 문서](https://ant.design/components/overview/)
- [Ant Design 예제 모음](https://ant.design/docs/react/practice)

**CSS/스타일링:**
- [CSS 기초 강의](https://www.youtube.com/watch?v=1PnVor36_40)
- [Flexbox 완전 가이드](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### 🚨 자주 발생하는 실수들

**1. 파일 경로 오류**
```tsx
// ❌ 잘못된 import
import MyComponent from './MyComponent'

// ✅ 올바른 import
import MyComponent from '../components/MyComponent'
```

**2. 컴포넌트 이름 오류**
```tsx
// ❌ 잘못된 사용
<mycomponent />

// ✅ 올바른 사용
<MyComponent />
```

**3. JSX 문법 오류**
```tsx
// ❌ 잘못된 문법
<div>
  <h1>제목</h1>
  <p>내용</p>
</div>

// ✅ 올바른 문법 (하나의 부모 요소로 감싸기)
<div>
  <h1>제목</h1>
  <p>내용</p>
</div>
```

### 🎉 성공적인 개발을 위한 체크리스트

**매일 확인할 것:**
- [ ] 코드를 작은 단위로 나누어 작성
- [ ] 자주 저장하기 (Ctrl+S)
- [ ] 브라우저에서 결과 확인하기
- [ ] 에러 메시지 읽고 이해하기

**주간 확인할 것:**
- [ ] 새로운 개념 학습하기
- [ ] 기존 코드 리팩토링하기
- [ ] 작은 기능 추가하기
- [ ] 다른 개발자 코드 참고하기

---
