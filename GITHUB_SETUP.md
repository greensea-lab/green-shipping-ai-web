# GitHub 원격 저장소 설정 가이드

## 🚀 GitHub 저장소에 프로젝트 Push하기

### 1. Git 저장소 초기화

```bash
# 현재 프로젝트 폴더에서 Git 저장소 초기화
git init

# Git 상태 확인
git status
```

### 2. Git 사용자 정보 설정

```bash
# Git 사용자 이름과 이메일 설정
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 설정 확인
git config --list
```

### 3. 파일들을 Git에 추가

```bash
# 모든 파일을 스테이징 영역에 추가
git add .

# 스테이징된 파일 확인
git status
```

### 4. 첫 번째 커밋 생성

```bash
# 초기 커밋 생성
git commit -m "Initial commit: Green Shipping AI Web project setup

- React + TypeScript + Ant Design 프로젝트 구조
- 개발 환경 설정 (ESLint, Prettier, TypeScript)
- 환경별 설정 (local, development, production)
- 초보자 친화적 README.md 가이드
- MyComponent 예제 컴포넌트
- 환경 정보 표시 컴포넌트"
```

### 5. GitHub 원격 저장소 연결

```bash
# 원격 저장소 추가
git remote add origin https://github.com/greensea-lab/green-shipping-ai-web.git

# 원격 저장소 확인
git remote -v
```

### 6. 메인 브랜치 설정

```bash
# 브랜치 이름을 main으로 설정 (GitHub 기본값)
git branch -M main

# 현재 브랜치 확인
git branch
```

### 7. GitHub에 Push

```bash
# 원격 저장소에 push
git push -u origin main
```

## 🔐 GitHub 인증 설정

### Personal Access Token 사용 (권장)

1. **GitHub에서 Personal Access Token 생성:**
   - GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - "Generate new token" 클릭
   - 권한 설정: `repo` (전체 저장소 접근 권한)
   - 토큰 생성 후 안전한 곳에 저장

2. **토큰 사용:**
   ```bash
   # Push할 때 사용자명과 토큰 입력
   # Username: your-github-username
   # Password: your-personal-access-token
   ```

### SSH 키 사용 (선택사항)

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# SSH 에이전트에 키 추가
ssh-add ~/.ssh/id_ed25519

# 공개 키 확인 (GitHub에 등록)
cat ~/.ssh/id_ed25519.pub
```

## 📋 전체 스크립트 (한 번에 실행)

```bash
#!/bin/bash

echo "🚀 GitHub 저장소 설정 시작..."

# 1. Git 초기화
git init

# 2. 사용자 정보 설정 (실제 정보로 변경하세요)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 3. 파일 추가
git add .

# 4. 초기 커밋
git commit -m "Initial commit: Green Shipping AI Web project setup

- React + TypeScript + Ant Design 프로젝트 구조
- 개발 환경 설정 (ESLint, Prettier, TypeScript)
- 환경별 설정 (local, development, production)
- 초보자 친화적 README.md 가이드
- MyComponent 예제 컴포넌트
- 환경 정보 표시 컴포넌트"

# 5. 원격 저장소 연결
git remote add origin https://github.com/greensea-lab/green-shipping-ai-web.git

# 6. 브랜치 설정
git branch -M main

# 7. Push (토큰 입력 필요)
echo "GitHub Personal Access Token을 입력하세요:"
git push -u origin main

echo "✅ GitHub 저장소 설정 완료!"
```

## 🔧 문제 해결

### 인증 오류

```bash
# Personal Access Token 재설정
git remote set-url origin https://github.com/greensea-lab/green-shipping-ai-web.git
```

### 브랜치 충돌

```bash
# 원격 브랜치와 로컬 브랜치 동기화
git pull origin main --allow-unrelated-histories
```

### 파일 권한 문제

```bash
# .gitignore 확인
cat .gitignore

# node_modules 제외 확인
git status
```

## 📝 커밋 메시지 가이드

### 좋은 커밋 메시지 예시:

```bash
git commit -m "feat: Add MyComponent example for beginners

- Create interactive MyComponent with Ant Design
- Add click handler with alert message
- Include Space component for better layout
- Update Home page to use new component"
```

### 커밋 타입:

- `feat`: 새 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드 프로세스 수정

## 🎯 다음 단계

1. **GitHub 저장소 확인:** https://github.com/greensea-lab/green-shipping-ai-web
2. **README.md 업데이트:** GitHub에서 직접 편집 가능
3. **Issues 생성:** 개발 계획이나 버그 리포트
4. **Pull Request:** 팀 협업을 위한 브랜치 전략

## 📚 추가 학습

- [Git 기본 명령어](https://git-scm.com/book/ko/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**💡 Tip:** Personal Access Token은 안전하게 보관하고, 필요시에만 생성하세요!
