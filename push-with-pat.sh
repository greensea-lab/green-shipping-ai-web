#!/bin/bash

echo "🚀 GitHub Push with PAT"
echo "======================="

# .env 파일에서 PAT 읽기 (괄호 문제 해결)
if [ -f ".env" ]; then
    # source 대신 grep으로 PAT 추출
    GITHUB_PAT=$(grep "^GITHUB_PAT=" .env | cut -d'=' -f2)
    
    if [ -z "$GITHUB_PAT" ]; then
        echo "❌ .env 파일에 GITHUB_PAT가 설정되지 않았습니다."
        echo "먼저 './setup-github-pat.sh'를 실행해주세요."
        exit 1
    fi
else
    echo "❌ .env 파일이 없습니다."
    echo "먼저 './setup-github-pat.sh'를 실행해주세요."
    exit 1
fi

# 원격 저장소 URL에 PAT 포함하여 설정
git remote set-url origin https://${GITHUB_PAT}@github.com/greensea-lab/green-shipping-ai-web.git

echo "📤 GitHub에 Push 중..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Push 완료!"
    echo "🌐 저장소 확인: https://github.com/greensea-lab/green-shipping-ai-web"
else
    echo "❌ Push 실패. PAT를 확인해주세요."
    echo "PAT 재설정: './setup-github-pat.sh'"
fi 