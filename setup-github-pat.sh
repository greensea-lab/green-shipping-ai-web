#!/bin/bash

echo "🔐 GitHub PAT 초기 설정"
echo "========================"

# PAT 입력 받기
read -s -p "Enter your GitHub Personal Access Token: " PAT
echo

# .env 파일에 PAT 추가
if [ -f ".env" ]; then
    if grep -q "GITHUB_PAT" .env; then
        # 기존 PAT 업데이트
        sed -i.bak "s/GITHUB_PAT=.*/GITHUB_PAT=$PAT/" .env
        echo "✅ 기존 PAT가 업데이트되었습니다."
    else
        # 새 PAT 추가
        echo "" >> .env
        echo "# GitHub Personal Access Token" >> .env
        echo "GITHUB_PAT=$PAT" >> .env
        echo "✅ PAT가 .env 파일에 저장되었습니다."
    fi
else
    # .env 파일이 없으면 생성
    echo "# GitHub Personal Access Token" > .env
    echo "GITHUB_PAT=$PAT" >> .env
    echo "✅ .env 파일이 생성되고 PAT가 저장되었습니다."
fi

# 원격 저장소 URL 업데이트 (green-shipping-ai-web으로 수정)
git remote set-url origin https://${PAT}@github.com/greensea-lab/green-shipping-ai-web.git

echo "✅ GitHub PAT 설정이 완료되었습니다!"
echo "📋 이제 다음 명령어로 Push할 수 있습니다:"
echo "   git push -u origin main"
echo ""
echo "🔒 보안 정보:"
echo "   - PAT는 .env 파일에 저장되었습니다 (gitignore에 포함됨)"
echo "   - 원격 저장소 URL에 PAT가 포함되어 자동 인증됩니다" 